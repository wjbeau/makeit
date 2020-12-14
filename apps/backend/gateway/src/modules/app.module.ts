import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditionModule } from './audition/audition.module';
import { BreakdownModule } from './breakdown/breakdown.module';
import { ProjectModule } from './project/project.module';
import { CommonServicesModule } from './common-services/common-services.module';
import { FileModule } from './files/file.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    CommonServicesModule,
    AuthModule, 
    UserModule, 
    ProfileModule, 
    BreakdownModule,
    AuditionModule,
    ProjectModule,
    FileModule,
    ContactModule,
    MongooseModule.forRoot('mongodb://localhost/makeit', {'useFindAndModify': false}) //TODO move this into configuration...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
