import { Contact } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { instance, mock, reset, strictEqual, when } from 'ts-mockito';
import { ContactModel } from '../../schema/contact.schema';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

describe('ContactController', () => {
  let controllerUnderTest: ContactController;

  const mockedService = mock(ContactService);

  beforeEach(async () => {
    const mockedServiceInstance = instance(mockedService);

    controllerUnderTest = new ContactController(mockedServiceInstance)
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('getContacts', () => {
    it('should return contacts', async () => {
      const con = new ContactModel();
      const con2 = new ContactModel();

      when(mockedService.findAllForUser()).thenReturn(
        new Promise<Contact[]>((resolve) => { resolve([con, con2]) }),
      );
      expect(controllerUnderTest).toBeDefined();
      const result = await controllerUnderTest.getContacts()
      expect(result).toBeDefined();
      expect(result.length).toEqual(2)
      expect(result[0]).toEqual(con);
      expect(result[1]).toEqual(con2);
    });
  });

  describe('updateContact', () => {
    it('should update when all is valid', async () => {
      const params = { id: 'someid' }
      const con = new ContactModel();
      con['_id'] = params.id;

      when(mockedService.save(strictEqual(params.id), strictEqual(con))).thenReturn(
        new Promise<Contact>((resolve) => { resolve(con) }),
      );
      const result = await controllerUnderTest.updateContact(params, con)
      expect(result).toBeDefined();
      expect(result).toEqual(con);
    });
    it('should fail when an error is thrown', async () => {
      const params = { id: 'someid' }
      const con = new ContactModel();
      con['_id'] = params.id;
      const error = new BadRequestException('Nonono');

      when(mockedService.save(strictEqual(params.id), strictEqual(con))).thenThrow(error);

      try {
        await controllerUnderTest.updateContact(params, con)
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });
  });

  describe('createContact', () => {
    it('should save when all is valid', async () => {
      const con = new ContactModel();

      when(mockedService.save(strictEqual(null), strictEqual(con))).thenReturn(
        new Promise<Contact>((resolve) => { resolve(con) }),
      );
      const result = await controllerUnderTest.createContact(con)
      expect(result).toBeDefined();
      expect(result).toEqual(con);
    });
    it('should fail when an error is thrown', async () => {
      const con = new ContactModel();
      const error = new BadRequestException('Nonono');

      when(mockedService.save(strictEqual(null), strictEqual(con))).thenThrow(error);

      try {
        await controllerUnderTest.createContact(con)
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });
  });

  describe('deleteContact', () => {
    it('should save when all is valid', async () => {
      const con = 'id';

      when(mockedService.delete(strictEqual(con))).thenReturn(
        new Promise<boolean>((resolve) => { resolve(true) }),
      );
      const result = await controllerUnderTest.deleteContact({id: con})
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
    });
    it('should fail when an error is thrown', async () => {
      const con = new ContactModel();
      const error = new BadRequestException('Nonono');

      when(mockedService.delete(strictEqual(con))).thenThrow(error);

      try {
        await controllerUnderTest.deleteContact({id: con})
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });
  });
});
