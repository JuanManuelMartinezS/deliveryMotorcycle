import { create } from 'zustand';
import { CreateIssueDto, Issue, UpdateIssueDto } from '../models/IssueModel';
import {
    createIssue,
    deleteIssue,
    getIssueById,
    getIssues,
    updateIssue,
} from '../services/issueService';

interface IssueStore {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  currentIssue: Issue | null;

  fetchIssues: (motorcycleId?: number) => Promise<void>;
  fetchIssueById: (id: number) => Promise<void>;
  addIssue: (issueData: CreateIssueDto) => Promise<Issue>;
  editIssue: (id: number, issueData: UpdateIssueDto) => Promise<void>;
  removeIssue: (id: number) => Promise<void>;
  setCurrentIssue: (issue: Issue | null) => void;
}

export const useIssueStore = create<IssueStore>((set) => ({
  issues: [],
  loading: false,
  error: null,
  currentIssue: null,

  fetchIssues: async (motorcycleId) => {
    set({ loading: true, error: null });
    try {
      const data = await getIssues(motorcycleId);
      set({ issues: data, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar problemas'
      });
    }
  },

  fetchIssueById: async (id) => {
    set({ loading: true, error: null });
    try {
      const issue = await getIssueById(id);
      set({ currentIssue: issue, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar el problema'
      });
    }
  },

  setCurrentIssue: (issue) => set({ currentIssue: issue }),

  addIssue: async (issueData) => {
    set({ loading: true, error: null });
    try {
      const newIssue = await createIssue(issueData);
      set(state => ({
        issues: [...state.issues, newIssue],
        loading: false
      }));
      return newIssue;
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear problema'
      });
      throw error;
    }
  },

  editIssue: async (id, issueData) => {
    set({ loading: true, error: null });
    try {
      const updatedIssue = await updateIssue(id, issueData);
      set(state => ({
        issues: state.issues.map(issue => 
          issue.id === id ? updatedIssue : issue
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar problema'
      });
      throw error;
    }
  },

  removeIssue: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteIssue(id);
      set(state => ({
        issues: state.issues.filter(issue => issue.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Error al eliminar problema'
      });
      throw error;
    }
  }
}));