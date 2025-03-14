<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'show'])->name('admin.dashboard');
    Route::post('athletes', [AdminDashboardController::class, 'createAthlete'])->name('admin.athletes.create');
});

Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
