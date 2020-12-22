import { Event, EventType, Address, Permission, Participant } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AddressSchema } from './address.schema';
import { ParticipantSchema } from './participant.schema';
import { PermissionSchema } from './permission.schema';

export type EventDocument = EventModel & mongoose.Document;

@Schema()
export class EventModel implements Event {
    @Prop({required: true})
    start: Date;
    @Prop({required: true})
    end: Date;
    @Prop({ type: [AddressSchema] })
    location?: Address;
    @Prop({required: true})
    title: string;
    @Prop()
    description: string;
    @Prop({ enum: Object.values(EventType), type: String, required: true })
    eventType: EventType;

    @Prop({ type: [PermissionSchema] })
    permissions: Permission[];

    @Prop({ type: [ParticipantSchema] })
    participants: Participant[];
}

export const EventSchema = SchemaFactory.createForClass(EventModel);