import { BASE_URL } from "../../config/serverConfig.js";
import { APP_NAME } from "../../constants.js";

function verifyEmailHTML(token) {
    token = `${BASE_URL}/api/v1/auth/verify-email/` + token;

    const verifyEmailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - ${APP_NAME}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f1f1f1;
        }
        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h2 {
            color: #333333;
            margin-top: 0;
        }
        .content {
            color: #555555;
        }
        .content a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #337ab7;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Welcome to ${APP_NAME}!</h2>
        </div>
        <div class="content">
            <p>Thank you for signing up. To complete your registration, please click the following link to verify your email:</p>
            <p>
                <a href="${token}">Verify Email</a>
            </p>
            <p>Once verified, you'll be able to access all the features of ${APP_NAME}.</p>
            <p>If you did not sign up for ${APP_NAME}, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>The ${APP_NAME} Team</p>
        </div>
    </div>
</body>
</html>
`
    return verifyEmailHTML;
}

export {
    verifyEmailHTML
};