<?php

namespace App\Http\Controllers\Chat;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\Message;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MessagesController extends Controller
{
  public function show($receiver_id, Request $request)
  {
    $user_id = $request->user()->id;

    $messages = DB::table('messages')
      ->join('users as senders', 'senders.id', 'messages.sender_id')
      ->join('users as receivers', 'receivers.id', 'messages.receiver_id')
      ->when(function (Builder $query) use ($receiver_id, $user_id) {
        $query->where('receivers.id', $receiver_id)
          ->orWhere('receivers.id', $user_id);
      })
      ->when($receiver_id, function (Builder $query) {
        $query->select('receivers.profile_image_url', 'senders.username as sender', 'messages.content as message', 'messages.created_at as date');
      })
      ->when($user_id, function (Builder $query) {
        $query->select('senders.profile_image_url', 'senders.username as sender', 'messages.content as message', 'messages.created_at as date');
      })
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
    $validator = Validator::make($request->only('message_content', 'receiver_id'), [
      'message_content' => 'required|string',
      'receiver_id' => 'required|exists:users,id'
    ]);

    if ($validator->fails()) {
      return ResponseHelper::sendResponse(message: $validator->messages());
    }

    try {
      $created_message = Message::create([
        'sender_id' => $request->user()->id,
        'receiver_id' => $request->receiver_id,
        'content' => $request->message_content
      ]);

      return ResponseHelper::sendResponse(data: $created_message);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(message: $exception->getMessage(), status: 500);
    }
  }
}
