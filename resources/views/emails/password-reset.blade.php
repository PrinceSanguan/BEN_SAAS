<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }

        .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }

        .warning {
            background: #fef3cd;
            border: 1px solid #faebcc;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>🏃‍♂️ Young Athlete Training</h1>
        <p>Password Reset Request</p>
    </div>

    <div class="content">
        <h2>Reset Your Password</h2>

        <p>Hello,</p>

        <p>We received a request to reset the password for your Young Athlete Training account associated with
            <strong>{{ $email }}</strong>.</p>

        <p>Click the button below to reset your password:</p>

        <a href="{{ $resetUrl }}" class="button">Reset My Password</a>

        <div class="warning">
            <strong>⚠️ Important Security Information:</strong>
            <ul>
                <li>This link will expire in <strong>1 hour</strong></li>
                <li>This link can only be used <strong>once</strong></li>
                <li>If you didn't request this reset, please ignore this email</li>
            </ul>
        </div>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px;">{{ $resetUrl }}</p>

        <div class="footer">
            <p>This email was sent from Young Athlete Training. If you have any questions, please contact our support
                team.</p>
            <p><em>© {{ date('Y') }} Young Athlete Training. All rights reserved.</em></p>
        </div>
    </div>
</body>

</html>
