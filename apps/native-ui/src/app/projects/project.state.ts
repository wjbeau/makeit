// State objects for the auditions feature

import { Project } from '@makeit/types';

export interface ProjectsState {
    projects: Project[];
    loading: boolean;
}
