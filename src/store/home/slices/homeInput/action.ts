import { type NavigateFunction } from 'react-router-dom';

import { chatGroupService } from '@/services/chatGroup';
import { documentService } from '@/services/document';
import { getAgentStoreState } from '@/store/agent';
import { agentSelectors, builtinAgentSelectors } from '@/store/agent/selectors';
import { getChatGroupStoreState } from '@/store/agentGroup';
import { useChatStore } from '@/store/chat';
import { type HomeStore } from '@/store/home/store';
import { type StoreSetter } from '@/store/types';
import { setNamespace } from '@/utils/storeDebug';

import {
  WORKSPACES_STORAGE_KEY,
  type SidebarMode,
  type StarterMode,
  type WorkspaceFolder,
} from './initialState';

const n = setNamespace('homeInput');

type Setter = StoreSetter<HomeStore>;
export const createHomeInputSlice = (set: Setter, get: () => HomeStore, _api?: unknown) =>
  new HomeInputActionImpl(set, get, _api);

export class HomeInputActionImpl {
  readonly #get: () => HomeStore;
  readonly #set: Setter;

  constructor(set: Setter, get: () => HomeStore, _api?: unknown) {
    void _api;
    this.#set = set;
    this.#get = get;
  }

  // ─── Input Mode ──────────────────────────────────────────────────── //

  clearInputMode = (): void => {
    this.#set({ inputActiveMode: null }, false, n('clearInputMode'));
  };

  setInputActiveMode = (mode: StarterMode): void => {
    this.#set({ inputActiveMode: mode }, false, n('setInputActiveMode', mode));
  };

  setNavigate = (navigate: NavigateFunction): void => {
    this.#set({ navigate }, false, n('setNavigate'));
  };

  // ─── Sidebar Mode ────────────────────────────────────────────────── //

  /** Switch sidebar between 'session' history and 'workspace' (Cursor-like) view. */
  setSidebarMode = (mode: SidebarMode): void => {
    this.#set({ sidebarMode: mode }, false, n('setSidebarMode', mode));
  };

  // ─── Workspace Path (for AI context injection) ───────────────────── //

  /** Set the active workspace directory for project-based AI context. */
  setWorkspacePath = (path: string | null): void => {
    this.#set({ workspacePath: path }, false, n('setWorkspacePath', path));
  };

  /** Clear workspace — revert to session-based mode. */
  clearWorkspacePath = (): void => {
    this.#set({ workspacePath: null }, false, n('clearWorkspacePath'));
  };

  // ─── Workspace Folder CRUD ───────────────────────────────────────── //

  /** Add a new workspace folder. Switches sidebar to workspace mode automatically. */
  addWorkspace = (folder: Omit<WorkspaceFolder, 'createdAt'>): void => {
    const existing = this.#get().workspaces;
    if (existing.some((w) => w.id === folder.id)) return; // avoid duplicates

    const newWorkspace: WorkspaceFolder = { ...folder, createdAt: Date.now() };
    const updated = [...existing, newWorkspace];
    this.#set(
      { sidebarMode: 'workspace', workspacePath: folder.path, workspaces: updated },
      false,
      n('addWorkspace', folder.path),
    );
    this.#persistWorkspaces(updated);
  };

  /** Remove a workspace folder. Does NOT delete sessions inside it. */
  removeWorkspace = (id: string): void => {
    const updated = this.#get().workspaces.filter((w) => w.id !== id);
    this.#set({ workspaces: updated }, false, n('removeWorkspace', id));
    this.#persistWorkspaces(updated);
    // If the removed workspace was the active one, clear the path
    if (this.#get().workspacePath === id) {
      this.#set({ workspacePath: updated[0]?.path ?? null }, false, n('removeWorkspace/clearPath'));
    }
  };

  /** Load workspaces from localStorage — call once on mount. */
  loadWorkspaces = (): void => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
      const workspaces: WorkspaceFolder[] = raw ? JSON.parse(raw) : [];
      this.#set({ workspaces }, false, n('loadWorkspaces'));
    } catch {
      // ignore parse errors
    }
  };

  /** Toggle collapsed state for a workspace folder's thread list. */
  toggleWorkspaceCollapsed = (id: string): void => {
    const prev = this.#get().collapsedWorkspaceIds;
    const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
    this.#set({ collapsedWorkspaceIds: updated }, false, n('toggleWorkspaceCollapsed', id));
  };

  // ─── Send Actions ────────────────────────────────────────────────── //

  sendAsAgent = async (message: string): Promise<string> => {
    this.#set({ homeInputLoading: true }, false, n('sendAsAgent/start'));

    try {
      const agentState = getAgentStoreState();

      // 1. Get model/provider config from inbox agent
      const inboxAgentId = builtinAgentSelectors.inboxAgentId(agentState);
      const inboxConfig = inboxAgentId
        ? agentSelectors.getAgentConfigById(inboxAgentId)(agentState)
        : null;
      const model = inboxConfig?.model;
      const provider = inboxConfig?.provider;

      // 2. Create new Agent — inject workspace CWD into system role when set
      const workspacePath = this.#get().workspacePath;
      const workspacePrefix = workspacePath
        ? `[Workspace] cwd: ${workspacePath}\n\n`
        : '';

      const result = await agentState.createAgent({
        config: {
          model,
          provider,
          systemRole: workspacePrefix + message,
          title: message?.slice(0, 50) || 'New Agent',
        },
      });

      // 3. Navigate to Agent profile page
      const { navigate } = this.#get();
      if (navigate) {
        navigate(`/agent/${result.agentId}/profile`);
      }

      // 4. Refresh agent list
      this.#get().refreshAgentList();

      // 5. Update agentBuilder's model config and send initial message
      if (result.agentId) {
        const { sendMessage } = useChatStore.getState();
        const agentBuilderId = builtinAgentSelectors.agentBuilderId(agentState);

        if (agentBuilderId && model && provider) {
          await agentState.updateAgentConfigById(agentBuilderId, { model, provider });
        }

        await sendMessage({
          context: { agentId: agentBuilderId!, scope: 'agent_builder' },
          message,
        });
      }

      // 6. Clear mode
      this.#set({ inputActiveMode: null }, false, n('sendAsAgent/clearMode'));
      return result.agentId!;
    } finally {
      this.#set({ homeInputLoading: false }, false, n('sendAsAgent/end'));
    }
  };

  sendAsGroup = async (message: string): Promise<string> => {
    this.#set({ homeInputLoading: true }, false, n('sendAsGroup/start'));

    try {
      const agentState = getAgentStoreState();

      const inboxAgentId = builtinAgentSelectors.inboxAgentId(agentState);
      const inboxConfig = inboxAgentId
        ? agentSelectors.getAgentConfigById(inboxAgentId)(agentState)
        : null;
      const model = inboxConfig?.model;
      const provider = inboxConfig?.provider;

      const workspacePath = this.#get().workspacePath;
      const workspacePrefix = workspacePath
        ? `[Workspace] cwd: ${workspacePath}\n\n`
        : '';

      const { group } = await chatGroupService.createGroup({
        config: {
          systemPrompt: workspacePrefix + message,
        },
        title: message?.slice(0, 50) || 'New Group',
      });

      const groupStore = getChatGroupStoreState();
      await groupStore.loadGroups();
      this.#get().refreshAgentList();

      const { navigate } = this.#get();
      if (navigate) {
        navigate(`/group/${group.id}/profile`);
      }

      const groupAgentBuilderId = builtinAgentSelectors.groupAgentBuilderId(agentState);

      if (groupAgentBuilderId) {
        if (model && provider) {
          await agentState.updateAgentConfigById(groupAgentBuilderId, { model, provider });
        }

        const { sendMessage } = useChatStore.getState();
        await sendMessage({
          context: { agentId: groupAgentBuilderId, scope: 'group_agent_builder' },
          message,
        });
      }

      this.#set({ inputActiveMode: null }, false, n('sendAsGroup/clearMode'));
      return group.id;
    } finally {
      this.#set({ homeInputLoading: false }, false, n('sendAsGroup/end'));
    }
  };

  sendAsResearch = async (message: string): Promise<void> => {
    console.info('sendAsResearch:', message);
    this.#set({ inputActiveMode: null }, false, n('sendAsResearch'));
  };

  sendAsWrite = async (message: string): Promise<string> => {
    this.#set({ homeInputLoading: true }, false, n('sendAsWrite/start'));

    try {
      const agentState = getAgentStoreState();

      const inboxAgentId = builtinAgentSelectors.inboxAgentId(agentState);
      const inboxConfig = inboxAgentId
        ? agentSelectors.getAgentConfigById(inboxAgentId)(agentState)
        : null;
      const model = inboxConfig?.model;
      const provider = inboxConfig?.provider;

      const newDoc = await documentService.createDocument({
        editorData: '{}',
        fileType: 'custom/document',
        title: message?.slice(0, 50) || 'Untitled',
      });

      const { navigate } = this.#get();
      if (navigate) {
        navigate(`/page/${newDoc.id}`);
      }

      const pageAgentId = builtinAgentSelectors.pageAgentId(agentState);

      if (pageAgentId) {
        if (model && provider) {
          await agentState.updateAgentConfigById(pageAgentId, { model, provider });
        }

        const { sendMessage } = useChatStore.getState();
        await sendMessage({
          context: { agentId: pageAgentId, scope: 'page' },
          message,
        });
      }

      this.#set({ inputActiveMode: null }, false, n('sendAsWrite/clearMode'));
      return newDoc.id;
    } finally {
      this.#set({ homeInputLoading: false }, false, n('sendAsWrite/end'));
    }
  };

  // ─── Private Helpers ─────────────────────────────────────────────── //

  /** Persist workspaces list to localStorage. */
  #persistWorkspaces = (workspaces: WorkspaceFolder[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces));
    } catch {
      // ignore quota errors
    }
  };
}

export type HomeInputAction = Pick<HomeInputActionImpl, keyof HomeInputActionImpl>;
