import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserAccountModel, UserDocument } from '../../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CryptoService } from '../common-services/crypto.service';
import { AccessToken, UserAccount, AccessTokenType } from '@makeit/types';
import * as moment from 'moment';

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

  async generateRefreshToken(user: UserAccount): Promise<AccessToken> {
    const result = (await this.userModel.findById(user._id));

    const randomToken =  Array(40)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    const expiryDate = moment().add(+process.env.BACKEND_REFRESH_DURATION_DAYS, "days").toDate();

    const token = {
      token: randomToken,
      expires: expiryDate,
      type: AccessTokenType.Refresh
    }
    if(!result.tokens) {
      result.tokens = []
    }
    else {
      const now = new Date();
      result.tokens = result.tokens.filter(t => t.expires >= now);
    }
    result.tokens.push(token)

    await result.save();

    return token;
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
            tokens: []
          });
        });
      }
    });
  }
}
