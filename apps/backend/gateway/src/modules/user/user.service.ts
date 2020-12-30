import {
  Injectable,
  Logger,
  OnModuleInit,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
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
    const result = await this.userModel.findById(user._id);

    const randomToken = Array(40)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    const expiryDate = moment()
      .add(+process.env.BACKEND_REFRESH_DURATION_DAYS, 'days')
      .toDate();

    const token = {
      token: randomToken,
      expires: expiryDate,
      type: AccessTokenType.Refresh,
    };
    if (!result.tokens) {
      result.tokens = [];
    } else {
      const now = new Date();
      result.tokens = result.tokens.filter((t) => t.expires >= now);
    }
    result.tokens.push(token);

    await result.save();

    return token;
  }

  async changePassword(
    id: string,
    oldPwd: string,
    newPwd: string,
    currentUser: UserAccount
  ): Promise<boolean> {
    //for now you can only change your own user account
    if (id !== currentUser._id) {
      throw new UnauthorizedException();
    }

    const result = await this.userModel
      .findOne({ _id: id })
      .then((dbRes) => dbRes)
      .catch((error) => {
        throw new BadRequestException(error, 'Database search failed.');
      });

    if (result) {
      const dbPwd = result.password;

      if (!await this.cryptoService.compare(oldPwd, dbPwd)) {
        throw new BadRequestException('Passwords don\'t match, please try again.');
      }

      await this.cryptoService.hash(newPwd).then((h) => {
        result.set({password: h});
      });

      await result.save();
      return true;
    } else {
      throw new NotFoundException('No such user account found.');
    }
  } 

  async save(
    id: string,
    user: UserAccount,
    currentUser: UserAccount
  ): Promise<UserAccount> {
    //the path variable must match the data posted
    if ((id || user._id) && id !== user._id) {
      throw new BadRequestException();
    }

    //if you're logged in you can only update your own user (for now)
    if (currentUser && currentUser._id !== user._id) {
      throw new UnauthorizedException();
    }

    //if you're not logged in (i.e. a new registration) you can't be updating an existing user
    if (!currentUser && user._id) {
      throw new UnauthorizedException();
    }

    // Find the document and update it if required or save a new one if not.
    if (id) {
      const result = await this.userModel
        .findOne({ _id: id })
        .then((dbRes) => {
          if (dbRes) {
            //apply the changes with the exception of the password, refresh tokens and profiles
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, tokens, profiles, ...rest } = user;
            dbRes.set(rest);
            return dbRes;
          }
          throw new NotFoundException();
        })
        .catch((error) => {
          throw new BadRequestException(error, 'Database update failed.');
        });

        try {
          await result.save();
        }
        catch (error) {
          this.handleDuplicateKey(error, user.email)
          throw error;

        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, tokens, ...rest } = result.toObject();
      return rest;
    } else {
      await this.cryptoService.hash(user.password).then((h) => {
        user.password = h;
      });
      const result = await this.userModel.create(user)
        .then((u) => u)
        .catch((err) => {
          this.handleDuplicateKey(err, user.email)
          throw err
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, tokens, ...rest } = result.toObject();
      return rest;
    }
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
            tokens: [],
          });
        });
      }
    });
  }

  private handleDuplicateKey(error, email) {
    if(error.code === 11000) {
      throw new BadRequestException(`An account for '${email}' already exists`);
    }
  }
}
