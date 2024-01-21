<?php

namespace App\Http\Controllers\Chat;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FindFriendsController extends Controller
{
  public function show(string $search)
  {
    if ($search) {
      $friends = User::where('username', 'like', "%$search%")->get();

      return ResponseHelper::sendResponse(data: $friends);
    }

    return ResponseHelper::sendResponse();
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->only('username'), [
      'username' => 'required|string|exists:users,username'
    ]);

    if ($validator->fails()) {
      return ResponseHelper::sendResponse(message: $validator->messages());
    }

    try {
      $user = User::where('username', $validator->getData('username'))->first('id');

      DB::transaction(function () use ($request, $user) {
        $roomId = DB::table('rooms')->insertGetId([
          'created_at' => now(),
          'updated_at' => now(),
        ]);

        DB::table('room_user')->insert([
          ['room_id' => $roomId, 'user_id' => $request->user()->id, 'status' => 'friend'],
          ['room_id' => $roomId, 'user_id' => $user->id, 'status' => 'request'],
        ]);

        return ResponseHelper::sendResponse();
      });
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(500, $exception->getMessage());
    }
  }
}
