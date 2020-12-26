import { Transaction } from '@makeit/types';
import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransactions(@Request() req) {
    return this.transactionService.findAllForUser(req.user._id)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTransaction(@Param() params) {
    return this.transactionService.findById(params.id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTransaction(@Param() params, @Body() body:Transaction, @Request() req) {
    return this.transactionService.save(params.id, body, req.user._id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(@Body() body:Transaction, @Request() req) {
    return this.transactionService.save(null, body, req.user._id)
  }
}
