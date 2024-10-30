import { UserRepository } from '../repositories';
import { Service } from 'typedi';

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) { }

  async createUser(username: string, email: string) {
    return this.userRepository.createUser(username, email);
  }

  async getUserById(id: number) {
    return this.userRepository.findById(id);
  }

  async test() {
    return {
      name: 'Petros'
    }
  }
}
