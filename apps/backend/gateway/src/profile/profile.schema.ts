import { PerformerProfile, Profile, ProfileType } from '@makeit/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AgentManagerProfile } from '@makeit/types';

export type ProfileDocument = ProfileModel & mongoose.Document;

@Schema()
export class PerformerProfileModel implements PerformerProfile {
    type: ProfileType.Performer;

}

@Schema()
export class AgentManagerProfileModel  implements AgentManagerProfile {
    type: ProfileType.AgentManager;
}

@Schema({ discriminatorKey: 'type' })
export class ProfileModel implements Profile {
  @Prop({
    type: String,
    required: true,
    enum: [PerformerProfileModel.name, AgentManagerProfileModel.name],
  })
  type: ProfileType;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileModel);
export const PerformerProfileSchema = SchemaFactory.createForClass(PerformerProfileModel);
export const AgentManagerProfileSchema = SchemaFactory.createForClass(AgentManagerProfileModel);
