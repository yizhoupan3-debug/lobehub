import { type StateCreator } from 'zustand/vanilla';

import { type PublicState, type State } from './initialState';
import { initialState } from './initialState';

export interface Action {
  getJSONState: () => Record<string, any> | undefined;
  getMarkdownContent: () => string;
  handleSendButton: () => void;
  handleStop: () => void;
  setDocument: (type: string, content: any, options?: Record<string, unknown>) => void;
  setExpand: (expend: boolean) => void;
  setJSONState: (content: any) => void;
  setPlanMode: (isPlanMode: boolean) => void;
  setShowTypoBar: (show: boolean) => void;
  setSubagentMode: (isSubagentMode: boolean) => void;
  togglePlanMode: () => void;
  toggleSubagentMode: () => void;
  updateMarkdownContent: () => void;
}

export type Store = Action & State;

type CreateStore = (
  initState?: Partial<PublicState>,
) => StateCreator<Store, [['zustand/devtools', never]]>;

export const store: CreateStore = (publicState) => (set, get) => ({
  ...initialState,
  ...publicState,

  getJSONState: () => {
    return get().editor?.getDocument('json') as Record<string, any> | undefined;
  },
  getMarkdownContent: () => {
    return String(get().editor?.getDocument('markdown') || '').trimEnd();
  },
  handleSendButton: () => {
    const editor = get().editor;
    if (!editor) return;

    get().onSend?.({
      clearContent: () => editor?.cleanDocument(),
      editor: editor!,
      getEditorData: get().getJSONState,
      getMarkdownContent: get().getMarkdownContent,
      isPlanMode: get().isPlanMode || false,
      isSubagentMode: get().isSubagentMode || false,
    });
    // Bug 5 fix: single rAF is sufficient after React layout effects;
    // read editor via get() snapshot to avoid stale closure.
    requestAnimationFrame(() => {
      get().editor?.focus();
    });
  },

  handleStop: () => {
    if (!get().editor) return;

    get().sendButtonProps?.onStop?.({ editor: get().editor! });
  },

  setDocument: (type, content, options) => {
    get().editor?.setDocument(type, content, options);
  },

  setExpand: (expand) => {
    set({ expand });
  },

  setJSONState: (content) => {
    get().editor?.setDocument('json', content);
  },

  setPlanMode: (isPlanMode) => {
    set({ isPlanMode });
  },

  setSubagentMode: (isSubagentMode) => {
    set({ isSubagentMode });
  },

  setShowTypoBar: (showTypoBar) => {
    set({ showTypoBar });
  },

  togglePlanMode: () => {
    set({ isPlanMode: !get().isPlanMode });
  },

  toggleSubagentMode: () => {
    set({ isSubagentMode: !get().isSubagentMode });
  },

  updateMarkdownContent: () => {
    if (!get().onMarkdownContentChange) return;

    const content = get().getMarkdownContent();

    if (content === get().markdownContent) return;

    get().onMarkdownContentChange?.(content);

    set({ markdownContent: content });
  },
});
