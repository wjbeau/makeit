import { UserAccount, Profile } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ProfileModel } from '../profile/profile.schema';

export type UserDocument = UserAccountModel & mongoose.Document;

@Schema()
export class UserAccountModel implements UserAccount {
    @Prop({ required: true })
    userId: string;
    @Prop()
    password?: string;
    @Prop({ required: true })
    firstName: string;
    @Prop({ required: true })
    lastName: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: ProfileModel.name }] })
    profiles: Profile[];
}

export const UserAccountSchema = SchemaFactory.createForClass(UserAccountModel);