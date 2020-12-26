import {
    Attachment, Link, Transaction,
    TransactionExpenseCategory,
    TransactionIncomeCategory,
    TransactionRelationType,
    TransactionType,
    UserAccount
} from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AttachmentSchema } from './attachment.schema';
import { LinkSchema } from './link.schema';
import { UserAccountModel } from './user.schema';

export type TransactionDocument = TransactionModel & mongoose.Document;

@Schema()
export class TransactionModel implements Transaction {
  @Prop({ enum: Object.values(TransactionType), type: String, required: true })
  type: TransactionType;
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  date: Date;
  @Prop({
    enum: [].concat(Object.values(TransactionIncomeCategory), Object.values(TransactionExpenseCategory)),
    type: String,
    required: true
  })
  category: TransactionIncomeCategory | TransactionExpenseCategory;
  @Prop()
  description: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  relatesTo;
  @Prop({ enum: Object.values(TransactionRelationType), type: String })
  relatesToType: TransactionRelationType;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserAccountModel.name,
    required: true,
  })
  owner: UserAccount;
  @Prop({ type: [LinkSchema] })
  links: Link[];
  @Prop({ type: [AttachmentSchema] })
  attachments: Attachment[];
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);
