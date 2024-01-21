<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Chat\FindFriendsController;
use App\Http\Controllers\Chat\MessagesController;
use App\Http\Controllers\Chat\RequestedChatController;
use App\Http\Controllers\Chat\UserContactController;
use App\Http\Controllers\User\EditProfileController;
use App\Http\Controllers\User\UploadImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/hello', function () {
  return response()->json([
    'message' => 'Hello Bre'
  ]);
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
  return $request->user();
});

Route::prefix('v1')->group(function () {
  Route::post('/register', [RegisteredUserController::class, 'store']);
  Route::post('/login', [AuthenticatedSessionController::class, 'store']);
  Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

  Route::post('/profile-image', [UploadImageController::class, 'edit'])->middleware('auth:sanctum');
  Route::delete('/profile-image', [UploadImageController::class, 'destroy'])->middleware('auth:sanctum');
  Route::put('/profile', [EditProfileController::class, 'edit'])->middleware('auth:sanctum');

  Route::get('/friends/{search}', [FindFriendsController::class, 'show'])->middleware('auth:sanctum');
  Route::post('/friends', [FindFriendsController::class, 'store'])->middleware('auth:sanctum');

  Route::get('/chat/contacts', [UserContactController::class, 'show'])->middleware('auth:sanctum');
  Route::get('/chat/message/{room_id}', [MessagesController::class, 'show'])->middleware('auth:sanctum');
  Route::post('/chat/message', [MessagesController::class, 'store'])->middleware('auth:sanctum');

  Route::put('/chat/message/{room_id}', [MessagesController::class, 'read'])->middleware('auth:sanctum');

  Route::get('/chat/request', [RequestedChatController::class, 'show'])->middleware('auth:sanctum');
  Route::post('/chat/request/accept', [RequestedChatController::class, 'store'])->middleware('auth:sanctum');
  Route::post('/chat/request/block/{room_id}', [RequestedChatController::class, 'destroy'])->middleware('auth:sanctum');
});
