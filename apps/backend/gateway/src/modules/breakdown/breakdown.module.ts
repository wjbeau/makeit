import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BreakdownModel, BreakdownSchema, ProjectBreakdownsModel, ProjectBreakdownsSchema } from '../../schema/breakdown.schema';
import { BreakdownService } from './breakdown.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BreakdownModel.name, schema: BreakdownSchema },
            { name: ProjectBreakdownsModel.name, schema: ProjectBreakdownsSchema }
        ])
    ],
    providers: [
        BreakdownService
    ],
    exports: [
        BreakdownService
    ]
})
export class BreakdownModule {}
