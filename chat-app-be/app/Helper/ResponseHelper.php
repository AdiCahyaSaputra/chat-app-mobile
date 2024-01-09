<?php

namespace App\Helper;

class ResponseHelper
{
  public static function sendResponse($status = 200, $message = "ok", $data = [])
  {
    return response()->json([
      'status' => $status,
      'message' => $message,
      'data' => $data
    ], $status);
  }
}
