import { UserAccount } from '@makeit/types';
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { PasswordChangeRequest } from '../../../../../../libs/types/src/user.model';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/password')
  async changePassword(@Param() params, @Body() body:PasswordChangeRequest) {
    return this.userService.changePassword(params.id, body.oldPassword, body.newPassword)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param() params, @Body() body:UserAccount) {
    return this.userService.save(params.id, body)
  }

  @Post()
  async createUser(@Body() body:UserAccount) {
    return this.userService.save(null, body)
  }
}
