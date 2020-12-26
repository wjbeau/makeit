import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '@makeit/types';
import { ensureTenant } from '../../schema/user.schema';
import {
  TransactionModel,
  TransactionDocument
} from '../../schema/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionModel.name)
    private transactionModel: Model<TransactionDocument>
  ) {}

  async save(id: string, transaction: Transaction, userid): Promise<Transaction | undefined> {
    //the path variable must match the data posted
    if ((id || transaction._id) && id !== transaction._id) {
      throw new BadRequestException();
    }

    if(!id) {
      ensureTenant(transaction, userid);
    }

    // Find the document and update it if required or save a new one if not.
    const result = await this.transactionModel
      .findOne({ _id: transaction._id })
      .then((dbRes) => {
        if (dbRes) {
          dbRes.set(transaction);
          return dbRes.save();
        } else {
          return this.transactionModel.create(transaction);
        }
      })
      .catch((error) => {
        throw new BadRequestException(error, 'Database update failed.');
      });

    return result.toObject();
  }

  async findById(id): Promise<Transaction | undefined> {
    return await this.transactionModel.findOne({ _id: id }).lean().exec();
  }

  async findAllForUser(id, from?: Date, to?: Date): Promise<Transaction[] | undefined> {
    let datefilter = {}
    if(from && to) {
      datefilter = {
          $and: [
            { 'date': { $gte: from }},
            { 'date': { $lte: to }}
          ]
        }
    }

    //find all Transactions where the given user is a relevant participant
    const result: Transaction[] = await this.transactionModel
      .find({
        $and: [
          datefilter,
          {
            owner: id
          }
        ]
      }) 
      .lean()
      .exec();
    return result;
  }
}
