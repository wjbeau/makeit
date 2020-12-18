import { Contact } from '@makeit/types';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getContacts(@Request() req) {
    return this.contactService.findAllForUser(req.user._id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateContact(@Param() params, @Body() body:Contact) {
    return this.contactService.save(params.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createContact(@Body() body:Contact) {
    return this.contactService.save(null, body)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteContact(@Param() params, @Request() req) {
    return this.contactService.delete(params.id, req.user._id)
  }
}
