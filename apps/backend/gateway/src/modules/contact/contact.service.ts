import { Contact } from '@makeit/types';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { ContactDocument, ContactModel } from '../../schema/contact.schema';
import { FileService } from '../files/file.service';

@Injectable({ scope: Scope.REQUEST })
export class ContactService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectModel(ContactModel.name)
    private contactModel: Model<ContactDocument>,
    private fileService: FileService,
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

    return result;
  }

  async delete(id: string, userId): Promise<boolean> {
    const result = await this.contactModel.remove({
      _id: id,
      owner: userId
    })

    return (result.deletedCount > 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any, userId: any): Promise<Contact | undefined> {
    return await this.contactModel.findOne({
      _id: id,
      owner: userId
    }).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAllForUser(id: any): Promise<Contact[] | undefined> {
    //find all contacts where a given user is the owner
    const result: Contact[] = await this.contactModel
      .find({
        'owner': id,
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
