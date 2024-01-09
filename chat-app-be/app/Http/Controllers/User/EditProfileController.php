<?php

namespace App\Http\Controllers\User;

use Exception;
use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EditProfileController extends Controller
{
  public function edit(Request $request)
  {
    $fields = ['name', 'username'];
    $data = [];
    $rules = [];

    foreach ($fields as $field) {
      if ($request->has($field)) {
        if ($field === 'username') {
          $data[$field] = $request->input($field);
          $rules[$field] = ['required', 'string', 'max:255', 'lowercase', 'unique:users,username'];
        }

        if ($field === 'name') {
          $data[$field] = $request->input($field);
          $rules[$field] = ['required', 'string', 'max:255'];
        }
      }
    }

    $validator = Validator::make($data, $rules);

    if ($validator->fails()) {
      return ResponseHelper::sendResponse(message: $validator->messages());
    }

    try {
      $updated = User::where('id', $request->user()->id)->update($data);

      return ResponseHelper::sendResponse(data: $updated);
    } catch (Exception $exception) {
      return ResponseHelper::sendResponse(500, $exception->getMessage());
    }
  }
}
