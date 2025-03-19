<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class AdminAthletesController extends Controller
{
    public function index()
    {
        // Basic implementation to fetch athletes
        $athletes = User::where('role', 'athlete')
            ->orWhere('role', 'user')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'athletes' => $athletes,
            'activePage' => 'athletes'
        ]);
    }

    public function store(Request $request)
    {
        // Basic validation
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // Create the user with athlete role
        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'athlete',
        ]);

        return redirect()->route('admin.athletes')
            ->with('success', 'Athlete added successfully');
    }
}
