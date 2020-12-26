import {
  Transaction,
  TransactionExpenseCategory,
  TransactionIncomeCategory,
  TransactionRelationType,
  TransactionType,
  UserAccount,
} from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserAccountModel } from './user.schema';
import { Link, Attachment } from '@makeit/types';
import { LinkModel } from './link.schema';
import { AttachmentModel } from './attachment.schema';

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
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: LinkModel.name }] })
  links: Link[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: AttachmentModel.name }] })
  attachments: Attachment[];
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);
