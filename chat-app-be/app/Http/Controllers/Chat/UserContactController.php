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
      ->leftJoin('messages', function (JoinClause $join) use ($userId) {
        $join->on('contacts.contact_user_id', '=', 'messages.sender_id')
          ->orOn('contacts.contact_user_id', '=', 'messages.receiver_id')
          ->when(function (Builder $query) use ($userId) {
            $query->where('messages.sender_id', $userId)->orWhere('messages.receiver_id', $userId);
          });
      })
      ->where('contacts.user_id', $userId)
      ->select('contacts.id', 'contacts.contact_user_id', 'users.username as contact_username', 'users.name as contact_name', 'users.profile_image_url as contact_profile_image', 'messages.content as latest_message', 'messages.created_at as latest_message_timestamp')
      ->orderBy('latest_message_timestamp', 'desc')
      ->get();

    return ResponseHelper::sendResponse(data: $contacts);
  }
}
