import { UserAccount } from '@makeit/types';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instance, mock, reset, when } from 'ts-mockito';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let classUnderTest: LocalStrategy;

  const mockedService = mock(AuthService);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: instance(mockedService) }
      ],
    }).compile();

    classUnderTest = app.get<LocalStrategy>(LocalStrategy);
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('validate', () => {
    it('should return valid user when all is good', async () => {
      const username = 'uid';
      const password = 'pwd';
      const user = {
        email: username,
        firstName: 'fname',
        lastName: 'lname',
        profiles: []
      }
      when(mockedService.validateUser(username, password)).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(user) }),
      );
      const result = await classUnderTest.validate(username, password)
      expect(result).toBeDefined();
      expect(result).toEqual(user)
    });
    
    it('should throw an exception when invalid user is received', async () => {
      const username = 'uid';
      const password = 'pwd';
      when(mockedService.validateUser(username, password)).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(null) }),
      );

      try {
        await classUnderTest.validate(username, password);
        fail();
      }
      catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
