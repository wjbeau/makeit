import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    ProfileModule, 
    MongooseModule.forRoot('mongodb://localhost/makeit') //TODO move this into configuration...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
