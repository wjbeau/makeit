import { Address, Attachment, Link, Participant, Project, ProjectEvent, ProjectEventType, ProjectStatus, ProjectType, UnionType, Permission } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AddressSchema } from './address.schema';
import { AttachmentSchema } from './attachment.schema';
import { LinkSchema } from './link.schema';
import { ParticipantSchema } from './participant.schema';
import { PermissionSchema } from './permission.schema';



export type ProjectEventModelDocument = ProjectEventModel & mongoose.Document;

@Schema()
export class ProjectEventModel implements ProjectEvent {
    @Prop({required: true})
    time: Date;
    @Prop({ type: AddressSchema })
    location?: Address;

    @Prop()
    notes: string;
    
    @Prop({ enum: Object.values(ProjectEventType), type: String })
    eventType: ProjectEventType;

    @Prop({ type: [AttachmentSchema] })
    attachments: Attachment[]; 
    @Prop({ type: [LinkSchema] })
    links: Link[]; 

    @Prop({ type: [PermissionSchema] })
    permissions: Permission[];

    @Prop({type: [ParticipantSchema]})
    participants: Participant[];
}

export const ProjectEventSchema = SchemaFactory.createForClass(ProjectEventModel);

export type ProjectModelDocument = ProjectModel & mongoose.Document;

@Schema()
export class ProjectModel implements Project {
    @Prop({required: true})
    name: string;
    @Prop({ enum: Object.values(ProjectType), type: String })
    projectType: ProjectType; 
    @Prop()
    description: string;
    @Prop({ enum: Object.values(UnionType), type: String })
    union: UnionType;
    @Prop()
    startDate: Date;

    @Prop({ type: [AttachmentSchema] })
    attachments: Attachment[]; 
    @Prop({ type: [LinkSchema] })
    links: Link[]; 
    @Prop({ type: [ParticipantSchema] })
    participants: Participant[];

    @Prop({ enum: Object.values(ProjectStatus), type: String, required: true })
    status: ProjectStatus;

    @Prop({ type: [ProjectEventSchema] })
    events: ProjectEvent[];

    @Prop({ type: [PermissionSchema] })
    permissions: Permission[];
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectModel);
