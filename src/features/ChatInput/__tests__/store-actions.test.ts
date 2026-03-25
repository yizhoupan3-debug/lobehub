import { describe, expect, it, vi } from 'vitest';

import { createStore } from '../store';

/**
 * Unit tests for ChatInput store actions.
 * Covers the three key stability behaviors patched in this session.
 */

describe('ChatInput store — updateMarkdownContent', () => {
  it('does not call onMarkdownContentChange when content is unchanged', () => {
    const onChange = vi.fn();
    const mockEditor = {
      cleanDocument: vi.fn(),
      focus: vi.fn(),
      getDocument: vi.fn().mockReturnValue('hello'),
    } as any;

    const store = createStore({
      leftActions: [],
      rightActions: [],
      onMarkdownContentChange: onChange,
    });

    // Seed markdownContent so first call short-circuits
    store.setState({ editor: mockEditor, markdownContent: 'hello' });
    store.getState().updateMarkdownContent();

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onMarkdownContentChange when content changes', () => {
    const onChange = vi.fn();
    const mockEditor = {
      getDocument: vi.fn().mockReturnValue('new content'),
    } as any;

    const store = createStore({
      leftActions: [],
      rightActions: [],
      onMarkdownContentChange: onChange,
    });

    store.setState({ editor: mockEditor, markdownContent: '' });
    store.getState().updateMarkdownContent();

    expect(onChange).toHaveBeenCalledWith('new content');
  });
});

describe('ChatInput store — handleSendButton', () => {
  it('returns early when editor is not set', () => {
    const onSend = vi.fn();
    const store = createStore({ leftActions: [], rightActions: [], onSend });

    store.setState({ editor: undefined });
    store.getState().handleSendButton();

    expect(onSend).not.toHaveBeenCalled();
  });

  it('calls onSend with correct params when editor is set', () => {
    const onSend = vi.fn();
    const mockEditor = {
      cleanDocument: vi.fn(),
      focus: vi.fn(),
      getDocument: vi.fn().mockReturnValue(''),
    } as any;

    const store = createStore({ leftActions: [], rightActions: [], onSend });
    store.setState({ editor: mockEditor });

    store.getState().handleSendButton();

    expect(onSend).toHaveBeenCalledWith(
      expect.objectContaining({
        isPlanMode: false,
        isSubagentMode: false,
      }),
    );
  });
});

describe('ChatInput store — togglePlanMode', () => {
  it('toggles isPlanMode from false to true', () => {
    const store = createStore({ leftActions: [], rightActions: [] });
    expect(store.getState().isPlanMode).toBe(false);

    store.getState().togglePlanMode();
    expect(store.getState().isPlanMode).toBe(true);
  });

  it('toggles isPlanMode back to false on second call', () => {
    const store = createStore({ leftActions: [], rightActions: [], isPlanMode: true });
    store.getState().togglePlanMode();
    expect(store.getState().isPlanMode).toBe(false);
  });
});
