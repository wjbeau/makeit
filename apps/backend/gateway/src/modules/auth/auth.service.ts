import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, UserAccount, AccessTokenType } from '@makeit/types';
import { UserService } from '../user/user.service';
import { CryptoService } from '../common-services/crypto.service';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private cryptoService: CryptoService,
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    pass: string
  ): Promise<UserAccount | undefined> {
    const user = await this.usersService.findByEmail(username);

    if (!user) {
      return null;
    }

    const result = await this.cryptoService.compare(pass, user.password);
    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, tokens, ...rest } = user;
      return rest;
    }

    return null;
  }

  async refreshToken(username: string, refresh: string): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(username);

    if (!user || !refresh) {
      throw new BadRequestException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, tokens, ...rest } = user;

    if (tokens) {
      const matching = tokens.find(
        (t) => t.token === refresh && t.type === AccessTokenType.Refresh
      );
      if (matching && matching.expires > new Date()) {
        return {
          access_token: this.generateToken(rest),
          refresh_token: matching,
          user: rest,
        };
      }
    }

    throw new UnauthorizedException();
  }

  async login(user: UserAccount): Promise<AuthResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, tokens, ...rest} = user
    const refresh = await this.usersService.generateRefreshToken(user);
    return {
      access_token: this.generateToken(user),
      refresh_token: refresh,
      user: rest,
    };
  }

  generateToken(user: UserAccount) {
    const expires = moment().add(30, 'minutes').toDate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {avatar, password, tokens, ...rest} = user
    const result = this.jwtService.sign(rest, { expiresIn: '30m' });
    return {
      token: result,
      expires: expires,
      type: AccessTokenType.Auth,
    };
  }
}
