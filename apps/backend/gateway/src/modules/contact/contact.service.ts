import { Contact } from '@makeit/types';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactDocument, ContactModel } from '../../schema/contact.schema';

@Injectable({ scope: Scope.REQUEST })
export class ContactService {
  constructor(
    @Inject(REQUEST) private readonly request,
    @InjectModel(ContactModel.name)
    private contactModel: Model<ContactDocument>
  ) {}

  async save(id: string, contact: Contact): Promise<Contact | undefined> {
        //the path variable must match the data posted
    if((id || contact._id) && id !== contact._id) {
      throw new BadRequestException();
    }

    // Find the document and update it if required or save a new one if not.  
    const result = await this.contactModel
      .findOne({ _id: contact._id })
        .then((dbRes) => {
            if(dbRes) { 
              const prevOwner = dbRes.owner;
              dbRes.set(contact);
              dbRes.set({owner: prevOwner})
              return dbRes.save();
            }
            else {
              const user = this.request.user;
              contact.owner = user['_id'];
              return this.contactModel.create(contact)
            }
        })
        .catch(error => {
          throw new BadRequestException(error, 'Database update failed.')
        })

    return result.toObject();
  }

  async delete(id: string): Promise<boolean> {
    const user = this.request.user;
    const result = await this.contactModel.remove({
      _id: id,
      owner: user['_id']
    })

    return (result.deletedCount > 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any): Promise<Contact | undefined> {
    const user = this.request.user;
    return await this.contactModel.findOne({
      _id: id,
      owner: user['_id']
    }).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAllForUser(): Promise<Contact[] | undefined> {
    const user = this.request.user;

    //find all contacts where a given user is the owner
    const result: Contact[] = await this.contactModel
      .find({
        'owner': user['_id'],
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
