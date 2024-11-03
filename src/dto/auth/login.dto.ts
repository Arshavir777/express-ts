import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email must be valid' })
    email!: string;

    @IsNotEmpty()
    password!: string;
}
