import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';

import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { LoginInput, SingupInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    private getJwtToken(userId: string) {
        return this.jwtService.sign({ id: userId });
    }

    async signup(signupInput: SingupInput): Promise<AuthResponse> {

        console.log({ signupInput });

        const user = await this.usersService.create(signupInput);

        const token = this.getJwtToken(user.id);

        return { token, user };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {

        const { email, password } = loginInput;

        const user = await this.usersService.findOneByEmail(email);

        if (!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException("Email/Password do not match");
        }


        const token = this.getJwtToken(user.id);

        return {
            token,
            user
        }
    }

    async validateUser(id: string): Promise<User> {

        const user = await this.usersService.findOneById(id);

        if (!user.isActive) throw new UnauthorizedException(`User is inactive, talk with the admin`);

        delete user.password;

        return user;

    }

    revalidateToken(user: User): AuthResponse {

        const token = this.getJwtToken(user.id);

        return {
            token,
            user
        }

    }



}
