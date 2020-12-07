import { Attachment, Link, Participant, Project, ProjectType, UnionType } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AttachmentSchema } from './attachment.schema';
import { LinkSchema } from './link.schema';
import { ParticipantSchema } from './participant.schema';


export type ProjectModelDocument = ProjectModel & mongoose.Document;

@Schema()
export class ProjectModel implements Project {
    @Prop()
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
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectModel);