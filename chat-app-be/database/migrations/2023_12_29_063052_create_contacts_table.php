<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('contacts', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->references('id')->on('users');
      $table->foreignId('contact_user_id')->references('id')->on('users');
      $table->unique(['user_id', 'contact_user_id']);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('contacts');
  }
};
