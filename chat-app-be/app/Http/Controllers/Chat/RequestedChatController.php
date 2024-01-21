<?php

namespace App\Http\Controllers\Chat;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\Room;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RequestedChatController extends Controller
{
  public function show(Request $request)
  {
    $userId = $request->user()->id;

    $allContacts = DB::table('room_user')
      ->join('rooms', 'rooms.id', 'room_user.room_id')
      ->join('users', 'users.id', 'room_user.user_id')
      ->whereIn('room_user.room_id', function (Builder $query) use ($userId) {
        $query->select('room_id')
          ->from('room_user')
          ->where('user_id', $userId); // Get room_id where room_user.user_id is $userId
      })
      ->where('rooms.is_blocked', false)
      ->select(
        'room_user.room_id',
        'room_user.status',
        'users.id as contact_id',
        'users.name as contact_name',
        'users.username as contact_username',
        'users.profile_image_url as contact_profile_image'
      )
      ->get();

    $requestedFriends = [];
    $contactsGroupByRoomID = [];

    foreach ($allContacts as $contact) {
      $contactsGroupByRoomID[$contact->room_id][] = $contact;
    }

    foreach ($contactsGroupByRoomID as $rooms) {
      $filteredFriendRooms = collect($rooms)->filter(function ($room) use ($userId) {
        return $room->status === 'request' && $room->contact_id === $userId;
      });

      if ($filteredFriendRooms->isNotEmpty()) {
        foreach ($filteredFriendRooms as $friendRoom) {
          $requestedFriends[] = collect($rooms)->filter(function ($room) use ($userId, $friendRoom) {
            return $room->room_id === $friendRoom->room_id && $room->contact_id !== $userId;
          })->first();
        }
      }
    }

    $messages = DB::table('room_user')
      ->join('messages', 'messages.room_id', 'room_user.room_id')
      ->where('room_user.room_id', function (Builder $query) use ($userId) {
        $query->select('room_id')->from('room_user')->where('user_id', $userId)->first();
      })
      ->select(
        'room_user.room_id',
        'room_user.user_id',
        'messages.sender_id',
        'messages.content',
        'messages.is_read'
      )
      ->orderBy('messages.created_at', 'desc')
      ->get();

    foreach ($requestedFriends as $contact) {
      $filteredContact = $messages->filter(function ($message) use ($contact, $userId) {
        return $message->room_id === $contact->room_id && $message->sender_id !== $userId && $message->user_id !== $userId;
      });

      $contact->latest_message = $filteredContact->first();
      $contact->unread_messages = $filteredContact->count();
    }

    return ResponseHelper::sendResponse(data: $requestedFriends);
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
      $addFriend = DB::table('room_user')
        ->whereIn('room_user.room_id', function (Builder $query) use ($validator) {
          $query->select('room_id')
            ->from('room_user')
            ->where('user_id', $validator->getData('contact_user_id'));
        })
        ->where('room_user.user_id', $request->user()->id)
        ->update([
          'status' => 'friend'
        ]);

      return ResponseHelper::sendResponse(data: $addFriend);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(500, $exception->getMessage());
    }
  }

  public function destroy($room_id)
  {
    try {
      $blocked = Room::where('id', $room_id)->update([
        'is_blocked' => true
      ]);

      return ResponseHelper::sendResponse(data: $blocked);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(message: $exception->getMessage());
    }
  }
}
