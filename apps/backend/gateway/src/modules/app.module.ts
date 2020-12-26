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
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonServicesModule,
    AuthModule, 
    UserModule, 
    ProfileModule, 
    BreakdownModule,
    AuditionModule,
    ProjectModule,
    FileModule,
    ContactModule,
    EventModule,
    TransactionModule,
    MongooseModule.forRoot(`mongodb://localhost/makeit`, {'useFindAndModify': false}) //TODO externalize this config
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
