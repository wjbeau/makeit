import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditionModel, AuditionSchema } from '../../schema/Audition.schema';
import { AuditionController } from './audition.controller';
import { AuditionService } from './audition.service';
import { BreakdownModule } from '../breakdown/breakdown.module';

@Module({
    imports: [
        BreakdownModule,
        MongooseModule.forFeature([
            { name: AuditionModel.name, schema: AuditionSchema }
        ])
    ],
    controllers: [AuditionController],
    providers: [AuditionService],
    exports: [AuditionService]
})
export class AuditionModule {}
