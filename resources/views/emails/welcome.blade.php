<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Young Athlete Training</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

    <div
        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">🏆 Welcome to Young Athlete Training!</h1>
    </div>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #495057; margin-top: 0;">Hello!</h2>

        <p>A training account has been created for <strong>{{ $username }}</strong>.</p>

        <p>To get started with the training program, you'll need to set up a password for this account.</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $resetUrl }}"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold; 
                      display: inline-block;">
                Set Up Password
            </a>
        </div>

        <p style="margin-bottom: 0;"><strong>Account Details:</strong></p>
        <ul style="margin-top: 5px;">
            <li><strong>Username:</strong> {{ $username }}</li>
            <li><strong>Email:</strong> {{ $email }}</li>
        </ul>
    </div>

    <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3;">
        <p style="margin: 0; font-size: 14px;"><strong>🔒 Security Note:</strong> This password setup link will expire
            in 1 hour for security reasons.</p>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
        If you didn't expect this email, please contact your training administrator.
    </p>

</body>

</html>
