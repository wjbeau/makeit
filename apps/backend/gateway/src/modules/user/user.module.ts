import { Module } from '@nestjs/common';
import { UserAccountSchema, UserAccountModel } from '../../schema/user.schema';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserAccountModel.name, schema: UserAccountSchema }])
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
