<?php

namespace App\Http\Controllers\Chat;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\Contact;
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

      $addFriend = DB::table('contacts')->insert([
        'user_id' => $request->user()->id,
        'contact_user_id' => $user->id
      ]);

      return ResponseHelper::sendResponse(data: $addFriend);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(500, $exception->getMessage());
    }
  }
}
