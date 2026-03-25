import { useEditor } from '@lobehub/editor/react';
import { type ReactNode } from 'react';
import { memo, useRef } from 'react';

import { createStore, Provider } from './store';
import { type StoreUpdaterProps } from './StoreUpdater';
import StoreUpdater from './StoreUpdater';

interface ChatInputProviderProps extends StoreUpdaterProps {
  children: ReactNode;
}

export const ChatInputProvider = memo<ChatInputProviderProps>(
  ({
    agentId,
    children,
    leftActions,
    rightActions,
    mobile,
    sendButtonProps,
    onSend,
    sendMenu,
    chatInputEditorRef,
    onMarkdownContentChange,
    mentionItems,
    allowExpand = true,
    slashPlacement,
  }) => {
    const editor = useEditor();
    const slashMenuRef = useRef<HTMLDivElement>(null);

    // Bug 9 fix: stabilize the store instance via ref.
    // Dynamic props (onSend, leftActions, etc.) are synced through StoreUpdater,
    // so the store itself never needs to be recreated after mount.
    const storeRef = useRef<ReturnType<typeof createStore> | undefined>(undefined);
    if (!storeRef.current) {
      storeRef.current = createStore({
        allowExpand,
        editor,
        leftActions,
        mentionItems,
        mobile,
        rightActions,
        sendButtonProps,
        sendMenu,
        slashMenuRef,
        slashPlacement,
      });
    }

    return (
      <Provider createStore={() => storeRef.current!}>
        <StoreUpdater
          agentId={agentId}
          allowExpand={allowExpand}
          chatInputEditorRef={chatInputEditorRef}
          leftActions={leftActions}
          mentionItems={mentionItems}
          mobile={mobile}
          rightActions={rightActions}
          sendButtonProps={sendButtonProps}
          sendMenu={sendMenu}
          slashPlacement={slashPlacement}
          onMarkdownContentChange={onMarkdownContentChange}
          onSend={onSend}
        />
        {children}
      </Provider>
    );
  },
);
