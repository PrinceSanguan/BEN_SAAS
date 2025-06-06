<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('subject');
            $table->longText('content');
            $table->timestamps();
        });

        // Insert default templates
        DB::table('email_templates')->insert([
            [
                'name' => 'password_reset',
                'subject' => 'Reset Your Password - Young Athlete Training',
                'content' => '# 🏃‍♂️ Young Athlete Training

## Password Reset Request

Hello,

We received a request to reset the password for your Young Athlete Training account associated with **{{ $email }}**.

Click the link below to reset your password:
{{ $resetUrl }}

**⚠️ Important:**
- This link will expire in **1 hour**
- This link can only be used **once**
- If you didn\'t request this reset, please ignore this email

© Young Athlete Training. All rights reserved.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'welcome',
                'subject' => 'Welcome to Young Athlete Training - Set Up Your Password',
                'content' => '# 🏆 Welcome to Young Athlete Training!

## Hello!

A training account has been created for **{{ $username }}**.

To get started with the training program, you\'ll need to set up a password for this account.

Click here to set up your password:
{{ $resetUrl }}

**Account Details:**
- **Username:** {{ $username }}
- **Email:** {{ $email }}

**🔒 Security Note:** This password setup link will expire in 1 hour for security reasons.

If you didn\'t expect this email, please contact your training administrator.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('email_templates');
    }
};
