import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterDTO {
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    firstName!: string;


    @IsNotEmpty()
    lastName!: string;

    @IsNotEmpty()
    // @IsStrongPassword()
    password!: string;
}
