<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function build()
    {
        $resetUrl = url(route('password.reset', $this->token, false));

        return $this->subject('Reset Your Password - Young Athlete Training')
            ->view('emails.password-reset')
            ->with([
                'resetUrl' => $resetUrl,
                'email' => $this->email,
            ]);
    }
}
