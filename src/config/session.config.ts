import env from 'env-var';

export const sessionConfig = {
  secret: env.get('SESSION_SECRET').default('defaultSecret').asString(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    // HTTPS-only in production
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}
