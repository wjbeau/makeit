import { Address } from './address.model';
import { PersonInfo } from './user.model';

export interface Contact extends PersonInfo {
  addresses?: ContectAddress[];
  emails: Email[];
  phones: Phone[];
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

export interface Email extends PersonInfo {
  email: string;
  type: EmailType;
}

export interface Phone extends PersonInfo {
  number: string;
  type: PhoneType;
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
    Vimeo = "Vimeo",
    YouTube = "YouTube",
    Other = "Other"
}

export enum AddressType {
    Personal  = "Personal",
    Business = "Business",
    Other = "Other"
}

export enum EmailType {
    Personal  = "Personal",
    Work = "Work",
    Other = "Other"
}

export enum PhoneType {
    Home  = "Home",
    Work = "Work",
    Mobile = "Mobile",
    Fax = "Fax"
}