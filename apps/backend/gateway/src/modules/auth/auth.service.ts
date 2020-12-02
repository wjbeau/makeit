import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, UserAccount } from '@makeit/types';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserAccount|undefined> {
    const user = await this.usersService.findByEmail(username);

    if(!user) {
      return null;
    }

    const result = await bcrypt.compare(pass, user.password)
    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserAccount): Promise<AuthResponse> {
    return {
      access_token: this.jwtService.sign(user),
      user: user
    };
  }
}
