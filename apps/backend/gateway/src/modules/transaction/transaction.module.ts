import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModel, TransactionSchema } from '../../schema/transaction.schema';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
    controllers: [
        TransactionController
    ],
    imports: [
        MongooseModule.forFeature([
            { name: TransactionModel.name, schema: TransactionSchema }
        ])
    ],
    providers: [
        TransactionService
    ],
    exports: [
        TransactionService
    ]})
export class TransactionModule {}
