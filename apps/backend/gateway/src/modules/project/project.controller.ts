import { Project } from '@makeit/types';
import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProjects(@Request() req) {
    return this.projectService.findAllForUser(req.user._id)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProject(@Param() params) {
    return this.projectService.findById(params.id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProject(@Param() params, @Body() body:Project, @Request() req) {
    return this.projectService.save(params.id, body, req.user._id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(@Body() body:Project, @Request() req) {
    return this.projectService.save(null, body, req.user._id)
  }
}
