import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserAccountModel, UserDocument } from '../../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CryptoService } from '../common-services/crypto.service';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private cryptoService: CryptoService,
    @InjectModel(UserAccountModel.name) private userModel: Model<UserDocument>
  ) {}

  async findByEmail(email: string): Promise<UserAccountModel | undefined> {
    const query = this.userModel.findOne({ email: { $eq: email } });
    const result = await query.lean().exec();
    return result;
  }

  onModuleInit() {
    Logger.debug('Checking whether to seed database');
    this.findByEmail('admin').then((data) => {
      if (!data) {
        Logger.debug('Admin user not found - seeding database...');
        this.cryptoService.hash('changeme').then((h) => {
          this.userModel.create({
            email: 'admin',
            firstName: 'Will',
            lastName: 'Beaumont',
            password: h,
            avatar: null,
            profiles: [],
          });
        });
      }
    });
  }
}
