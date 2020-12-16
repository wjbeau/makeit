import { Address } from './address.model';
import { Audition, AuditionType, AuditionStatus } from './audition.model';
import { Breakdown } from './breakdown.model';
import { Project, ProjectStatus, ProjectType, UnionType } from './project.model';
import { Gender, Ethnicity } from './base-enums.model';
import { Contact } from './contact.model';


export class ModelFactory {
    public static createEmptyAudition():Audition {
        return {
            breakdown: this.createEmptyBreakdown(),
            instructions: undefined,
            type: AuditionType.InPersonAudition,
            auditionTime: null,
            deadline: null,
            callbackDate: null,
            address: this.createEmptyAddress(),
            status: AuditionStatus.Invited,
            statusReason: undefined,
            followUpTo: undefined,
            reminderNote: undefined,
            reminderTime: null,
            notes: [],
            participants: [],
            links: [],
            attachments: []
        }
    }

    public static createEmptyBreakdown():Breakdown {
        return {
            roleName: undefined,
            roleDescription: undefined,
            roleType: undefined,
        
            rate: undefined, //how much does it pay
            gender: Gender.Unspecified,
            ageMin: undefined,
            ageMax: undefined,
            ethnicities: [Ethnicity.Any],
            project: this.createEmptyProject(),
            links: [],
            attachments: []
        }
    }

    public static createEmptyAddress():Address {
        return {
            line1: undefined,
            line2: undefined,
            line3: undefined,
            city: undefined,
            state: undefined,
            zip: undefined,
            country: undefined,
        }
    }

    public static createEmptyProject():Project {
        return {
            name: undefined,
            projectType: ProjectType.Pilot,
            description: undefined,
            union: UnionType.NonUnion,
            startDate: null,
            participants: [],
            links: [],
            attachments: [],
            status: ProjectStatus.Provisional,
            calls: []
        }
    }
    public static createEmptyContact():Contact {
        return {
            addresses: [],
            telecoms: [],
            links: [],
            company: undefined,
            jobTitle: undefined,
            note: undefined,
            description: undefined,
            firstName: undefined,
            lastName: undefined,
            avatar: undefined,
            owner: undefined
        }
    }
}