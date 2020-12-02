import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuditionService } from './audition.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Audition } from '@makeit/types';

@Controller('auditions')
export class AuditionController {
  constructor(private auditionService: AuditionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAuditions(@Request() req) {
    return this.auditionService.findAllForUser(req.user._id)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAudition(@Param() params) {
    return this.auditionService.findById(params.id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAudition(@Param() params, @Body() body:Audition) {
    return this.auditionService.save(params.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAudition(@Body() body:Audition) {
    return this.auditionService.save(null, body)
  }
}
