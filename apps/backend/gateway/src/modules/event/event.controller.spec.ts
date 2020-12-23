import { Event } from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { instance, mock, reset, strictEqual, when, deepEqual } from 'ts-mockito';
import { EventModel } from '../../schema/event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import * as moment from 'moment';

describe('EventController', () => {
  let controllerUnderTest: EventController;

  const mockedService = mock(EventService);
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

    controllerUnderTest = new EventController(mockedServiceInstance)
  });

  afterEach(() => {
    reset(mockedService);
  });

  describe('getEvents', () => {
    it('should return events', async () => {
      const ev = new EventModel();
      const ev2 = new EventModel();

      const req = { 
        user: user,
        query: {
          from: "2020-12-12",
          to: "2020-01-13"
        }
      }

      const start = moment(req.query.from, "YYYY-MM-DD").seconds(0).minutes(0).hours(0).milliseconds(0).toDate()
      const end = moment(req.query.to, "YYYY-MM-DD").seconds(59).minutes(59).hours(23).milliseconds(999).toDate()

      when(mockedService.findAllForUser(strictEqual(user._id), deepEqual(start), deepEqual(end))).thenReturn(
        new Promise<Event[]>((resolve) => { resolve([ev, ev2]) }),
      );
      expect(controllerUnderTest).toBeDefined();
      const result = await controllerUnderTest.getEvents(req)
      expect(result).toBeDefined();
      expect(result.length).toEqual(2)
      expect(result[0]).toEqual(ev);
      expect(result[1]).toEqual(ev2);
    });

    it('should fail with invalid to date', async () => {
      const req = { 
        user: user,
        query: {
          from: "2020-12-12",
          to: "bargledoink"
        }
      }

      try {
        await controllerUnderTest.getEvents(req)
        fail();
      } catch (e) {
        expect(e.message).toEqual("Invalid date range specified"); 
        expect(e.status).toEqual(400); 
      }
    });

    it('should fail with invalid from date', async () => {
      const req = { 
        user: user,
        query: {
          from: "bargledoink",
          to: "2020-12-12"
        }
      }

      try {
        await controllerUnderTest.getEvents(req)
        fail();
      } catch (e) {
        expect(e.message).toEqual("Invalid date range specified"); 
        expect(e.status).toEqual(400); 
      }
    });
  });

  describe('getEvent', () => {
    it('should return event', async () => {
      const ev = new EventModel();

      const params = { id: 'someid' }

      when(mockedService.findById(strictEqual(params.id))).thenReturn(
        new Promise<Event>((resolve) => { resolve(ev) }),
      );
      const result = await controllerUnderTest.getEvent(params)
      expect(result).toBeDefined();
      expect(result).toEqual(ev);
    });
  });

  describe('updateEvent', () => {
    it('should update when all is valid', async () => {
      const params = { id: 'someid' }
      const ev = new EventModel();
      ev['_id'] = params.id;
      const req = {user: user}

      when(mockedService.save(strictEqual(params.id), strictEqual(ev), strictEqual(user._id))).thenReturn(
        new Promise<Event>((resolve) => { resolve(ev) }),
      );
      const result = await controllerUnderTest.updateEvent(params, ev, req)
      expect(result).toBeDefined();
      expect(result).toEqual(ev);
    });
    it('should fail when an error is thrown', async () => {
      const params = { id: 'someid' }
      const ev = new EventModel();
      ev['_id'] = params.id;
      const error = new BadRequestException('Nonono');
      const req = {user: user}

      when(mockedService.save(strictEqual(params.id), strictEqual(ev), strictEqual(user._id))).thenThrow(error);

      try {
        await controllerUnderTest.updateEvent(params, ev, req)
        fail();
      } catch (e) {
        expect(e).toEqual(error); 
      }
    });

    describe('createEvent', () => {
      it('should save when all is valid', async () => {
        const ev = new EventModel();
        const req = {user: user}
  
        when(mockedService.save(strictEqual(null), strictEqual(ev), strictEqual(user._id))).thenReturn(
          new Promise<Event>((resolve) => { resolve(ev) }),
        );
        const result = await controllerUnderTest.createEvent(ev, req)
        expect(result).toBeDefined();
        expect(result).toEqual(ev);
      });
      it('should fail when an error is thrown', async () => {
        const ev = new EventModel();
        const error = new BadRequestException('Nonono');
        const req = {user: user}
  
        when(mockedService.save(strictEqual(null), strictEqual(ev), strictEqual(user._id))).thenThrow(error);
  
        try {
          await controllerUnderTest.createEvent(ev, req)
          fail();
        } catch (e) {
          expect(e).toEqual(error); 
        }
      });
    });
  });
});
