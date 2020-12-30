import { UserAccount, PasswordChangeRequest } from '@makeit/types';
import { Body, Controller, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id/password')
  async changePassword(@Param() params, @Body() body:PasswordChangeRequest, @Request() req) {
    return this.userService.changePassword(params.id, body.oldPassword, body.newPassword, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param() params, @Body() body:UserAccount, @Request() req) {
    return this.userService.save(params.id, body, req.user)
  }

  @Post()
  async createUser(@Body() body:UserAccount, @Request() req) {
    return this.userService.save(null, body, req.user)
  }
}
