import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserAccountModel, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(@InjectModel(UserAccountModel.name) private userModel: Model<UserDocument>) {}

  async findById(userId: string): Promise<UserAccountModel | undefined> {
    const result = await this.userModel.findOne({userId: {$eq: userId} }).exec();
    return result?.toObject();
  }

  onModuleInit() {
    Logger.debug('Checking whether to seed database');
    this.findById('admin').then(
      data => {
        if(!data) {
          Logger.debug('Admin user not found - seeding database...');
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync('changeme', salt);
          this.userModel.create({
            userId: 'admin',
            firstName: 'Will',
            lastName: 'Beaumont',
            password: hash,
            profiles: [],
          })
        }
      }
    );
  }
}
