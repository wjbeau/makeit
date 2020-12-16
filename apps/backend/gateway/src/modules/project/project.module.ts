import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModel, ProjectSchema } from '../../schema/project.schema';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
    controllers: [
        ProjectController
    ],
    imports: [
        MongooseModule.forFeature([
            { name: ProjectModel.name, schema: ProjectSchema }
        ])
    ],
    providers: [
        ProjectService
    ],
    exports: [
        ProjectService
    ]})
export class ProjectModule {}
