import { BaseEntity } from './base.model';

export interface HasPermissions {
    permissions: Permission[];
}

export interface Permission extends BaseEntity {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subject: any,
    type: PermissionType,
    role: PermissionRole
}

export enum PermissionType {
    Individual = 'Individual',
    ProfileType = 'ProfileType'
}

export enum PermissionRole {
    Admin = 'Admin',
    Editor = 'Editor',
    Viewer = 'Viewer'
}