import { Address } from './address.model';
import { Audition, AuditionType, AuditionStatus, AuditionSource } from './audition.model';
import { Breakdown } from './breakdown.model';
import {
  Project,
  ProjectStatus,
  ProjectType,
  UnionType,
  ProjectEvent,
  ProjectEventType,
} from './project.model';
import { Gender, Ethnicity } from './base-enums.model';
import { Contact } from './contact.model';
import { Event, Transaction, TransactionIncomeCategory } from '@makeit/types';
import { EventType } from './event.model';
import { TransactionType, TransactionExpenseCategory, TransactionRelationType } from './finance.model';
import { ProjectSource } from './project.model';

export class ModelFactory {
  public static createEmptyAudition(status?:AuditionStatus, type?:AuditionType): Audition {
    return {
      breakdown: this.createEmptyBreakdown(),
      instructions: undefined,
      type: type ?? AuditionType.InPersonAudition,
      auditionTime: null,
      deadline: null,
      callbackDate: null,
      address: this.createEmptyAddress(),
      status: status ?? AuditionStatus.Invited,
      statusReason: undefined,
      followUpTo: undefined,
      reminderNote: undefined,
      reminderTime: null,
      notes: [],
      participants: [],
      links: [],
      attachments: [],
      permissions: [],
      source: AuditionSource.SelfSubmit
    };
  }

  public static createEmptyBreakdown(): Breakdown {
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
      attachments: [],
      permissions: [],
    };
  }

  public static createEmptyAddress(): Address {
    return {
      line1: undefined,
      line2: undefined,
      line3: undefined,
      city: undefined,
      state: undefined,
      zip: undefined,
      country: undefined,
    };
  }

  public static createEmptyEvent(start?: Date, end?: Date): Event {
    return {
      title: undefined,
      description: undefined,
      eventType: EventType.Calendar,
      start: start,
      end: end,
      participants: [],
      attachments: [],
      links: [],
      permissions: [],
    };
  }

  public static createEmptyProject(status?: ProjectStatus, source?:ProjectSource): Project {
    return {
      name: undefined,
      projectType: ProjectType.Pilot,
      description: undefined,
      union: UnionType.NonUnion,
      startDate: null,
      events: [],
      participants: [],
      links: [],
      attachments: [],
      status: status ? status : ProjectStatus.Provisional,
      permissions: [],
      source: source
    };
  }

  public static createEmptyTransaction(
    type?: TransactionType,
    category?: TransactionExpenseCategory | TransactionIncomeCategory,
    related?,
    relatedType?: TransactionRelationType
  ): Transaction {
    return {
      type: type ?? TransactionType.Expense,
      description: '',
      amount: 0,
      category: category ?? TransactionExpenseCategory.Fuel,
      date: new Date(),
      owner: undefined,
      relatesTo: related,
      relatesToType: relatedType,
      links: [],
      attachments: [],
    };
  }

  public static createEmptyProjectEvent(time?: Date): ProjectEvent {
    return {
      notes: undefined,
      time: time,
      eventType: ProjectEventType.CallTime,
      attachments: [],
      links: [],
      participants: [],
      permissions: [],
    };
  }

  public static createEmptyContact(): Contact {
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
      owner: undefined,
    };
  }
}
