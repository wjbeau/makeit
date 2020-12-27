import {
  Transaction,
  ModelFactory,
} from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
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
import { TransactionDocument } from '../../schema/Transaction.schema';
import {
  MockableDocument,
  MockableDocumentQuery,
  MockableModel,
} from '../../test/mockables';
import { TransactionService } from './Transaction.service';
import * as moment from 'moment';

describe('TransactionService', () => {
  let classUnderTest: TransactionService;

  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockDocument = mock(MockableDocument);
  const mockRequest = {
    user: {
      _id: 'someID'
    }
  }

  beforeEach(async () => {
    classUnderTest = new TransactionService(
      mockRequest,
      instance(mockModel) as Model<TransactionDocument>
    );
  });

  afterEach(async () => {
    reset(mockModel);
    reset(mockQuery);
    reset(mockDocument);
  });

  describe('save', () => {
    it('should return valid Transaction when properly updated, no breakdown', async () => {
      const transaction: Transaction = ModelFactory.createEmptyTransaction();
      transaction._id = 'transactionid';

      when(mockDocument.save()).thenReturn(instance(mockDocument));
      when(mockDocument.toObject()).thenReturn(transaction);

      when(mockModel.findOne(deepEqual({ _id: transaction._id }))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        transaction._id,
        transaction,
        'userid'
      );
      verify(mockDocument.set(anything())).once();
      verify(mockDocument.save()).once();
      verify(mockModel.findOne(deepEqual({ _id: transaction._id }))).once();
      expect(result).toEqual(transaction);
    });

    it('should return valid Transaction when properly inserted', async () => {
      const transaction: Transaction = ModelFactory.createEmptyTransaction();
      transaction._id = null;

      when(mockDocument.toObject()).thenReturn(transaction);

      when(mockModel.findOne(deepEqual({ _id: transaction._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      when(mockModel.create(deepEqual(transaction))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        transaction._id,
        transaction,
        'userid'
      );
      verify(mockDocument.set(anything())).never();
      verify(mockModel.create(deepEqual(transaction))).once();
      verify(mockModel.findOne(deepEqual({ _id: transaction._id }))).once();
      expect(result).toEqual(transaction);
    });

    it('should throw error when ids arent a match', async () => {
      const transaction: Transaction = ModelFactory.createEmptyTransaction();
      transaction._id = 'transactionid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', transaction, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding transaction', async () => {
      const transaction: Transaction = ModelFactory.createEmptyTransaction();
      transaction._id = 'transactionid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, transaction, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new transaction', async () => {
      const transaction: Transaction = ModelFactory.createEmptyTransaction();

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('some_id', transaction, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should return throw error when database interaction fails', async () => {
      const transaction: Transaction = ModelFactory.createEmptyTransaction();
      transaction._id = 'transactionid';

      when(mockDocument.toObject()).thenReturn(transaction);

      when(mockModel.findOne(deepEqual({ _id: transaction._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      const err = new Error('mock error');
      when(mockModel.create(deepEqual(transaction))).thenThrow(err);
      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(transaction._id, transaction, 'userid');
        fail();
      } catch (e) {
        expect(e).toEqual(err);
      }
    });
  });

  describe('findById', () => {
    it('should return valid Transaction when found', async () => {
      const transaction: Transaction = ModelFactory.createEmptyTransaction();
      transaction._id = 'transactionid';

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(transaction);
        })
      );
      when(mockModel.findOne(deepEqual({ _id: transaction._id }))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(transaction._id);
      expect(result).toEqual(transaction);
    });
    it('should return null Transaction when not found', async () => {
      const id = 'someid';
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(null);
        })
      );
      when(mockModel.findOne(deepEqual({ _id: id }))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(id);
      expect(result).toBeNull();
    });

    it('should throw error when db error occurs', async () => {
      const id = 'some_id';
      const err = new Error('database problem!');
      when(mockModel.findOne(deepEqual({ _id: id }))).thenThrow(err);

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.findById(id);
        fail();
      } catch (e) {
        expect(e).toBe(err);
      }
    });
  });

  describe('findAllForUser', () => {
    it('should return valid Transactions when found', async () => {
      const id = 'someid';
      const transaction1: Transaction = ModelFactory.createEmptyTransaction();
      transaction1._id = 'transactionid1';
      const transaction2: Transaction = ModelFactory.createEmptyTransaction();
      transaction2._id = 'transactionid2';
      const transactions: Transaction[] = [transaction1, transaction2];

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(
        mockQuery.sort(deepEqual({ deadline: -1, transactionTime: -1 }))
      ).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(transactions);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            $and: [
              {},
              {
                owner: id
              }
            ]
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id);
      expect(result).toEqual(transactions);
      verify(mockQuery.exec()).once();
    });
    it('should return null Transaction when not found', async () => {
      const id = 'someid';
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(null);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            $and: [
              {},
              {
                owner: id
              }
            ]
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id);
      expect(result).toBeNull();
      verify(
        mockModel.find(
          deepEqual({
            $and: [
              {},
              {
                owner: id
              }
            ]
          })
        )
      ).once();
    });

    it('should return valid Transactions when called with date range', async () => {
      const id = 'someid';
      const transaction1: Transaction = ModelFactory.createEmptyTransaction();
      transaction1._id = 'transactionid1';
      const transaction2: Transaction = ModelFactory.createEmptyTransaction();
      transaction2._id = 'transactionid2';
      const transactions: Transaction[] = [transaction1, transaction2];
      const fromDate = moment("2020-12-12", "YYYY-MM-DD").toDate();
      const toDate = moment("2021-01-12", "YYYY-MM-DD").toDate();

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(transactions);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            $and: [
              {
                $and: [
                  { 'date': { $gte: fromDate }},
                  { 'date': { $lte: toDate }}
                ]
              },
              {
                owner: id
              }
            ]
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id, fromDate, toDate);
      expect(result).toEqual(transactions);

      verify(mockQuery.exec()).once();
    });

    it('should throw error when db error occurs', async () => {
      const id = 'some_id';
      const err = new Error('database problem!');
      when(mockModel.find(anything())).thenThrow(err);

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.findAllForUser(id);
        fail();
      } catch (e) {
        expect(e).toBe(err);
      }
    });
  });

  describe('delete', () => {
    it('should delete and return true if found', async () => {
      const id = 'someid'
      when(
        mockModel.remove(deepEqual({
          _id: id,
          owner: mockRequest.user['_id']
        }))
        ).thenReturn({ deletedCount: 1});

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.delete(id);
      expect(result).toBeTruthy();
      verify(
        mockModel.remove(deepEqual({
          _id: id,
          owner: mockRequest.user['_id']
        }))
        ).once();
    });
    it('should return false if not found', async () => {
      const id = 'someid'
      when(
        mockModel.remove(deepEqual({
          _id: id,
          owner: mockRequest.user['_id']
        }))
        ).thenReturn({ deletedCount: 0});

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.delete(id);
      expect(result).toBeFalsy();
      verify(
        mockModel.remove(deepEqual({
          _id: id,
          owner: mockRequest.user['_id']
        }))
        ).once();
    });

    it('should throw error when db error occurs', async () => {
      const id = 'someid'
      const err = new Error('database problem!');
      when(
        mockModel.remove(deepEqual({
          _id: id,
          owner: mockRequest.user['_id']
        }))
        ).thenThrow(err);

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.delete(id);
        fail();
      } catch (e) {
        expect(e).toBe(err);
      }
    });
  });
});
