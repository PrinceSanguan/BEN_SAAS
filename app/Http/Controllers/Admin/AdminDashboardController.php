<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function show(): Response
    {
        return Inertia::render('admin/dashboard');
    }
}
