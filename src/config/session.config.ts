import session from 'express-session';
import RedisStore from 'connect-redis';
import { Service } from 'typedi';
import { RedisProvider } from '../providers';

@Service()
class SessionConfig {

  constructor(protected redisProvider: RedisProvider) { }

  public configureSession() {
    const redisStore = new RedisStore({
      client: this.redisProvider.getClient(),
      prefix: "api:",
    })

    return session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'defaultSecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        // HTTPS-only in production
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    });
  }
}

export default SessionConfig;
