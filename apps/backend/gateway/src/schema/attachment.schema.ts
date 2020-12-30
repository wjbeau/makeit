import { Attachment, AttachmentType } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AttachmentDocument = AttachmentModel & mongoose.Document;

@Schema()
export class AttachmentModel implements Attachment {
    @Prop({required: true})
    reference: string;
    @Prop({ enum: Object.values(AttachmentType), type: String})
    attachmentType: AttachmentType;
    @Prop()
    displayName: string;
    @Prop({required: true})
    fileName: string;
    @Prop({required: true})
    mimeType: string;
    @Prop({required: true})
    size: number;
}

export const AttachmentSchema = SchemaFactory.createForClass(AttachmentModel);