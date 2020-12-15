import { Address, AddressType, ContactAddress, Contact, ContactLink, ContactLinkType, Telecom, TelecomType, BaseEntity } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AddressSchema } from './address.schema';
import { UserAccountModel } from './user.schema';
import { UserAccount } from '../../../../../libs/types/src/user.model';

export type ContactAddressDocument = ContactAddressModel & mongoose.Document;

@Schema()
export class ContactAddressModel implements ContactAddress {
    @Prop({ type: AddressSchema })
    address: Address;
    @Prop({ enum: Object.values(AddressType), type: String, required: true })
    type: AddressType;
    @Prop()
    mailingAddress: boolean;
}

export const ContactAddressSchema = SchemaFactory.createForClass(ContactAddressModel);

export type TelecomDocument = TelecomModel & mongoose.Document;

@Schema()
export class TelecomModel implements Telecom {
    @Prop({required: true, trim: true})
    details: string;
    @Prop({ enum: Object.values(TelecomType), type: String, required: true })
    type: TelecomType;
}

export const TelecomSchema = SchemaFactory.createForClass(TelecomModel);

export type ContactLinkDocument = ContactLinkModel & mongoose.Document;

@Schema()
export class ContactLinkModel implements ContactLink {
    @Prop({required: true, trim: true})
    url: string;
    @Prop({ enum: Object.values(ContactLinkType), type: String, required: true })
    type: ContactLinkType;
}

export const ContactLinkSchema = SchemaFactory.createForClass(ContactLinkModel);

export type ContactDocument = ContactModel & mongoose.Document;

@Schema()
export class ContactModel implements Contact {
    
    @Prop({ type: [ContactAddressSchema] })
    addresses: ContactAddress[];
    @Prop({ type: [TelecomSchema] })
    telecoms: Telecom[];
    @Prop({ type: [ContactLinkSchema] })
    links: ContactLink[];
    @Prop({trim: true})
    company: string;
    @Prop({trim: true})
    jobTitle: string;
    @Prop({trim: true})
    note: string;
    @Prop({trim: true})
    description: string;
    @Prop({required: true, trim: true})
    firstName: string;
    @Prop({required: true, trim: true})
    lastName: string;
    @Prop()
    avatar: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserAccountModel.name, required: true })
    owner: UserAccount|BaseEntity;
}

export const ContactSchema = SchemaFactory.createForClass(ContactModel);