import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BreakdownModel, BreakdownSchema } from '../../schema/breakdown.schema';
import { ProjectModel, ProjectSchema } from '../../schema/project.schema';
import { BreakdownService } from './breakdown.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BreakdownModel.name, schema: BreakdownSchema },
            { name: ProjectModel.name, schema: ProjectSchema }
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
