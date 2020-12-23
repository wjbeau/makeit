import {
  Event,
  ModelFactory,
  PermissionRole,
} from '@makeit/types';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  anything,
  deepEqual,
  instance,
  mock,
  reset,
  strictEqual,
  verify,
  when,
} from 'ts-mockito';
import { EventDocument } from '../../schema/event.schema';
import {
  MockableDocument,
  MockableDocumentQuery,
  MockableModel,
} from '../../test/mockables';
import { AuditionService } from '../audition/audition.service';
import { ProjectService } from '../project/project.service';
import { EventService } from './event.service';
import { permissionsSpec } from '../../schema/permission.schema';
import * as moment from 'moment';

describe('EventService', () => {
  let classUnderTest: EventService;

  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockDocument = mock(MockableDocument);
  const mockAuditionService = mock(AuditionService);
  const mockProjectService = mock(ProjectService);

  beforeEach(async () => {
    classUnderTest = new EventService(
      instance(mockAuditionService),
      instance(mockProjectService),
      instance(mockModel) as Model<EventDocument>
    );
  });

  afterEach(async () => {
    reset(mockModel);
    reset(mockQuery);
    reset(mockDocument);
    reset(mockAuditionService);
    reset(mockProjectService);
  });

  describe('save', () => {
    it('should return valid Event when properly updated, no breakdown', async () => {
      const event: Event = ModelFactory.createEmptyEvent();
      event._id = 'eventid';

      when(mockDocument.save()).thenReturn(instance(mockDocument));
      when(mockDocument.toObject()).thenReturn(event);

      when(mockModel.findOne(deepEqual({ _id: event._id }))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        event._id,
        event,
        'userid'
      );
      verify(mockDocument.set(anything())).once();
      verify(mockDocument.save()).once();
      verify(mockModel.findOne(deepEqual({ _id: event._id }))).once();
      expect(result).toEqual(event);
    });

    it('should return valid Event when properly inserted', async () => {
      const event: Event = ModelFactory.createEmptyEvent();
      event._id = null;

      when(mockDocument.toObject()).thenReturn(event);
      when(mockDocument.execPopulate()).thenResolve(instance(mockDocument));

      when(mockModel.findOne(deepEqual({ _id: event._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      when(mockModel.create(deepEqual(event))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        event._id,
        event,
        'userid'
      );
      verify(mockDocument.set(anything())).never();
      verify(mockModel.create(deepEqual(event))).once();
      verify(mockModel.findOne(deepEqual({ _id: event._id }))).once();
      expect(result).toEqual(event);
    });

    it('should throw error when ids arent a match', async () => {
      const event: Event = ModelFactory.createEmptyEvent();
      event._id = 'eventid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', event, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding event', async () => {
      const event: Event = ModelFactory.createEmptyEvent();
      event._id = 'eventid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, event, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new event', async () => {
      const event: Event = ModelFactory.createEmptyEvent();

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('some_id', event, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should return throw error when database interaction fails', async () => {
      const event: Event = ModelFactory.createEmptyEvent();
      event._id = 'eventid';

      when(mockDocument.toObject()).thenReturn(event);

      when(mockModel.findOne(deepEqual({ _id: event._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      const err = new Error('mock error');
      when(mockModel.create(deepEqual(event))).thenThrow(err);
      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(event._id, event, 'userid');
        fail();
      } catch (e) {
        expect(e).toEqual(err);
      }
    });
  });

  describe('findById', () => {
    it('should return valid Event when found', async () => {
      const event: Event = ModelFactory.createEmptyEvent();
      event._id = 'eventid';

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(event);
        })
      );
      when(mockModel.findOne(deepEqual({ _id: event._id }))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(event._id);
      expect(result).toEqual(event);
    });
    it('should return null Event when not found', async () => {
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
    it('should return valid Events when found', async () => {
      const id = 'someid';
      const event1: Event = ModelFactory.createEmptyEvent();
      event1._id = 'eventid1';
      const event2: Event = ModelFactory.createEmptyEvent();
      event2._id = 'eventid2';
      const events: Event[] = [event1, event2];
      const fromDate = moment("2020-12-12", "YYYY-MM-DD").toDate();
      const toDate = moment("2021-01-12", "YYYY-MM-DD").toDate();

      const time = moment(fromDate).add(1, "days").toDate()
      const p1 = ModelFactory.createEmptyProject()
      p1._id = 'proj1'
      p1.events.push(ModelFactory.createEmptyProjectEvent(time))
      const p2 = ModelFactory.createEmptyProject()
      p2._id = 'proj2'
      p2.events.push(ModelFactory.createEmptyProjectEvent(time))
      const projects = [p1, p2];
      projects.forEach((p, index) => p._id = 'proj' + index)
      
      const auditions = [ModelFactory.createEmptyAudition(), ModelFactory.createEmptyAudition()];
      auditions.forEach((a, index) => a._id = 'aud' + index)

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(events);
        })
      );
      when(mockProjectService.findAllForUser(strictEqual(id), deepEqual(fromDate), deepEqual(toDate)))
        .thenResolve(projects)
      when(mockAuditionService.findAllForUser(strictEqual(id), deepEqual(fromDate), deepEqual(toDate)))
        .thenResolve(auditions)
      when(
        mockModel.find(
          deepEqual({
            $and: [
              { start: { $gte: fromDate } },
              { start: { $lte: toDate } },
              permissionsSpec(id, null, [PermissionRole.Admin, PermissionRole.Editor, PermissionRole.Viewer])
            ]
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id, fromDate, toDate);

      expect(result.length).toEqual(6);
      expect(result.find(r => r._id === event1._id)).toBeDefined();
      expect(result.find(r => r._id === event2._id)).toBeDefined();
      expect(result.find(r => r.sourceId === projects[0]._id)).toBeDefined();
      expect(result.find(r => r.sourceId === projects[1]._id)).toBeDefined();
      expect(result.find(r => r.sourceId === auditions[0]._id)).toBeDefined();
      expect(result.find(r => r.sourceId === auditions[1]._id)).toBeDefined();

      verify(mockQuery.exec()).once();
    });
    it('should return [] when not found', async () => {
      const id = 'someid';
      const fromDate = new Date();
      const toDate = new Date();

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve([]);
        })
      );
      when(mockProjectService.findAllForUser(strictEqual(id), deepEqual(fromDate), deepEqual(toDate)))
        .thenResolve([])
      when(mockAuditionService.findAllForUser(strictEqual(id), deepEqual(fromDate), deepEqual(toDate)))
        .thenResolve([])
      when(
        mockModel.find(
          deepEqual({
            $and: [
              { start: { $gte: fromDate } },
              { start: { $lte: toDate } },
              permissionsSpec(id, null, [PermissionRole.Admin, PermissionRole.Editor, PermissionRole.Viewer])
            ]
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id, fromDate, toDate);
      expect(result.length).toEqual(0);
    });

    it('should throw error when db error occurs', async () => {
      const id = 'some_id';
      const err = new Error('database problem!');
      const fromDate = new Date();
      const toDate = new Date();
      when(mockProjectService.findAllForUser(strictEqual(id), deepEqual(fromDate), deepEqual(toDate)))
        .thenResolve([])
      when(mockAuditionService.findAllForUser(strictEqual(id), deepEqual(fromDate), deepEqual(toDate)))
        .thenResolve([])
      when(mockModel.find(anything())).thenThrow(err);

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.findAllForUser(id, fromDate, toDate);
        fail();
      } catch (e) {
        expect(e).toBe(err);
      }
    });
  });
});
