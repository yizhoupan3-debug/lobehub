import { type NavigateFunction } from 'react-router-dom';

export type StarterMode = 'agent' | 'group' | 'write' | 'video' | 'research' | 'image' | null;
export type SidebarMode = 'session' | 'workspace';

export const WORKSPACES_STORAGE_KEY = 'lobe-workspaces';

export interface WorkspaceFolder {
  /** Unique id (same as path) */
  id: string;
  /** Absolute path used for AI context injection */
  path: string;
  /** Display name (last path segment) */
  name: string;
  /** Parent directory for secondary label */
  parent?: string;
  createdAt: number;
}

export interface HomeInputState {
  homeInputLoading: boolean;
  inputActiveMode: StarterMode;
  navigate?: NavigateFunction;
  /** Active workspace directory for project-based mode */
  workspacePath: string | null;
  /** Sidebar mode: session history or workspace/thread view */
  sidebarMode: SidebarMode;
  /** Workspace folders added by user */
  workspaces: WorkspaceFolder[];
  /** Folder IDs whose thread lists are collapsed */
  collapsedWorkspaceIds: string[];
}

export const initialHomeInputState: HomeInputState = {
  homeInputLoading: false,
  inputActiveMode: null,
  navigate: undefined,
  workspacePath: null,
  sidebarMode: 'session',
  workspaces: [],
  collapsedWorkspaceIds: [],
};
