<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;
    public $username;

    public function __construct($token, $email, $username)
    {
        $this->token = $token;
        $this->email = $email;
        $this->username = $username;
    }

    public function build()
    {
        $resetUrl = url('/reset-password/' . $this->token);

        return $this->view('emails.welcome')
            ->subject('Welcome to Young Athlete Training - Set Up Your Password')
            ->with([
                'resetUrl' => $resetUrl,
                'username' => $this->username,
                'email' => $this->email,
            ]);
    }
}
