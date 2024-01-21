<?php

namespace App\Http\Controllers\Chat;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserContactController extends Controller
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

    $contacts = [];
    $contactsGroupByRoomID = [];

    foreach ($allContacts as $contact) {
      $contactsGroupByRoomID[$contact->room_id][] = $contact;
    }

    foreach ($contactsGroupByRoomID as $rooms) {
      $filteredFriendRooms = collect($rooms)->filter(function ($room) use ($userId) {
        return $room->status === 'friend' && $room->contact_id === $userId;
      });

      if ($filteredFriendRooms->isNotEmpty()) {
        foreach ($filteredFriendRooms as $friendRoom) {
          $contacts[] = collect($rooms)->filter(function ($room) use ($userId, $friendRoom) {
            return $room->room_id === $friendRoom->room_id && $room->contact_id !== $userId;
          })->first();
        }
      }
    }

    $messages = DB::table('room_user')
      ->join('messages', 'messages.room_id', 'room_user.room_id')
      ->whereIn('room_user.room_id', function (Builder $query) use ($userId) {
        $query->select('room_id')
          ->from('room_user')
          ->where('user_id', $userId);
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

    foreach ($contacts as $contact) {
      $filteredContact = $messages->filter(function ($message) use ($contact) {
        return $message->room_id === $contact->room_id && $message->user_id === $message->sender_id;
      });

      $contact->latest_message = $filteredContact->first();
      $contact->unread_messages = $filteredContact->filter(function ($message) use ($userId) {
        return $message->sender_id !== $userId;
      })->count();
    }

    return ResponseHelper::sendResponse(data: $contacts);
  }
}
