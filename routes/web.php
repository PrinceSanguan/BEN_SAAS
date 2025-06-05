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
use App\Http\Controllers\Auth\PasswordResetController;

Route::get('login', [LoginController::class, 'index'])->name('login');
Route::post('login', [LoginController::class, 'store'])->name('login.submit');

// Add Password Reset Routes
Route::get('forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
Route::post('forgot-password', [PasswordResetController::class, 'store'])->name('password.email');
Route::get('reset-password/{token}', [PasswordResetController::class, 'edit'])->name('password.reset');
Route::post('reset-password', [PasswordResetController::class, 'update'])->name('password.update');

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
    Route::delete('/admin/athletes/{id}', [AdminDashboardController::class, 'deleteAthlete'])->name('admin.athletes.delete');

    // NEW: Get athlete details
    Route::get('/admin/athletes/{id}', [AdminDashboardController::class, 'getAthlete'])->name('admin.athletes.show');

    // NEW: Update athlete
    Route::put('/admin/athletes/{id}', [AdminDashboardController::class, 'updateAthlete'])->name('admin.athletes.update');

    // NEW: View athlete dashboard as admin
    Route::get('/admin/athletes/{id}/dashboard', [AdminDashboardController::class, 'viewAthleteDashboard'])->name('admin.athletes.dashboard');

    Route::get('/admin/analytics', [AdminDashboardController::class, 'analytics'])->name('admin.analytics');
    Route::get('/admin/settings', [AdminDashboardController::class, 'settings'])->name('admin.settings');

    Route::post('/admin/update-block-dates', [AdminDashboardController::class, 'updateBlockDates'])->name('admin.update.block.dates');

    Route::post('/admin/athletes/{id}/send-reset', [AdminDashboardController::class, 'sendPasswordReset'])->name('admin.athletes.send-reset');
});

Route::post('/admin/logout', [LoginController::class, 'logout'])->name('admin.logout');

/*
|--------------------------------------------------------------------------
| This controller handles All Student Logic
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentTrainingController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\Student\ProgressController;
use App\Http\Controllers\Student\XpController;
use App\Http\Middleware\StudentMiddleware;

Route::middleware(StudentMiddleware::class)->group(function () {
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
    Route::get('/student/training', [StudentTrainingController::class, 'index'])->name('student.training');
    Route::get('/training/session/{sessionId}', [StudentTrainingController::class, 'showSession'])->name('training.session.show');
    Route::post('/training/session/{sessionId}/save', [StudentTrainingController::class, 'saveTrainingResult'])->name('training.session.save');
    // Add these routes to your Student middleware group
    Route::get('/leaderboard/consistency', [LeaderboardController::class, 'consistency'])->name('leaderboard.consistency');
    Route::get('/leaderboard/strength', [LeaderboardController::class, 'strength'])->name('leaderboard.strength');

    Route::get('/progress', [ProgressController::class, 'index'])->name('student.progress');
    Route::post('/progress/recalculate', [ProgressController::class, 'recalculateProgress'])->name('student.progress.recalculate');
    Route::get('/student/xp', [XpController::class, 'index'])->name('student.xp');
    Route::get('/student/xp/progress', [XpController::class, 'showLevelProgress'])->name('student.xp.progress');
});
