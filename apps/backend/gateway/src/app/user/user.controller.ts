import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('hello')
  async getHello(): Promise<string> {
    return await this.userService.getHello();
  }
}
