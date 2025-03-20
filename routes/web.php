<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;

/*
|--------------------------------------------------------------------------
| This controller handles the homepage and other public-facing pages that don't require authentication
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');

/*
|--------------------------------------------------------------------------
| This controller handles Register Logic
|--------------------------------------------------------------------------
*/

Route::get('register', [RegisteredUserController::class, 'index'])->name('register');


/*
|--------------------------------------------------------------------------
| This controller handles Login Logic
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Auth\LoginController;

Route::get('login', [LoginController::class, 'index'])->name('login');
Route::post('login', [LoginController::class, 'store'])->name('login.submit');

/*
|--------------------------------------------------------------------------
| This controller handles All Admin Logic
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Middleware\AdminMiddleware;

Route::middleware([AdminMiddleware::class])->group(function () {
    // Dashboard route
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // Athletes routes
    Route::get('/admin/athletes', [AdminDashboardController::class, 'athletes'])->name('admin.athletes');

    Route::post('/admin/athletes', [AdminDashboardController::class, 'createAthlete'])->name('admin.athletes.store');
    Route::post('/admin/create-athlete', [AdminDashboardController::class, 'createAthlete'])->name('admin.createAthlete');

    Route::get('/admin/analytics', [AdminDashboardController::class, 'analytics'])->name('admin.analytics');
    Route::get('/admin/settings', [AdminDashboardController::class, 'settings'])->name('admin.settings');

    Route::post('/admin/logout', [LoginController::class, 'logout'])->name('admin.logout');
});

/*
|--------------------------------------------------------------------------
| This controller handles All Student Logic
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentTrainingController;
use App\Http\Middleware\StudentMiddleware;

Route::middleware(StudentMiddleware::class)->group(function () {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
    Route::get('/student/training', [StudentTrainingController::class, 'index'])->name('student.training');
    Route::get('/training/session/{sessionId}', [StudentTrainingController::class, 'showSession'])->name('training.session.show');
});
