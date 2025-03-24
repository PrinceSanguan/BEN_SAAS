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
    public function index()
    {
        return Inertia::render('Auth/login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($request->boolean('isAdmin')) {
            if ($request->username === 'admin' && $request->password === 'admin') {
                $adminUser = User::firstOrCreate(
                    ['username' => 'admin'],
                    [
                        'password' => Hash::make('admin'),
                        'user_role' => 'admin',
                        'email' => 'admin@example.com',
                    ]
                );

                if ($adminUser->user_role !== 'admin') {
                    $adminUser->user_role = 'admin';
                    $adminUser->save();
                }

                Auth::login($adminUser);
                return redirect()->route('admin.dashboard');
            } else {
                return redirect()->route('login')
                    ->withErrors(['credentials' => 'Invalid admin credentials.']);
            }
        }

        $user = User::where('username', $request->username)->first();

        if (!$user) {
            return redirect()->route('login')
                ->withErrors(['credentials' => 'No account found with this username.']);
        }

        if (!Hash::check($request->password, $user->password)) {
            return redirect()->route('login')
                ->withErrors(['credentials' => 'The password you entered is incorrect.']);
        }

        if (empty($user->user_role)) {
            return redirect()->route('login')
                ->withErrors(['credentials' => 'Your account does not have access permissions.']);
        }

        Auth::login($user);

        if ($user->user_role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($user->user_role === 'student') {
            return redirect()->route('student.dashboard');
        } else {
            return redirect()->route('home');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
