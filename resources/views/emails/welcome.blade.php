<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ config('app.name', 'My Shop') }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #f97316;
            margin-bottom: 10px;
        }
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: block;
            border: 3px solid #f97316;
        }
        .avatar-placeholder {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f97316;
            color: white;
            font-size: 32px;
            font-weight: bold;
        }
        h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .welcome-message {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .cta-button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #f97316;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }
        .cta-button:hover {
            background-color: #ea580c;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
        }
        .features {
            margin: 30px 0;
        }
        .feature-item {
            padding: 10px 0;
            color: #4b5563;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">{{ config('app.name', 'My Shop') }}</div>
            @if($user->avatar)
                <img src="{{ $user->avatar }}" alt="{{ $user->name }}" class="avatar">
            @else
                <div class="avatar-placeholder">
                    {{ strtoupper(substr($user->name, 0, 1)) }}
                </div>
            @endif
            <h1>Welcome, {{ $user->name }}! 🎉</h1>
            <p class="welcome-message">
                We're thrilled to have you join our community. Your account has been successfully created and verified.
            </p>
        </div>

        <div class="features">
            <p style="color: #4b5563; margin-bottom: 15px;">Here's what you can do:</p>
            <div class="feature-item">✓ Browse our amazing product catalog</div>
            <div class="feature-item">✓ Save items to your wishlist</div>
            <div class="feature-item">✓ Track your orders in real-time</div>
            <div class="feature-item">✓ Enjoy exclusive member benefits</div>
        </div>

        <div style="text-align: center;">
            <a href="{{ $shopUrl }}" class="cta-button">Start Shopping →</a>
        </div>

        <div class="footer">
            <p>Thank you for choosing {{ config('app.name', 'My Shop') }}!</p>
            <p style="margin-top: 10px; font-size: 12px;">
                If you have any questions, feel free to reach out to our support team.
            </p>
        </div>
    </div>
</body>
</html>
