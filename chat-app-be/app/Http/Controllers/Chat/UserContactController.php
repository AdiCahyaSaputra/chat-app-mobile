<?php

namespace App\Http\Controllers\Chat;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserContactController extends Controller
{
  public function show(Request $request)
  {
    $userId = $request->user()->id;

    $contacts = DB::table('contacts')
      ->join('users', 'contacts.contact_user_id', '=', 'users.id')
      ->where('contacts.user_id', $userId)
      ->select('contacts.id', 'contacts.contact_user_id', 'users.username as contact_username', 'users.name as contact_name', 'users.profile_image_url as contact_profile_image')
      ->get();

    $latest_messages = DB::table('contacts')
      ->leftJoin('messages', function (JoinClause $join) use ($userId) {
        $join->on('contacts.contact_user_id', '=', 'messages.sender_id')
          ->orOn('contacts.contact_user_id', '=', 'messages.receiver_id')
          ->when(function (Builder $query) use ($userId) {
            $query->where('messages.sender_id', $userId)->orWhere('messages.receiver_id', $userId);
          });
      })
      ->where('contacts.user_id', $userId)
      ->select('contacts.id', 'messages.content as latest_message', 'messages.created_at as latest_message_timestamp', 'messages.is_read', 'messages.sender_id')
      ->get();

    foreach ($contacts as $contact) {
      $contact->unread_messages  = 0;

      if (!$latest_messages->isEmpty()) {
        foreach ($latest_messages as $latest_message) {
          if ($latest_message->id === $contact->id) {
            $contact->latest_message = $latest_message->latest_message;
            $contact->latest_message_timestamp = $latest_message->latest_message_timestamp;

            if ($latest_message->is_read === false && $latest_message->sender_id !== $request->user()->id) {
              $contact->unread_messages++;
            }
          }
        }
      }
    }

    return ResponseHelper::sendResponse(data: $contacts);
  }
}
