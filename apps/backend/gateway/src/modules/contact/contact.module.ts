import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModel, ContactSchema } from '../../schema/contact.schema';
import { FileModule } from '../files/file.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
    imports: [
        FileModule,
        MongooseModule.forFeature([
            { name: ContactModel.name, schema: ContactSchema }
        ])
    ],
    controllers: [ContactController],
    providers: [ContactService],
})
export class ContactModule {}
 
