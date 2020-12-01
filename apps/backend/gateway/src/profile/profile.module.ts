import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModel, ProfileSchema } from './profile.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: ProfileModel.name, schema: ProfileSchema }])
    ],
})
export class ProfileModule {}
