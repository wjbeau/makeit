import { Address, Attachment, Audition, AuditionNote, AuditionStatus, AuditionType, Breakdown, Link, Participant, Permission, UserAccount, AuditionSource } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AddressSchema } from './address.schema';
import { AttachmentSchema } from './attachment.schema';
import { BreakdownModel } from './breakdown.schema';
import { LinkSchema } from './link.schema';
import { ParticipantSchema } from './participant.schema';
import { PermissionSchema } from './permission.schema';
import { UserAccountModel } from './user.schema';

export type AuditionNoteDocument = AuditionNoteModel & mongoose.Document;

@Schema()
export class AuditionNoteModel implements AuditionNote {
    @Prop()
    description: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserAccountModel.name })
    createdBy: UserAccount;
    @Prop()
    createdOn: Date;
    @Prop({ type: [LinkSchema] })
    links: Link[];
    @Prop({ type: [AttachmentSchema] })
    attachments: Attachment[];

    @Prop({ type: [PermissionSchema] })
    permissions: Permission[];
}

export const AuditionNoteSchema = SchemaFactory.createForClass(AuditionNoteModel);

export type AuditionDocument = AuditionModel & mongoose.Document;

@Schema()
export class AuditionModel implements Audition {
    @Prop()
    instructions: string;
    @Prop({ enum: Object.values(AuditionType), type: String, required: true })
    type: AuditionType;
    @Prop({required: true})
    auditionTime: Date;
    @Prop()
    deadline: Date;
    @Prop()
    callbackDate: Date;
    @Prop({ type: AddressSchema })
    address: Address;

    @Prop({ enum: Object.values(AuditionStatus), type: String, required: true })
    status: AuditionStatus;
    @Prop()
    statusReason: string;  //reason for status

    @Prop({ enum: Object.values(AuditionSource), type: String, required: true })
    source: AuditionSource;

    @Prop({ type: [AttachmentSchema] })
    attachments: Attachment[]; 
    @Prop({ type: [LinkSchema] })
    links: Link[]; 
    @Prop({ type: [ParticipantSchema] })
    participants: Participant[];

    @Prop({ type: [AuditionNoteSchema] })
    notes: AuditionNote[];

    @Prop({ type: [PermissionSchema] })
    permissions: Permission[];

    @Prop()
    reminderNote: string;
    @Prop()
    reminderTime: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: AuditionModel.name })
    followUpTo?: Audition;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: BreakdownModel.name })
    breakdown: Breakdown;
}

export const AuditionSchema = SchemaFactory.createForClass(AuditionModel);