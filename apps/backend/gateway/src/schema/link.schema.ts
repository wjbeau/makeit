import { Link } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type LinkDocument = LinkModel & mongoose.Document;

@Schema()
export class LinkModel implements Link {
    @Prop({required: true})
    url: string;
    @Prop()
    display: string
}

export const LinkSchema = SchemaFactory.createForClass(LinkModel);