<?php

namespace App\Http\Controllers\User;

use App\Helper\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SplFileInfo;

class UploadImageController extends Controller
{
  public function edit(Request $request)
  {
    if (!is_null($request->user()->profile_image_url)) {
      $file = new SplFileInfo($request->user()->profile_image_url);

      Storage::delete('public/image/' . $file->getFilename());
    }

    if ($_FILES['image']) { // I think it's vulnerable but i dont care cuz $request->file('image') is sucks
      // return ResponseHelper::sendResponse(data: pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
      $image = file_get_contents($_FILES['image']['tmp_name']);
      $pathToFile = storage_path('app/public/image/' . $request->user()->username . '-' . $_FILES['image']['name']);

      file_put_contents($pathToFile, $image);

      try {
        $uploaded = User::where('id', $request->user()->id)->update([
          'profile_image_url' => 'storage/image/' . $_FILES['image']['name']
        ]);

        return ResponseHelper::sendResponse(data: $uploaded);
      } catch (Exception $exception) {
        Log::log(message: $exception->getMessage());
        return ResponseHelper::sendResponse(500, $exception->getMessage());
      }
    }

    return ResponseHelper::sendResponse(message: 'You send nothing, but is ok');
  }

  public function destroy(Request $request)
  {
    if (!is_null($request->user()->profile_image_url)) {
      try {
        $uploaded = User::where('id', $request->user()->id)->update([
          'profile_image_url' => null
        ]);

        $file = new SplFileInfo($request->user()->profile_image_url);

        Storage::delete('public/image/' . $file->getFilename());

        return ResponseHelper::sendResponse(data: $uploaded);
      } catch (Exception $exception) {
        Log::log(message: $exception->getMessage());
        return ResponseHelper::sendResponse(500, $exception->getMessage());
      }
    }

    return ResponseHelper::sendResponse(400, 'Failed to destroy your image');
  }
}
