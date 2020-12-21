import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModel, EventSchema } from '../../schema/event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
    controllers: [
        EventController
    ],
    imports: [
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
