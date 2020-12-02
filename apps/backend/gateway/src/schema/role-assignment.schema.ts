import { ParticipantType, ReferenceType, RoleAssignment } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RoleAssignmentDocument = RoleAssignmentModel & mongoose.Document;

@Schema()
export class RoleAssignmentModel implements RoleAssignment {
    @Prop({required: true})
    reference: string;
    @Prop({ enum: Object.values(ReferenceType), type: String, required: true })
    referenceType: ReferenceType;
    @Prop({ enum: Object.values(ParticipantType), type: String, required: true })
    role: ParticipantType;
}

export const RoleAssignmentSchema = SchemaFactory.createForClass(RoleAssignmentModel);