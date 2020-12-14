import { Contact } from '@makeit/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { ContactDocument, ContactModel } from '../../schema/contact.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactModel.name)
    private contactModel: Model<ContactDocument>
  ) {}

  async save(id: string, contact: Contact): Promise<Contact | undefined> {
        //the path variable must match the data posted
    if((id || contact._id) && id !== contact._id) {
      throw new BadRequestException();
    }
    
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    // Find the document and update it if required or save a new one if not.  
    const result = await this.contactModel.findByIdAndUpdate(
            { _id: contact._id || mongoose.Types.ObjectId() }, 
            contact, 
            options
        )
        .exec();

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any): Promise<Contact | undefined> {
    return await this.contactModel.findOne({_id: id}).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAllForUser(id: any): Promise<Contact[] | undefined> {
    //find all contacts where a given user is the owner
    const result: Contact[] = await this.contactModel
      .find({
        'ownerId': id,
      })
      .sort({
        lastName: 1,
        firstName: 1,
      })
      .lean()
      .exec();
    return result;
  }
}
