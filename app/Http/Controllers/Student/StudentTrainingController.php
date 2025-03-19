<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Block;
use Inertia\Inertia;

class StudentTrainingController extends Controller
{
    /**
     * Display the Student training.
     */
    public function index()
    {
        // Get all blocks with their training sessions
        $blocks = Block::with(['sessions' => function ($query) {
            $query->orderBy('week_number')->orderBy('session_number');
        }])->orderBy('block_number')->get();

        // Format data for the frontend
        $formattedBlocks = $blocks->map(function ($block) {
            // Group sessions by week
            $sessionsByWeek = collect($block->sessions)->groupBy('week_number');

            $weeks = $sessionsByWeek->map(function ($sessions, $weekNumber) {
                return [
                    'week_number' => $weekNumber,
                    'sessions' => $sessions->map(function ($session) {
                        return [
                            'id' => $session->id,
                            'session_number' => $session->session_number,
                            'session_type' => $session->session_type,
                            'is_completed' => false, // You would check completion status here
                            'label' => $session->session_type === 'testing'
                                ? 'TESTING'
                                : ($session->session_type === 'rest'
                                    ? 'REST – NO FIELD TO COMPLETE'
                                    : "Session {$session->session_number}")
                        ];
                    })->values()
                ];
            })->values();

            return [
                'id' => $block->id,
                'block_number' => $block->block_number,
                'weeks' => $weeks
            ];
        });

        return Inertia::render('Student/StudentTraining', [
            'blocks' => $formattedBlocks
        ]);
    }
}
