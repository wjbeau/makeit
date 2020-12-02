import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document } from 'mongoose';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';
import { MockableDocumentQuery, MockableModel } from '../test/mockables';
import { UserAccountModel } from './user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let classUnderTest: UserService;

  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockDocument = mock(Document);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
        userId: 'uid',
        firstName: 'fname',
        lastName: 'lname',
        profiles: [],
      };

      when(mockDocument.toObject()).thenReturn(user);
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(instance(mockDocument));
        })
      );
      const expectedArg = { userId: { $eq: user.userId } };
      when(mockModel.findOne(deepEqual(expectedArg))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(user.userId);
      expect(result).toEqual(user);
    });
    it('should return null when no user found', async () => {
      const userId = 'nosuchuser';
      when(mockDocument.toObject()).thenReturn(null);
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(instance(mockDocument));
        })
      );
      const expectedArg = { userId: { $eq: userId } };
      when(mockModel.findOne(deepEqual(expectedArg))).thenReturn(
        instance(mockQuery)
      );
      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(userId);
      expect(result).toBeNull();
    });
    it('should throw an error when a DB error happens', async () => {
      const userId = 'yikesuser';
      const error = new Error('Bigly DB error');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      when(mockQuery.exec()).thenThrow(error);
      const expectedArg = { userId: { $eq: userId } };
      when(mockModel.findOne(deepEqual(expectedArg))).thenReturn(
        instance(mockQuery)
      );
      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.findById(userId);
        fail();
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });
});
