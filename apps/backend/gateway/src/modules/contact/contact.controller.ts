import { Contact } from '@makeit/types';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getContacts() {
    return this.contactService.findAllForUser()
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
  async deleteContact(@Param() params) {
    return this.contactService.delete(params.id)
  }
}
