// Model / State objects for the auditions feature

import { Link } from "react-router-dom";
import { Attachment } from "../datatypes/attachment.model";

export interface BreakdownsState {
    loading: boolean;
}

export interface ProjectBreakdowns {
    id: string;

    //TODO replace this with project structure later
    name: string;
    projectType: string; 
    description: string;
    union: string;
    unionStatusPending?: boolean;
    unionContract?: string;
    startDate: string;

    attachments: Attachment[]; //eg sides.
    links: Link[]; //eg project website
}

export interface Breakdown {
    id: string;
    roleName: string;
    roleDescription: string;
    roleType: string;
    rate: string; //how much does it pay

    gender?: string;
    ageMin?: number;
    ageMax?: number;
    ethnicities?: string[];
    attachments: Attachment[]; //eg sides.

    project: ProjectBreakdowns;
}


