<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the admin user
        User::create([
            'username' => 'admin',
            'parent_email' => 'admin@gmail.com',
            'password' => Hash::make('admin'),
            'user_role' => 'admin',
        ]);

        // Create the student user
        // User::create([
        //     'username' => 'student',
        //     'parent_email' => 'student@gmail.com',
        //     'password' => Hash::make('student'),
        //     'user_role' => 'student',
        // ]);
    }
}
