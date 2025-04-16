export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'development' ? 'Lax' : 'None',
    path: '/',
    // Remove domain for development (localhost)
    domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000
};