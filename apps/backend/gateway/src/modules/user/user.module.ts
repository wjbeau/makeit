import { Module } from '@nestjs/common';
import { UserAccountSchema, UserAccountModel } from '../../schema/user.schema';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonServicesModule } from '../common-services/common-services.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    CommonServicesModule,
    MongooseModule.forFeature([{ name: UserAccountModel.name, schema: UserAccountSchema }])
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
