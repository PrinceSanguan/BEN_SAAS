<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\TrainingResult;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class StudentTrainingController extends Controller
{
    /**
     * Display the Student training.
     */
    public function index()
    {
        $user = Auth::user();

        // Get all blocks with their training sessions
        $blocks = Block::with(['sessions' => function ($query) {
            $query->orderBy('week_number')->orderBy('session_number');
        }])->orderBy('block_number')->get();

        // Get user's completed training sessions
        $completedSessions = TrainingResult::where('user_id', $user->id)
            ->pluck('session_id')
            ->toArray();

        // Format data for the frontend
        $formattedBlocks = $blocks->map(function ($block) use ($completedSessions) {
            // Group sessions by week
            $sessionsByWeek = collect($block->sessions)->groupBy('week_number');

            $weeks = $sessionsByWeek->map(function ($sessions, $weekNumber) use ($completedSessions) {
                return [
                    'week_number' => $weekNumber,
                    'sessions' => $sessions->map(function ($session) use ($completedSessions) {
                        return [
                            'id' => $session->id,
                            'session_number' => $session->session_number,
                            'session_type' => $session->session_type,
                            'is_completed' => in_array($session->id, $completedSessions),
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

    public function showSession($sessionId)
    {
        $user = Auth::user();
        $session = TrainingSession::with('block')->findOrFail($sessionId);

        // Get existing result if any
        $trainingResult = TrainingResult::where('user_id', $user->id)
            ->where('session_id', $sessionId)
            ->first();

        return Inertia::render('Student/TrainingSession', [
            'session' => [
                'id' => $session->id,
                'week_number' => $session->week_number,
                'session_number' => $session->session_number,
                'session_type' => $session->session_type,
                'block_number' => $session->block ? $session->block->block_number : null,
            ],
            'existingResult' => $trainingResult ? [
                'warmup_completed' => $trainingResult->warmup_completed,
                'plyometrics_score' => $trainingResult->plyometrics_score,
                'power_score' => $trainingResult->power_score,
                'lower_body_strength_score' => $trainingResult->lower_body_strength_score,
                'upper_body_core_strength_score' => $trainingResult->upper_body_core_strength_score,
                'completed_at' => $trainingResult->completed_at,
            ] : null
        ]);
    }

    public function saveTrainingResult(Request $request, $sessionId)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'warmup_completed' => 'required|in:YES,NO',
            'plyometrics_score' => 'required|string',
            'power_score' => 'required|string',
            'lower_body_strength_score' => 'required|string',
            'upper_body_core_strength_score' => 'required|string',
        ]);

        // Update or create the training result
        TrainingResult::updateOrCreate(
            [
                'user_id' => $user->id,
                'session_id' => $sessionId,
            ],
            [
                'warmup_completed' => $validated['warmup_completed'],
                'plyometrics_score' => $validated['plyometrics_score'],
                'power_score' => $validated['power_score'],
                'lower_body_strength_score' => $validated['lower_body_strength_score'],
                'upper_body_core_strength_score' => $validated['upper_body_core_strength_score'],
                'completed_at' => now(),
            ]
        );

        return redirect()->route('student.training')
            ->with('success', 'Training results saved successfully!');
    }
}
