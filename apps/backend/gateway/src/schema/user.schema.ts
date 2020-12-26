import { UserAccount, Profile, PersonInfo, TenantEntity } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ProfileModel } from './profile.schema';


export type PersonInfoDocument = PersonInfoModel & mongoose.Document;

@Schema()
export class PersonInfoModel implements PersonInfo {
    @Prop()
    firstName: string;
    @Prop()
    lastName: string;
    @Prop()
    avatar: string;
}

export const PersonInfoSchema = SchemaFactory.createForClass(PersonInfoModel);

export type UserDocument = UserAccountModel & mongoose.Document;

@Schema()
export class UserAccountModel implements UserAccount {
    @Prop({ required: true })
    email: string;
    @Prop()
    password?: string;
    @Prop({ required: true })
    firstName: string;
    @Prop({ required: true })
    lastName: string;
    @Prop()
    avatar: string;


    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: ProfileModel.name }])
    profiles: Profile[];
}

export const UserAccountSchema = SchemaFactory.createForClass(UserAccountModel);

export const ensureTenant = (entity: TenantEntity, userid) => {
    entity.owner = userid;
}