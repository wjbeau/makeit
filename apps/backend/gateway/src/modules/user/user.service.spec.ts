import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document } from 'mongoose';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';
import { MockableDocumentQuery, MockableModel } from '../../test/mockables';
import { UserAccountModel } from '../../schema/user.schema';
import { UserService } from './user.service';
import { CryptoService } from '../common-services/crypto.service';

describe('UserService', () => {
  let classUnderTest: UserService;

  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockDocument = mock(Document);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        UserService,
        {
          provide: getModelToken(UserAccountModel.name),
          useValue: instance(mockModel),
        },
      ],
    }).compile();

    classUnderTest = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    reset(mockModel);
    reset(mockQuery);
    reset(mockDocument);
  });

  describe('findById', () => {
    it('should return valid user when found', async () => {
      const user = {
        email: 'uid',
        firstName: 'fname',
        lastName: 'lname',
        profiles: [],
      };

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(user);
        })
      );
      const expectedArg = { email: { $eq: user.email } };
      when(mockModel.findOne(deepEqual(expectedArg))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findByEmail(user.email);
      expect(result).toEqual(user);
    });
    it('should return null when no user found', async () => {
      const userId = 'nosuchuser';
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(null);
        })
      );
      const expectedArg = { email: { $eq: userId } };
      when(mockModel.findOne(deepEqual(expectedArg))).thenReturn(
        instance(mockQuery)
      );
      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findByEmail(userId);
      expect(result).toBeNull();
    });
    it('should throw an error when a DB error happens', async () => {
      const userId = 'yikesuser';
      const error = new Error('Bigly DB error');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenThrow(error);
      const expectedArg = { email: { $eq: userId } };
      when(mockModel.findOne(deepEqual(expectedArg))).thenReturn(
        instance(mockQuery)
      );
      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.findByEmail(userId);
        fail();
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });
});
