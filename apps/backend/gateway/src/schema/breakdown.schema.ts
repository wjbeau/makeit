import { Attachment, Breakdown, Link, Project } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AttachmentSchema } from './attachment.schema';
import { LinkSchema } from './link.schema';
import { ProjectModel } from './project.schema';

export type BreakdownDocument = BreakdownModel & mongoose.Document;

@Schema()
export class BreakdownModel implements Breakdown {
    @Prop({required: true})
    roleName: string;
    @Prop()
    roleDescription: string;
    @Prop()
    roleType: string;
    @Prop()
    rate: string; //how much does it pay

    @Prop()
    gender: string;
    @Prop()
    ageMin: number;
    @Prop()
    ageMax: number;
    @Prop()
    ethnicities: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ProjectModel.name })
    project: Project;

    @Prop({ type: [AttachmentSchema] })
    attachments: Attachment[]; 
    @Prop({ type: [LinkSchema] })
    links: Link[]; 
}


export const BreakdownSchema = SchemaFactory.createForClass(BreakdownModel);