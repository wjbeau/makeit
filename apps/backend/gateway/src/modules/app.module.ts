import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditionModule } from './audition/audition.module';
import { BreakdownModule } from './breakdown/breakdown.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    ProfileModule, 
    BreakdownModule,
    AuditionModule,
    ProjectModule,
    MongooseModule.forRoot('mongodb://localhost/makeit') //TODO move this into configuration...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
