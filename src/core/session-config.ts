import session from 'express-session';
import RedisStore from 'connect-redis';
import { Service } from 'typedi';
import { RedisProvider } from '../providers';
import { sessionConfig } from '../config/session.config';

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
      ...sessionConfig
    });
  }
}

export default SessionConfig;
