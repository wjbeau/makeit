import { Injectable } from '@nestjs/common';
import { UserAccount } from '@makeit/types';

@Injectable()
export class UserService {
  //TODO replace with DB call/storage
  private readonly users: UserAccount[] = [
    {
      userId: 'john@test.com',
      firstName: 'John',
      lastName: 'Billingham',
      password: 'changeme',
      profiles: [],
    },
    {
      userId: 'john2@test.com',
      firstName: 'John2',
      lastName: 'Billingham2',
      password: 'changeme',
      profiles: [],
    },
  ];

  async findById(userId: string): Promise<UserAccount | undefined> {
    return this.users.find((user) => user.userId === userId);
  }

  async getHello(): Promise<string> {
    return new Promise<string>((resolve) => {
      resolve('Hello World!');
    });
  }
}
