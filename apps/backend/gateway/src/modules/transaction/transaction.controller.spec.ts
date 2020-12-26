import { Transaction } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { instance, mock, reset, strictEqual, when } from 'ts-mockito';
import { TransactionModel } from '../../schema/transaction.schema';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controllerUnderTest: TransactionController;

  const mockedService = mock(TransactionService);
  const user = {
    _id: 'someid',
    email: 'uid',
    firstName: 'fname',
    lastName: 'lname',
    avatar: '',
    profiles: []
  }

  beforeEach(async () => {
    const mockedServiceInstance = instance(mockedService);

    controllerUnderTest = new TransactionController(mockedServiceInstance)
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('getTransactions', () => {
    it('should return transactions', async () => {
      const aud = new TransactionModel();
      const aud2 = new TransactionModel();

      const req = { user: user }

      when(mockedService.findAllForUser(strictEqual(user._id))).thenReturn(
        new Promise<Transaction[]>((resolve) => { resolve([aud, aud2]) }),
      );
      expect(controllerUnderTest).toBeDefined();
      const result = await controllerUnderTest.getTransactions(req)
      expect(result).toBeDefined();
      expect(result.length).toEqual(2)
      expect(result[0]).toEqual(aud);
      expect(result[1]).toEqual(aud2);
    });
  });

  describe('getTransaction', () => {
    it('should return transaction', async () => {
      const aud = new TransactionModel();

      const params = { id: 'someid' }

      when(mockedService.findById(strictEqual(params.id))).thenReturn(
        new Promise<Transaction>((resolve) => { resolve(aud) }),
      );
      const result = await controllerUnderTest.getTransaction(params)
      expect(result).toBeDefined();
      expect(result).toEqual(aud);
    });
  });

  describe('updateTransaction', () => {
    it('should update when all is valid', async () => {
      const params = { id: 'someid' }
      const aud = new TransactionModel();
      aud['_id'] = params.id;
      const req = {user: user}

      when(mockedService.save(strictEqual(params.id), strictEqual(aud), strictEqual(user._id))).thenReturn(
        new Promise<Transaction>((resolve) => { resolve(aud) }),
      );
      const result = await controllerUnderTest.updateTransaction(params, aud, req)
      expect(result).toBeDefined();
      expect(result).toEqual(aud);
    });
    it('should fail when an error is thrown', async () => {
      const params = { id: 'someid' }
      const aud = new TransactionModel();
      aud['_id'] = params.id;
      const error = new BadRequestException('Nonono');
      const req = {user: user}

      when(mockedService.save(strictEqual(params.id), strictEqual(aud), strictEqual(user._id))).thenThrow(error);

      try {
        await controllerUnderTest.updateTransaction(params, aud, req)
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });

    describe('createTransaction', () => {
      it('should save when all is valid', async () => {
        const aud = new TransactionModel();
        const req = {user: user}
  
        when(mockedService.save(strictEqual(null), strictEqual(aud), strictEqual(user._id))).thenReturn(
          new Promise<Transaction>((resolve) => { resolve(aud) }),
        );
        const result = await controllerUnderTest.createTransaction(aud, req)
        expect(result).toBeDefined();
        expect(result).toEqual(aud);
      });
      it('should fail when an error is thrown', async () => {
        const aud = new TransactionModel();
        const error = new BadRequestException('Nonono');
        const req = {user: user}
  
        when(mockedService.save(strictEqual(null), strictEqual(aud), strictEqual(user._id))).thenThrow(error);
  
        try {
          await controllerUnderTest.createTransaction(aud, req)
          fail();
        } catch (e) {
          expect(e).toEqual(error); 
        }
      });
    });
  });
});
