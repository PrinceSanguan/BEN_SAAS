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
        $template = \App\Models\EmailTemplate::where('name', 'welcome')->first();
        $resetUrl = url('/reset-password/' . $this->token);

        $content = str_replace(
            ['{{ $resetUrl }}', '{{ $username }}', '{{ $email }}'],
            [$resetUrl, $this->username, $this->email],
            $template->content
        );

        return $this->subject($template->subject)
            ->html($content);
    }
}
