<?php

namespace App\Http\Controllers\Chat;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\Message;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MessagesController extends Controller
{
  public function show($room_id, Request $request)
  {
    $messages = DB::table('room_user')
      ->join('rooms', 'rooms.id', 'room_user.room_id')
      ->join('messages', 'messages.room_id', 'rooms.id')
      ->join('users', 'users.id', 'messages.sender_id')
      ->where('rooms.id', $room_id)
      ->where('room_user.user_id', $request->user()->id)
      ->select(
        'rooms.id as room_id',
        'rooms.is_blocked',
        'users.username as sender',
        'users.profile_image_url as profile_image_url',
        'messages.id as message_id',
        'messages.content',
        'messages.is_read',
        'messages.created_at as date',
      )
      ->get();

    if ($messages->isEmpty()) {
      return ResponseHelper::sendResponse(message: 'No messages');
    }

    foreach ($messages as $message) {
      $message->sender = '@' . $message->sender;
      $message->date = Carbon::parse($message->date)->timezone('Asia/Jakarta')->format('h:i A');
    }

    return ResponseHelper::sendResponse(data: $messages);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->only('message_content', 'room_id'), [
      'message_content' => 'required|string',
      'room_id' => 'required|exists:rooms,id'
    ]);

    if ($validator->fails()) {
      return ResponseHelper::sendResponse(message: $validator->messages());
    }

    try {
      $created_message = Message::create([
        'sender_id' => $request->user()->id,
        'room_id' => $request->room_id,
        'content' => $request->message_content
      ]);

      return ResponseHelper::sendResponse(data: $created_message);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(message: $exception->getMessage(), status: 500);
    }
  }

  public function read($room_id)
  {
    try {
      $readAll = DB::table('messages')
        ->where('messages.room_id', $room_id)
        ->update([
          'is_read' => true
        ]);

      return ResponseHelper::sendResponse(data: $readAll);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(500, $exception->getMessage());
    }
  }
}
