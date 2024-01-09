<?php

namespace App\Http\Controllers\Auth;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
  /**
   * Handle an incoming authentication request.
   */
  public function store(Request $request): JsonResponse // LoginRequest type implement RateLimiter function but use default Request for practice
  {
    $validator = Validator::make($request->only('username', 'password', 'device_name'), [
      'username' => ['required', 'string', 'max:255', 'lowercase', 'exists:users,username'],
      'password' => ['required', Rules\Password::defaults()],
      'device_name' => ['required']
    ]);

    if ($validator->fails()) {
      return ResponseHelper::sendResponse(message: $validator->messages());
    }

    try {
      $user = User::where('username', $request->username)->first();

      if (!$user || !Hash::check($request->password, $user->password)) {
        return ResponseHelper::sendResponse(message: [
          'username' => ['The provided credentials are incorrect.'],
          'password' => ['The provided credentials are incorrect.'],
        ]);
      }

      $token = $user->createToken($request->device_name)->plainTextToken;

      return ResponseHelper::sendResponse(data: [
        'token' => $token,
        'user' => $user
      ]);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(500, $exception->getMessage());
    }
  }

  /**
   * Destroy an authenticated session.
   */
  public function destroy(Request $request): JsonResponse
  {
    $request->user()->tokens()->delete();

    return ResponseHelper::sendResponse(message: 'Successfully logout');
  }
}
