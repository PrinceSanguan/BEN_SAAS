<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Allow the request if user is a student OR if admin is viewing as student
        if (Auth::check() && (Auth::user()->user_role === 'student' || session()->has('admin_viewing_as_student'))) {
            // Add an admin banner to the response if admin is viewing as student
            $response = $next($request);

            if (session()->has('admin_viewing_as_student')) {
                $html = $response->getContent();

                // Create the admin banner HTML
                $adminBanner = '
                <div class="fixed top-0 left-0 right-0 bg-amber-600 text-white py-2 px-4 z-50">
                    <div class="container mx-auto flex items-center justify-between">
                        <span>You are viewing as student (Admin Mode)</span>
                        <a href="' . route('admin.switch.back') . '" class="bg-white text-amber-700 px-3 py-1 rounded-md text-sm hover:bg-amber-100">
                            Switch back to Admin
                        </a>
                    </div>
                </div>
                <style>
                    body { padding-top: 40px; }
                </style>
                ';

                // Insert the banner after the body tag
                $modifiedHtml = str_replace('<body', '<body' . $adminBanner, $html);
                $response->setContent($modifiedHtml);
            }

            return $response;
        }

        // If not a student or admin viewing as student, redirect to login
        return redirect()->route('login')->with('error', 'Unauthorized access.');
    }
}
