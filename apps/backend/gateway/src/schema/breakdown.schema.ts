import { Attachment, Breakdown, ProjectBreakdowns } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Link } from '../../../../../libs/types/src/link.model';

export type BreakdownDocument = BreakdownModel & mongoose.Document;
export type ProjectBreakdownsModelDocument = ProjectBreakdownsModel & mongoose.Document;

@Schema()
export class ProjectBreakdownsModel implements ProjectBreakdowns {
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    projectType: string; 
    @Prop({required: true})
    description: string;
    @Prop({required: true})
    union: string;
    @Prop()
    unionStatusPending?: boolean;
    @Prop()
    unionContract?: string;
    @Prop({required: true})
    startDate: string;

    @Prop()
    attachments?: Attachment[]; 
    @Prop()
    links?: Link[];
}

@Schema()
export class BreakdownModel implements Breakdown {
    @Prop({required: true})
    roleName: string;
    @Prop({required: true})
    roleDescription: string;
    @Prop({required: true})
    roleType: string;
    @Prop()
    rate?: string; //how much does it pay

    @Prop()
    gender?: string;
    @Prop()
    ageMin?: number;
    @Prop()
    ageMax?: number;
    @Prop()
    ethnicities?: string[];
    @Prop()
    attachments?: Attachment[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: ProjectBreakdownsModel.name }] })
    project: ProjectBreakdowns;
}


export const BreakdownSchema = SchemaFactory.createForClass(BreakdownModel);
export const ProjectBreakdownsSchema = SchemaFactory.createForClass(ProjectBreakdownsModel);