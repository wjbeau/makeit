import { Address, Audition, AuditionStatus, AuditionType, Breakdown, Link, RoleAssignment } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BreakdownModel } from './breakdown.schema';
import { LinkSchema } from './link.schema';
import { RoleAssignmentSchema } from './role-assignment.schema';
import { AddressSchema } from './address.schema';

export type AuditionDocument = AuditionModel & mongoose.Document;

@Schema()
export class AuditionModel implements Audition {
    @Prop()
    instructions?: string;
    @Prop({ enum: Object.values(AuditionType), type: String, required: true })
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
    @Prop({ type: LinkSchema })
    links?: Link[];

    @Prop({ type: RoleAssignmentSchema })
    participants?: RoleAssignment[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: BreakdownModel.name }] })
    breakdown: Breakdown;
}

export const AuditionSchema = SchemaFactory.createForClass(AuditionModel);