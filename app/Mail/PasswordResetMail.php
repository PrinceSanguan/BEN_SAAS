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
        $template = \App\Models\EmailTemplate::where('name', 'password_reset')->first();
        $resetUrl = url(route('password.reset', $this->token, false));

        $content = str_replace(['{{ $resetUrl }}', '{{ $email }}'], [$resetUrl, $this->email], $template->content);

        return $this->subject($template->subject)
            ->html($content);
    }
}
