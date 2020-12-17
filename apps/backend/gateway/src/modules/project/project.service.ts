import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectStatus } from '../../../../../../libs/types/src/project.model';
import { ensureAdminPermission, permissionsSpec } from '../../schema/permission.schema';
import {
  ProjectModel,
  ProjectModelDocument
} from '../../schema/project.schema';
import { PermissionRole, PermissionType } from '@makeit/types';
import { Permission } from '../../../../../../libs/types/src/permission.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectModel.name)
    private projectModel: Model<ProjectModelDocument>
  ) {}

  async save(id: string, project: Project, userid): Promise<Project | undefined> {
    //the path variable must match the data posted
    if ((id || project._id) && id !== project._id) {
      throw new BadRequestException();
    }

    if(!id) {
      ensureAdminPermission(project, userid);
      project.calls.forEach(c => ensureAdminPermission(c, userid));
    }

    // Find the document and update it if required or save a new one if not.
    const result = await this.projectModel
      .findOne({ _id: project._id })
      .then((dbRes) => {
        if (dbRes) {
          dbRes.set(project);
          return dbRes.save();
        } else {
          return this.projectModel.create(project);
        }
      })
      .catch((error) => {
        throw new BadRequestException(error, 'Database update failed.');
      });

    return result.toObject();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any): Promise<Project | undefined> {
    return await this.projectModel.findOne({ _id: id }).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAllForUser(id: any): Promise<Project[] | undefined> {
    //find all Projects where the given user is a relevant participant
    const result: Project[] = await this.projectModel
      .find({
        $and: [
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
      .lean()
      .exec();
    return result;
  }
}
