import { HasAttachments } from './attachment.model';
import { BaseEntity } from './base.model';
import { Project } from './project.model';

export interface Breakdown extends BaseEntity, HasAttachments {
    roleName?: string;
    roleDescription?: string;
    roleType?: string;

    rate?: string; //how much does it pay
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    ethnicities?: string[];

    project?: Project;
}
