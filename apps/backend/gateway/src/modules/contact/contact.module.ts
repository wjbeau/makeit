import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModel, ContactSchema } from '../../schema/contact.schema';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ContactModel.name, schema: ContactSchema }
        ])
    ],
    controllers: [ContactController],
    providers: [ContactService],
})
export class ContactModule {}
