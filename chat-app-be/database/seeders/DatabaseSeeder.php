<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    // \App\Models\User::factory(10)->create();

    // \App\Models\User::factory()->create([
    //     'name' => 'Test User',
    //     'email' => 'test@example.com',
    // ]);

    User::create([
      'name' => 'Adi Cahya Saputra',
      'username' => 'adics',
      'password' => bcrypt('hehe1234')
    ]);

    User::create([
      'name' => 'Jane Doe',
      'username' => 'jane',
      'password' => bcrypt('hehe1234')
    ]);

    User::factory(10)->create();
  }
}
