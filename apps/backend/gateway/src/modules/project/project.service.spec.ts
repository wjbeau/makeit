import {
  Project,
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
  verify,
  when,
} from 'ts-mockito';
import { ProjectModelDocument } from '../../schema/Project.schema';
import {
  MockableDocument,
  MockableDocumentQuery,
  MockableModel,
} from '../../test/mockables';
import { ProjectService } from './Project.service';
import { permissionsSpec } from '../../schema/permission.schema';
import * as moment from 'moment';
import { ProjectStatus } from '../../../../../../libs/types/src/project.model';

describe('ProjectService', () => {
  let classUnderTest: ProjectService;

  const mockModel = mock(MockableModel);
  const mockQuery = mock(MockableDocumentQuery);
  const mockDocument = mock(MockableDocument);

  beforeEach(async () => {
    classUnderTest = new ProjectService(
      instance(mockModel) as Model<ProjectModelDocument>
    );
  });

  afterEach(async () => {
    reset(mockModel);
    reset(mockQuery);
    reset(mockDocument);
  });

  describe('save', () => {
    it('should return valid Project when properly updated, no breakdown', async () => {
      const project: Project = ModelFactory.createEmptyProject();
      project._id = 'projectid';

      when(mockDocument.save()).thenReturn(instance(mockDocument));
      when(mockDocument.toObject()).thenReturn(project);

      when(mockModel.findOne(deepEqual({ _id: project._id }))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        project._id,
        project,
        'userid'
      );
      verify(mockDocument.set(anything())).once();
      verify(mockDocument.save()).once();
      verify(mockModel.findOne(deepEqual({ _id: project._id }))).once();
      expect(result).toEqual(project);
    });

    it('should return valid Project when properly inserted', async () => {
      const project: Project = ModelFactory.createEmptyProject();
      project._id = null;

      when(mockDocument.toObject()).thenReturn(project);

      when(mockModel.findOne(deepEqual({ _id: project._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      when(mockModel.create(deepEqual(project))).thenReturn(
        new Promise((resolve) => resolve(instance(mockDocument)))
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.save(
        project._id,
        project,
        'userid'
      );
      verify(mockDocument.set(anything())).never();
      verify(mockModel.create(deepEqual(project))).once();
      verify(mockModel.findOne(deepEqual({ _id: project._id }))).once();
      expect(result).toEqual(project);
    });

    it('should throw error when ids arent a match', async () => {
      const project: Project = ModelFactory.createEmptyProject();
      project._id = 'projectid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('differentid', project, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when insert attempted with id-holding project', async () => {
      const project: Project = ModelFactory.createEmptyProject();
      project._id = 'projectid';

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(null, project, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should throw error when update attempted with new project', async () => {
      const project: Project = ModelFactory.createEmptyProject();

      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save('some_id', project, 'userid');
        fail();
      } catch (e) {
        expect(e instanceof BadRequestException).toBeTruthy();
      }
    });

    it('should return throw error when database interaction fails', async () => {
      const project: Project = ModelFactory.createEmptyProject();
      project._id = 'projectid';

      when(mockDocument.toObject()).thenReturn(project);

      when(mockModel.findOne(deepEqual({ _id: project._id }))).thenReturn(
        new Promise((resolve) => resolve(null))
      );

      const err = new Error('mock error');
      when(mockModel.create(deepEqual(project))).thenThrow(err);
      expect(classUnderTest).toBeDefined();
      try {
        await classUnderTest.save(project._id, project, 'userid');
        fail();
      } catch (e) {
        expect(e).toEqual(err);
      }
    });
  });

  describe('findById', () => {
    it('should return valid Project when found', async () => {
      const project: Project = ModelFactory.createEmptyProject();
      project._id = 'projectid';

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(project);
        })
      );
      when(mockModel.findOne(deepEqual({ _id: project._id }))).thenReturn(
        instance(mockQuery)
      );

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findById(project._id);
      expect(result).toEqual(project);
    });
    it('should return null Project when not found', async () => {
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
    it('should return valid Projects when found', async () => {
      const id = 'someid';
      const project1: Project = ModelFactory.createEmptyProject();
      project1._id = 'projectid1';
      const project2: Project = ModelFactory.createEmptyProject();
      project2._id = 'projectid2';
      const projects: Project[] = [project1, project2];

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.populate(anything())).thenReturn(instance(mockQuery));
      when(
        mockQuery.sort(deepEqual({ deadline: -1, projectTime: -1 }))
      ).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(projects);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            $and: [
              {},
              {
                $or: [
                  {'status': ProjectStatus.Active},
                  {'status': ProjectStatus.Completed},
                  {'status': ProjectStatus.Cancelled},
                ]
              },
              permissionsSpec(id, null, [PermissionRole.Admin, PermissionRole.Editor, PermissionRole.Viewer])
            ]
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id);
      expect(result).toEqual(projects);
      verify(mockQuery.exec()).once();
    });
    it('should return null Project when not found', async () => {
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
                $or: [
                  {'status': ProjectStatus.Active},
                  {'status': ProjectStatus.Completed},
                  {'status': ProjectStatus.Cancelled},
                ]
              },
              permissionsSpec(id, null, [PermissionRole.Admin, PermissionRole.Editor, PermissionRole.Viewer])
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
                $or: [
                  {'status': ProjectStatus.Active},
                  {'status': ProjectStatus.Completed},
                  {'status': ProjectStatus.Cancelled},
                ]
              },
              permissionsSpec(id, null, [PermissionRole.Admin, PermissionRole.Editor, PermissionRole.Viewer])
            ]
          })
        )
      ).once();
    });

    it('should return valid Projects when called with date range', async () => {
      const id = 'someid';
      const project1: Project = ModelFactory.createEmptyProject();
      project1._id = 'projectid1';
      const project2: Project = ModelFactory.createEmptyProject();
      project2._id = 'projectid2';
      const projects: Project[] = [project1, project2];
      const fromDate = moment("2020-12-12", "YYYY-MM-DD").toDate();
      const toDate = moment("2021-01-12", "YYYY-MM-DD").toDate();

      when(mockQuery.lean()).thenReturn(instance(mockQuery));
      when(mockQuery.exec()).thenReturn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Promise<any>((resolve) => {
          resolve(projects);
        })
      );
      when(
        mockModel.find(
          deepEqual({
            $and: [
              {
                $and: [
                  { 'events.time': { $gte: fromDate }},
                  { 'events.time': { $lte: toDate }}
                ]
              },
              {
                $or: [
                  {'status': ProjectStatus.Active},
                  {'status': ProjectStatus.Completed},
                  {'status': ProjectStatus.Cancelled},
                ]
              },
              permissionsSpec(id, null, [PermissionRole.Admin, PermissionRole.Editor, PermissionRole.Viewer])
            ]
          })
        )
      ).thenReturn(instance(mockQuery));

      expect(classUnderTest).toBeDefined();
      const result = await classUnderTest.findAllForUser(id, fromDate, toDate);
      expect(result).toEqual(projects);

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
});
