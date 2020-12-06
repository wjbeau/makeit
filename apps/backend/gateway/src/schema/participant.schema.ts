import { Participant, ParticipantType, ReferenceType } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ParticipantModelDocument = ParticipantModel & mongoose.Document;

@Schema()
export class ParticipantModel implements Participant {
    @Prop()
    reference: string;
    @Prop({ enum: Object.values(ReferenceType), type: String })
    referenceType: ReferenceType; 
    @Prop({ enum: Object.values(ParticipantType), type: String })
    role: ParticipantType; 
}

export const ParticipantSchema = SchemaFactory.createForClass(ParticipantModel);