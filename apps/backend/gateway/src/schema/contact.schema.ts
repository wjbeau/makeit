import { Address, AddressType, ContactAddress } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Contact, ContactLink, ContactLinkType, Telecom, TelecomType } from '../../../../../libs/types/src/contact.model';
import { AddressSchema } from './address.schema';

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
    @Prop()
    details: string;
    @Prop({ enum: Object.values(TelecomType), type: String, required: true })
    type: TelecomType;
}

export const TelecomSchema = SchemaFactory.createForClass(TelecomModel);

export type ContactLinkDocument = ContactLinkModel & mongoose.Document;

@Schema()
export class ContactLinkModel implements ContactLink {
    @Prop()
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
    @Prop()
    company: string;
    @Prop()
    jobTitle: string;
    @Prop()
    note: string;
    @Prop()
    description: string;
    @Prop({required: true})
    ownerId: mongoose.Types.ObjectId;
    @Prop({required: true})
    firstName: string;
    @Prop({required: true})
    lastName: string;
    @Prop()
    avatar: string;
}

export const ContactSchema = SchemaFactory.createForClass(ContactModel);