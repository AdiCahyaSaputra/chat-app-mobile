<?php

namespace App\Http\Controllers\Auth;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
  /**
   * Handle an incoming registration request.
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function store(Request $request): JsonResponse
  {
    $validator = Validator::make($request->only('name', 'username', 'password', 'password_confirmation'), [
      'name' => ['required', 'string', 'max:255'],
      'username' => ['required', 'string', 'max:255', 'lowercase', 'unique:users,username'],
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    if ($validator->fails()) {
      return ResponseHelper::sendResponse(message: $validator->messages());
    }

    try {
      $user = User::create([
        'name' => $request->name,
        'username' => $request->username,
        'password' => Hash::make($request->password),
      ]);

      return ResponseHelper::sendResponse(201, data: $user);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(500, $exception->getMessage());
    }
  }
}
