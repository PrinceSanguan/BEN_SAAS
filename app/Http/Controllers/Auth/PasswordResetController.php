<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Models\User;
use App\Mail\PasswordResetMail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/ForgotPassword');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('parent_email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'No account found with this email address.']);
        }

        // Delete any existing tokens for this user
        DB::table('password_resets')->where('email', $request->email)->delete();

        // Create new token
        $token = Str::random(64);

        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);

        // Send the password reset email
        try {
            Mail::to($request->email)->send(new PasswordResetMail($token, $request->email));

            return Inertia::render('auth/ForgotPassword', [
                'success' => true,
                'email' => $request->email,
                'message' => 'Password reset link has been sent to your email address.'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['email' => 'Failed to send reset email. Please try again later.']);
        }
    }

    public function edit($token)
    {
        return Inertia::render('auth/ResetPassword', [
            'token' => $token
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            ],
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        ]);

        $passwordReset = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$passwordReset) {
            return back()->withErrors(['email' => 'Invalid reset token.']);
        }

        // Check if token is valid and not expired (1 hour)
        if (
            !Hash::check($request->token, $passwordReset->token) ||
            Carbon::parse($passwordReset->created_at)->addHour()->isPast()
        ) {
            return back()->withErrors(['email' => 'This password reset token is invalid or has expired.']);
        }

        $user = User::where('parent_email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'User not found.']);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Delete the reset token
        DB::table('password_resets')->where('email', $request->email)->delete();

        return redirect()->route('login')->with('status', 'Your password has been reset successfully.');
    }
}
