import { Permission, PermissionRole,  HasPermissions, PermissionType} from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PermissionDocument = PermissionModel & mongoose.Document;

@Schema()
export class PermissionModel implements Permission {
    @Prop({required: true})
    subject: string;
    
    @Prop({ enum: Object.values(PermissionType), type: String, required: true })
    type: PermissionType;
    
    @Prop({ enum: Object.values(PermissionRole), type: String, required: true })
    role: PermissionRole;
}

export const PermissionSchema = SchemaFactory.createForClass(PermissionModel);

export const permissionsSpec = (userid, profileType, roles: PermissionRole[] ) => {
    return {
        $or: [
            {
                $and: [
                    {'permissions.subject': userid},
                    {'permissions.type': PermissionType.Individual},
                    {'permissions.role': { $in: roles}}
                ]
            },
            {
                $and: [
                    {'permissions.subject': profileType},
                    {'permissions.type': PermissionType.ProfileType},
                    {'permissions.role': { $in: roles}}
                ]
            },
        ]
    }
}

export const ensureAdminPermission = (container: HasPermissions, userid) => {
    if(!container.permissions) {
        container.permissions = []
    }
    container.permissions.push({
        subject: userid,
        type: PermissionType.Individual,
        role: PermissionRole.Admin
    })
}