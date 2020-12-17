import { Project } from '@makeit/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../app/api-client';
import { RootState } from '../../app/store';
import { ProjectsState } from './project.state';

const initialState: ProjectsState = {
  projects: [],
  loading: false
};

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (userId: string, thunkAPI) => {
  const result = await apiClient().get('/projects');
  thunkAPI.dispatch(receiveProjects(result.data))
})

export const fetchProject = createAsyncThunk('projects/fetchProject', async (ProjectId: string, thunkAPI) => {
  const result = await apiClient().get('/projects/' + ProjectId);
  thunkAPI.dispatch(receiveProject(result.data))
})

export const saveProject = createAsyncThunk('projects/saveProject', async (Project: Project, thunkAPI) => {
  if(Project._id) {
    const result = await apiClient().put('/projects/' + Project._id, Project);
    thunkAPI.dispatch(projectSaved(result.data))
    return result.data;
  }
  else {
    const result = await apiClient().post('/projects', Project);
    thunkAPI.dispatch(projectSaved(result.data))
    return result.data;
  }
})

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    receiveProjects: (state, action) => {
      state.loading = false;
      state.projects = action.payload
    },
    receiveProject: (state, action) => {
      state.loading = false;
      const idx = state.projects.findIndex(a => a._id === action.payload._id)
      if(idx < 0) {
        state.projects.push(action.payload)
      }
      else {
        state.projects.splice(idx, 1, action.payload)
      }
    },
    projectSaved: (state, action) => {
      state.loading = false;
      const idx = state.projects.findIndex(a => a._id === action.payload._id)
      if(idx < 0) {
        state.projects.push(action.payload)
      }
      else {
        state.projects.splice(idx, 1, action.payload)
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.projects = [];
        state.loading = false;
      })
      .addCase(fetchProject.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(saveProject.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(saveProject.rejected, (state, action) => {
        state.loading = false;
      })
  }
});

export const { receiveProject, receiveProjects, projectSaved } = projectsSlice.actions;

export const selectProjects = (state: RootState) => state.projects.projects;
export const selectProjectsLoading = (state: RootState) => state.projects.loading;

export default projectsSlice.reducer;
