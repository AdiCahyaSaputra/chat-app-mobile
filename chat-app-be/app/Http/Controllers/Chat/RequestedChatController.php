<?php

namespace App\Http\Controllers\Chat;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\User;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RequestedChatController extends Controller
{
  public function show(Request $request)
  {
    $userId = $request->user()->id;

    $existingContacts = DB::table('contacts')
      ->where('contacts.user_id', $userId)->get('id');

    if ($existingContacts->isEmpty()) {
      $contacts = DB::table('contacts')
        ->join('users', 'contacts.user_id', '=', 'users.id')
        ->where('contacts.contact_user_id', $userId)
        ->where('contacts.is_blocked', false)
        ->select('contacts.id', 'users.id as contact_user_id', 'users.username as contact_username', 'users.name as contact_name', 'users.profile_image_url as contact_profile_image')
        ->get();

      $latest_messages = DB::table('contacts')
        ->leftJoin('messages', function (JoinClause $join) use ($userId) {
          $join->on('contacts.contact_user_id', '=', 'messages.sender_id')
            ->orOn('contacts.contact_user_id', '=', 'messages.receiver_id')
            ->when(function (Builder $query) use ($userId) {
              $query->where('messages.sender_id', $userId)->orWhere('messages.receiver_id', $userId);
            });
        })
        ->where('contacts.contact_user_id', $userId)
        ->select('contacts.id', 'messages.content as latest_message', 'messages.created_at as latest_message_timestamp')
        ->get();

      foreach ($contacts as $contact) {
        foreach ($latest_messages as $latest_message) {
          if ($latest_message->id === $contact->id) {
            $contact->latest_message = $latest_message->latest_message;
            $contact->latest_message_timestamp = $latest_message->latest_message_timestamp;
          }
        }
      }

      return ResponseHelper::sendResponse(data: $contacts);
    }

    return ResponseHelper::sendResponse(message: 'No requested chat');
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->only('contact_user_id'), [
      'contact_user_id' => 'required|exists:users,id'
    ]);

    if ($validator->fails()) {
      return ResponseHelper::sendResponse(message: $validator->messages());
    }

    try {
      $addFriend = DB::table('contacts')->insert([
        'user_id' => $request->user()->id,
        'contact_user_id' => $request->contact_user_id
      ]);

      return ResponseHelper::sendResponse(data: $addFriend);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(500, $exception->getMessage());
    }
  }

  public function destroy($contact_id)
  {
    try {
      $blocked = Contact::where('id', $contact_id)->update([
        'is_blocked' => true
      ]);

      return ResponseHelper::sendResponse(data: $blocked);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(message: $exception->getMessage());
    }
  }
}
