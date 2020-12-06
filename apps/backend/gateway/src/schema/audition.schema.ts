import { Address, Attachment, Audition, AuditionNote, AuditionStatus, AuditionType, Breakdown, Link, NoteVisibility, Participant } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AddressSchema } from './address.schema';
import { AttachmentSchema } from './attachment.schema';
import { BreakdownModel } from './breakdown.schema';
import { LinkSchema } from './link.schema';
import { ParticipantSchema } from './participant.schema';

export type AuditionNoteDocument = AuditionNoteModel & mongoose.Document;

@Schema()
export class AuditionNoteModel implements AuditionNote {
    noteType: string;
    description: string;
    visibility: NoteVisibility;
}

export const AuditionNoteSchema = SchemaFactory.createForClass(AuditionNoteModel);

export type AuditionDocument = AuditionModel & mongoose.Document;

@Schema()
export class AuditionModel implements Audition {
    @Prop()
    instructions?: string;
    @Prop({ enum: Object.values(AuditionType), type: String })
    type: AuditionType;
    @Prop()
    auditionTime?: string;
    @Prop()
    deadline?: string;
    @Prop()
    callbackDate?: string;
    @Prop({ type: AddressSchema })
    address?: Address;

    @Prop({ enum: Object.values(AuditionStatus), type: String, required: true })
    status: AuditionStatus;
    @Prop()
    statusReason?: string;  //reason for status
    

    @Prop({ type: AttachmentSchema })
    attachments?: Attachment[]; 
    @Prop({ type: LinkSchema })
    links?: Link[]; 
    @Prop({ type: ParticipantSchema })
    participants?: Participant[];

    @Prop({ type: AuditionNoteSchema })
    notes?: AuditionNote[];

    @Prop()
    reminderNote?: string;
    @Prop()
    reminderTime?: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: BreakdownModel.name }] })
    breakdown: Breakdown;
}

export const AuditionSchema = SchemaFactory.createForClass(AuditionModel);