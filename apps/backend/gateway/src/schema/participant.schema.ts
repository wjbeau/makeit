import { Participant, ParticipantReference, ParticipantReferenceType, ParticipantType } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ParticipantReferenceDocument = ParticipantReferenceModel & mongoose.Document;

@Schema()
export class ParticipantReferenceModel implements ParticipantReference {
    @Prop()
    ref: string;
    @Prop()
    firstName: string;
    @Prop()
    lastName: string;
    @Prop()
    avatar: string;
    @Prop({ enum: Object.values(ParticipantReferenceType), type: String })
    type: ParticipantReferenceType;
}

export const ParticipantReferenceSchema = SchemaFactory.createForClass(ParticipantReferenceModel);

export type ParticipantModelDocument = ParticipantModel & mongoose.Document;

@Schema()
export class ParticipantModel implements Participant {
    @Prop({ type: ParticipantReferenceSchema })
    info: ParticipantReference;
    @Prop({ enum: Object.values(ParticipantType), type: String })
    role: ParticipantType;
}

export const ParticipantSchema = SchemaFactory.createForClass(ParticipantModel);