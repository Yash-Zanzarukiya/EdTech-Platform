export const APP_NAME = "EdTech";

export const USER_ROLES = ['user', 'admin'];

export const AUTH_ERRORS = {
    EMAIL_ALREADY_REGISTERED: 'Email already registered',
    REPOSITORY_LAYER: 'Something went wrong in the auth repository',
    SERVICE_LAYER: 'Something went wrong in the auth service',
    CONTROLLER_LAYER: 'Something went wrong in the auth controller',
    AUTH_NOT_FOUND: 'User not found',
    USER_NOT_FOUND: 'User not found in the database',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_VERIFIED: 'User not verified. Please verify your email',
    INVALID_TOKEN: 'Invalid token or token expired or missing',
    VERIFICATION_EMAIL_SENT: 'User verification email sent to your email. Please verify your email to login',
    VERIFICATION_EMAIL_SENT_RECENTLY: 'User verification email sent recently. Please verify your email.'
}