import { Address, Attachment, Link, Participant, Project, ProjectCall, ProjectStatus, ProjectType, UnionType } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AddressSchema } from './address.schema';
import { AttachmentSchema } from './attachment.schema';
import { LinkSchema } from './link.schema';
import { ParticipantSchema } from './participant.schema';



export type ProjectCallModelDocument = ProjectCallModel & mongoose.Document;

@Schema()
export class ProjectCallModel implements ProjectCall {
    notes: string;
    @Prop({required: true})
    callTime: Date;
    @Prop({ type: AddressSchema })
    location: Address;
    @Prop({ type: [AttachmentSchema] })
    attachments: Attachment[]; 
    @Prop({ type: [LinkSchema] })
    links: Link[]; 
}

export const ProjectCallSchema = SchemaFactory.createForClass(ProjectCallModel);

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

    @Prop({ type: [ProjectCallSchema] })
    calls: ProjectCall[];
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectModel);
