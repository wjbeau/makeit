import { Event } from '@makeit/types';
import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getEvents(@Request() req) {
    return this.eventService.findAllForUser(req.user._id, req.params.from, req.params.to)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getEvent(@Param() params) {
    return this.eventService.findById(params.id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateEvent(@Param() params, @Body() body:Event, @Request() req) {
    return this.eventService.save(params.id, body, req.user._id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(@Body() body:Event, @Request() req) {
    return this.eventService.save(null, body, req.user._id)
  }
}
