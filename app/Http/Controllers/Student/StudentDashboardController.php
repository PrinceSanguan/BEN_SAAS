<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class StudentDashboardController extends Controller
{
    /**
     * Display the Student dashboard.
     */
    public function index()
    {
        $username = Auth::user()->username;

        return Inertia::render('Student/StudentDashboard', [
            'username' => $username
        ]);
    }
}
