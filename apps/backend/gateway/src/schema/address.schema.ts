import { Address } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AddressDocument = AddressModel & mongoose.Document;

@Schema()
export class AddressModel implements Address {
    @Prop()
    line1: string;
    @Prop()
    line2: string;
    @Prop()
    line3: string;
    @Prop()
    city: string;
    @Prop()
    state: string;
    @Prop()
    zip: string;
    @Prop()
    country: string;
}

export const AddressSchema = SchemaFactory.createForClass(AddressModel);