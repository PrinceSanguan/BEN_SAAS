<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Display the Login Page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle user login
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // Try to find the user by username
        $user = User::where('username', $request->username)->first();

        // User not found
        if (!$user) {
            return redirect()->route('auth.login')
                ->withErrors(['credentials' => 'No account found with this username.']);
        }

        // Check if credentials are correct
        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('auth.login')
                ->withErrors(['credentials' => 'The password you entered is incorrect.']);
        }

        // Check if user has a role
        if (empty($user->user_role)) {
            return redirect()->route('auth.login')
                ->withErrors(['credentials' => 'Your account does not have access permissions.']);
        }

        // Authenticate the user
        Auth::login($user);

        // Redirect based on user role
        if ($user->user_role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($user->user_role === 'student') {
            return redirect()->route('student.dashboard');
        } else {
            // Fallback for any other role
            return redirect()->route('home');
        }
    }
}
