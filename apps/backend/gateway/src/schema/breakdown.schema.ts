import { Attachment, Breakdown, ProjectBreakdowns, ProjectType, UnionType, Link } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type BreakdownDocument = BreakdownModel & mongoose.Document;
export type ProjectBreakdownsModelDocument = ProjectBreakdownsModel & mongoose.Document;

@Schema()
export class ProjectBreakdownsModel implements ProjectBreakdowns {
    @Prop()
    name?: string;
    @Prop({ enum: Object.values(ProjectType), type: String })
    projectType?: ProjectType; 
    @Prop()
    description?: string;
    @Prop({ enum: Object.values(UnionType), type: String })
    union?: UnionType;
    @Prop()
    startDate?: string;

    @Prop()
    attachments?: Attachment[]; 
    @Prop()
    links?: Link[];
}

@Schema()
export class BreakdownModel implements Breakdown {
    @Prop()
    roleName?: string;
    @Prop()
    roleDescription?: string;
    @Prop()
    roleType?: string;
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