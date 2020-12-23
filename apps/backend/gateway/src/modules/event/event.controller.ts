import { Event } from '@makeit/types';
import { Body, Controller, Get, Param, Post, Put, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './event.service';
import * as moment from 'moment';

@Controller('events')
export class EventController {
  constructor(private eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getEvents(@Request() req) {
    const from = req.query.from
    const to = req.query.to
    const fromMoment = moment(from, "YYYY-MM-DD").seconds(0).minutes(0).hours(0).milliseconds(0)
    const toMoment = moment(to, "YYYY-MM-DD").seconds(59).minutes(59).hours(23).milliseconds(999)

    if(!fromMoment.isValid() || !toMoment.isValid()) {
      throw new BadRequestException("Invalid date range specified")
    }

    return this.eventService.findAllForUser(req.user._id, fromMoment.toDate(), toMoment.toDate())
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
