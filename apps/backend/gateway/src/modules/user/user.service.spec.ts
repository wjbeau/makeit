import { Model } from 'mongoose';
import {
  anything,
  deepEqual,
  instance,
  mock,
  reset,
  verify,
  when,
} from 'ts-mockito';
import { UserDocument } from '../../schema/user.schema';
import {
  MockableDocumentQuery,
  MockableModel,
  MockableDocument,
} from '../../test/mockables';
import { CryptoService } from '../common-services/crypto.service';
import { UserService } from './user.service';
import { UserAccount, ModelFactory } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { strictEqual } from 'ts-mockito';

describe('UserService', () => {
  let classUnderTest: UserService;

  const mockCryptoService = mock(CryptoService);
  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockDocument = mock(MockableDocument);
  const currentUser = ModelFactory.createEmptyUserAccount()
  currentUser._id = "someid"

  beforeEach(async () => {
    classUnderTest = new UserService(
      instance(mockCryptoService),
      instance(mockModel) as Model<UserDocument>
    );
  });

  afterEach(async () => {
    reset(mockCryptoService);
    reset(mockModel);
    reset(mockQuery);
    reset(mockDocument);
  });

  describe('findByEmail', () => {
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

  describe('save', () => {
    it('should return valid User when properly updated', async () => {
      const user: UserAccount = ModelFactory.createEmptyUserAccount();
      user._id = currentUser._id;

      when(mockDocument.save()).thenReturn(instance(mockDocument));
      when(mockDocument.toObject()).thenReturn(user);

      when(mockModel.findOne(deepEqual({ _id: user._id }))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(user._id, user, currentUser);
      verify(mockDocument.set(anything())).once();
      verify(mockDocument.save()).once();
      verify(mockModel.findOne(deepEqual({ _id: user._id }))).once();
      expect(result).toEqual(user);
    });

    it('should return valid User when properly inserted', async () => {
      const user: UserAccount = ModelFactory.createEmptyUserAccount();
      user._id = null;
      user.password = "mypass";
      user.tokens = [];

      when(mockDocument.toObject()).thenReturn(user);

      when(mockModel.create(deepEqual(user))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      when(mockCryptoService.hash(strictEqual(user.password))).thenResolve("hashed");

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(user._id, user, null);
      verify(mockDocument.set(anything())).never();
      verify(mockModel.create(deepEqual(user))).once();
      verify(mockModel.findOne(anything())).never();
      verify(mockCryptoService.hash(strictEqual("mypass"))).once();
      expect(result.password).toBeUndefined();
      expect(result.tokens).toBeUndefined();
      const {password, tokens, ...rest} = user
      expect(result).toEqual(rest);
    });

    it('should throw error when ids arent a match', async () => {
      const user: UserAccount = ModelFactory.createEmptyUserAccount();
      user._id = 'userid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', user, currentUser);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding user', async () => {
      const user: UserAccount = ModelFactory.createEmptyUserAccount();
      user._id = 'userid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, user, currentUser);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new user', async () => {
      const user: UserAccount = ModelFactory.createEmptyUserAccount();

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('some_id', user, currentUser);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should return throw error when specified user doesnt exist for update', async () => {
      const user: UserAccount = ModelFactory.createEmptyUserAccount();
      user._id = currentUser._id;

      when(mockDocument.toObject()).thenReturn(user);

      when(mockModel.findOne(deepEqual({ _id: user._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );
      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(user._id, user, currentUser);
        fail();
      } catch (e) {
        expect(e.message).toEqual('Not Found');
      }
    });

    it('should return throw error when database interaction fails', async () => {
      const user: UserAccount = ModelFactory.createEmptyUserAccount();
      user._id = currentUser._id;

      when(mockDocument.toObject()).thenReturn(user);

      const err = new Error('mock error');
      when(mockModel.findOne(deepEqual({ _id: user._id }))).thenThrow(err);

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(user._id, user, currentUser);
        fail();
      } catch (e) {
        expect(e).toEqual(err);
      }
    });
  });
});
