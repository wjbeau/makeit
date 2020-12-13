import { Address } from './address.model';
import { PersonInfo } from './user.model';

export interface Contact extends PersonInfo {
  addresses?: ContectAddress[];
  telecoms: Telecom[];
  links: ContactLink[];
  company: string;
  jobTitle: string;
  note: string;
  description: string;
}

export interface ContectAddress extends PersonInfo {
  address: Address;
  type: AddressType;
  mailingAddress: boolean;
}

export interface Telecom extends PersonInfo {
  details: string;
  type: TelecomType;
}

export interface ContactLink extends PersonInfo {
  url: string;
  type: ContactLinkType;
}

export enum ContactLinkType {
    PersonalWebsite  = "PersonalWebsite",
    BusinessWebsite = "BusinessWebsite",
    Facebook = "Facebook",
    Instagram = "Instagram",
    LinkedIn = "LinkedIn",
    IMDb = "IMDb",
    YouTube = "YouTube",
    Pintrest = "Pintrest",
    Twitter = "Twitter",
    Vimeo = "Vimeo",
    Other = "Other"
}

export enum AddressType {
    Personal  = "Personal",
    Business = "Business",
    Other = "Other"
}


export enum TelecomType {
    HomePhone  = "HomePhone",
    WorkPhone = "WorkPhone",
    Mobile = "Mobile",
    Mobile2 = "Mobile2",
    OtherPhone = "OtherPhone",
    PersonalEmail  = "PersonalEmail",
    WorkEmail = "WorkEmail",
    OtherEmail = "OtherEmail",
    Other = "Other",
    Fax = "Fax",
    Skype = "Skype",
}

export class ContactUtils {
  public static isEmail(val: TelecomType): boolean {
    return (val === TelecomType.PersonalEmail
      || val === TelecomType.WorkEmail
      || val === TelecomType.OtherEmail);
  }

  public static isPhone(val: TelecomType): boolean {
    return (val === TelecomType.HomePhone
      || val === TelecomType.WorkPhone
      || val === TelecomType.Mobile
      || val === TelecomType.Mobile2
      || val === TelecomType.OtherPhone);
  }

  public static isSocialMedia(val: ContactLinkType): boolean {
    return (val === ContactLinkType.Facebook
      || val === ContactLinkType.Instagram
      || val === ContactLinkType.LinkedIn
      || val === ContactLinkType.IMDb
      || val === ContactLinkType.Vimeo
      || val === ContactLinkType.Pintrest
      || val === ContactLinkType.Twitter
      || val === ContactLinkType.YouTube);
  }
}