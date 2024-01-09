<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;

class ImageUploadRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'file' => 'required|mimes:jpg,jpeg,jpe,png|max:2048'
    ];
  }

  public function messages()
  {
    return [
      'file.required' => 'A file is required!',
      'file.mimes' => 'Accepted file types: jpg, jpeg, jpe, png',
      'file.max' => 'Maximum file size 2MB'
    ];
  }
}
