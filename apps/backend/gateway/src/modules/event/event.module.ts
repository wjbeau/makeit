import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModel, EventSchema } from '../../schema/event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ProjectModule } from '../project/project.module';
import { AuditionModule } from '../audition/audition.module';

@Module({
    controllers: [
        EventController
    ],
    imports: [
        ProjectModule,
        AuditionModule,
        MongooseModule.forFeature([
            { name: EventModel.name, schema: EventSchema }
        ])
    ],
    providers: [
        EventService
    ],
    exports: [
        EventService
    ]})
export class EventModule {}
