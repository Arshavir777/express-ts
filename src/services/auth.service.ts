import { HttpError } from "routing-controllers";
import bcrypt from "bcrypt";
import { Service } from "typedi";
import { UserRepository } from "../repositories";
import { LoginDTO, RegisterDTO, ChangePasswordDTO } from "../dto/auth";

@Service()
export class AuthService {
    constructor(protected userRepository: UserRepository) { }

    async login(loginDto: LoginDTO) {
        const user = await this.userRepository.findByEmail(loginDto.email);
        if (!user || !(await this.verifyPassword(loginDto.password, user.password))) {
            throw new HttpError(401, 'Invalid password')
        }
        return user;
    }

    async register(registerDto: RegisterDTO) {
        const isExists = await this.userRepository.findByEmail(registerDto.email);

        if (isExists) {
            throw new HttpError(422, 'Email already exist');
        }

        const hashedPassword = await this.hashPassword(registerDto.password);
        const newUser = await this.userRepository.createUser(
            registerDto.email,
            registerDto.firstName,
            registerDto.lastName,
            hashedPassword
        );
        return newUser;
    }

    async changePassword(currentUserId: number, data: ChangePasswordDTO) {
        const user = await this.userRepository.findById(currentUserId);
        if (!user || !(await this.verifyPassword(data.oldPassword, user.password))) {
            throw new HttpError(400, 'Invalid old password')
        }

        const hashedNewPassword = await this.hashPassword(data.password);
        await this.userRepository.updatePasswordById(
            currentUserId,
            hashedNewPassword
        );
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
