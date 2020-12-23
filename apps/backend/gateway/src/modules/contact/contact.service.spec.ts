import {
  Contact,
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
import { ContactDocument } from '../../schema/contact.schema';
import {
  MockableDocument,
  MockableDocumentQuery,
  MockableModel,
} from '../../test/mockables';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let classUnderTest: ContactService;

  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockDocument = mock(MockableDocument);
  const mockRequest = {
    user: {
      _id: 'someID'
    }
  }

  beforeEach(async () => {
    classUnderTest = new ContactService(
      mockRequest,
      instance(mockModel) as Model<ContactDocument>
    );
  });

  afterEach(async () => {
    reset(mockModel);
    reset(mockQuery);
    reset(mockDocument);
  });

  describe('save', () => {
    it('should return valid Contact when properly updated, no breakdown', async () => {
      const contact: Contact = ModelFactory.createEmptyContact();
      contact._id = 'contactid';

      when(mockDocument.save()).thenReturn(instance(mockDocument));
      when(mockDocument.toObject()).thenReturn(contact);

      when(mockModel.findOne(deepEqual({ _id: contact._id }))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        contact._id,
        contact
      );
      verify(mockDocument.save()).once();
      verify(mockModel.findOne(deepEqual({ _id: contact._id }))).once();
      expect(result).toEqual(contact);
    });

    it('should return valid Contact when properly inserted', async () => {
      const contact: Contact = ModelFactory.createEmptyContact();
      contact._id = null;

      when(mockDocument.toObject()).thenReturn(contact);

      when(mockModel.findOne(deepEqual({ _id: contact._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      when(mockModel.create(deepEqual(contact))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        contact._id,
        contact
      );
      verify(mockDocument.set(anything())).never();
      verify(mockModel.create(deepEqual(contact))).once();
      verify(mockModel.findOne(deepEqual({ _id: contact._id }))).once();
      expect(result).toEqual(contact);
    });

    it('should throw error when ids arent a match', async () => {
      const contact: Contact = ModelFactory.createEmptyContact();
      contact._id = 'contactid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', contact);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding contact', async () => {
      const contact: Contact = ModelFactory.createEmptyContact();
      contact._id = 'contactid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, contact);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new contact', async () => {
      const contact: Contact = ModelFactory.createEmptyContact();

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('some_id', contact);
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should return throw error when database interaction fails', async () => {
      const contact: Contact = ModelFactory.createEmptyContact();
      contact._id = 'contactid';

      when(mockDocument.toObject()).thenReturn(contact);

      when(mockModel.findOne(deepEqual({ _id: contact._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      const err = new Error('mock error');
      when(mockModel.create(deepEqual(contact))).thenThrow(err);
      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(contact._id, contact);
        fail();
      } catch (e) {
        expect(e).toEqual(err);
      }
    });
  });

  describe('findById', () => {
    it('should return valid Contact when found', async () => {
      const contact: Contact = ModelFactory.createEmptyContact();
      contact._id = 'contactid';

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(contact);
        })
      );
      when(mockModel.findOne(deepEqual({ _id: contact._id, owner: mockRequest.user['_id'] }))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(contact._id);
      expect(result).toEqual(contact);
    });
    it('should return null Contact when not found', async () => {
      const id = 'someid';
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(null);
        })
      );
      when(mockModel.findOne(deepEqual({ _id: id, owner: mockRequest.user['_id'] }))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(id);
      expect(result).toBeNull();
    });

    it('should throw error when db error occurs', async () => {
      const id = 'some_id';
      const err = new Error('database problem!');
      when(mockModel.findOne(deepEqual({ _id: id, owner: mockRequest.user['_id'] }))).thenThrow(err);

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
    it('should return valid Contacts when found', async () => {
      const contact1: Contact = ModelFactory.createEmptyContact();
      contact1._id = 'contactid1';
      const contact2: Contact = ModelFactory.createEmptyContact();
      contact2._id = 'contactid2';
      const contacts: Contact[] = [contact1, contact2];

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(
        mockQuery.sort(deepEqual({ lastName: 1, firstName: 1 }))
      ).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(contacts);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            'owner': mockRequest.user._id,
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser();
      expect(result).toEqual(contacts);
      verify(mockQuery.exec()).once();
    });
    it('should return null Contact when not found', async () => {
      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(
        mockQuery.sort(deepEqual({ lastName: 1, firstName: 1 }))
      ).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(null);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            'owner': mockRequest.user._id,
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser();
      expect(result).toBeNull();
      verify(
        mockModel.find(
          deepEqual({
            'owner': mockRequest.user['_id'],
          })
        )
      ).once();
    });

    it('should throw error when db error occurs', async () => {
      const err = new Error('database problem!');
      when(mockModel.find(anything())).thenThrow(err);

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.findAllForUser();
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
