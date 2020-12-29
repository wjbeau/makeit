import { UserAccount } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { instance, mock, reset, strictEqual, when } from 'ts-mockito';
import { UserAccountModel } from '../../schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controllerUnderTest: UserController;

  const mockedService = mock(UserService);

  beforeEach(async () => {
    const mockedServiceInstance = instance(mockedService);

    controllerUnderTest = new UserController(mockedServiceInstance)
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('updateUser', () => {
    it('should update when all is valid', async () => {
      const params = { id: 'someid' }
      const aud = new UserAccountModel();
      aud['_id'] = params.id;

      when(mockedService.save(strictEqual(params.id), strictEqual(aud))).thenReturn(
        new Promise<UserAccount>((resolve) => { resolve(aud) }),
      );
      const result = await controllerUnderTest.updateUser(params, aud)
      expect(result).toBeDefined();
      expect(result).toEqual(aud);
    });
    it('should fail when an error is thrown', async () => {
      const params = { id: 'someid' }
      const aud = new UserAccountModel();
      aud['_id'] = params.id;
      const error = new BadRequestException('Nonono');

      when(mockedService.save(strictEqual(params.id), strictEqual(aud))).thenThrow(error);

      try {
        await controllerUnderTest.updateUser(params, aud)
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });

    describe('createUser', () => {
      it('should save when all is valid', async () => {
        const aud = new UserAccountModel();
  
        when(mockedService.save(strictEqual(null), strictEqual(aud))).thenReturn(
          new Promise<UserAccountModel>((resolve) => { resolve(aud) }),
        );
        const result = await controllerUnderTest.createUser(aud)
        expect(result).toBeDefined();
        expect(result).toEqual(aud);
      });

      it('should fail when an error is thrown', async () => {
        const aud = new UserAccountModel();
        const error = new BadRequestException('Nonono');
  
        when(mockedService.save(strictEqual(null), strictEqual(aud))).thenThrow(error);
  
        try {
          await controllerUnderTest.createUser(aud)
          fail();
        } catch (e) {
          expect(e).toEqual(error); 
        }
      });
    });
  });
});
