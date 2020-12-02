import { Address } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AddressDocument = AddressModel & mongoose.Document;

@Schema()
export class AddressModel implements Address {
    @Prop({required: true})
    line1: string;
    @Prop({required: true})
    line2: string;
    @Prop({required: true})
    line3: string;
    @Prop({required: true})
    city: string;
    @Prop()
    state?: string;
    @Prop()
    zip?: string;
    @Prop()
    country: string;
}

export const AddressSchema = SchemaFactory.createForClass(AddressModel);