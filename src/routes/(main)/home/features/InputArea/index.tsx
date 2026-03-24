import { Flexbox } from '@lobehub/ui';
import { useMemo, useRef } from 'react';

import DragUploadZone, { useUploadFiles } from '@/components/DragUploadZone';
import { type ActionKeys } from '@/features/ChatInput';
import { ChatInputProvider, DesktopChatInput } from '@/features/ChatInput';
import { useChatInputStore } from '@/features/ChatInput/store';
import { useAgentStore } from '@/store/agent';
import { agentByIdSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { useHomeStore } from '@/store/home';
import { serverConfigSelectors, useServerConfigStore } from '@/store/serverConfig';

import ModeTag from './ModeTag';
import SkillInstallBanner from './SkillInstallBanner';
import StarterList from './StarterList';
import { useSend } from './useSend';

const leftActions: ActionKeys[] = ['model', 'plusMenu', 'subagentMode', 'search', 'fileUpload', 'tools'];

const InputArea = () => {
  const { loading, send, inboxAgentId } = useSend();
  const inputActiveMode = useHomeStore((s) => s.inputActiveMode);
  
  const isPlanMode = useChatInputStore((s) => s.isPlanMode);
  const isSubagentMode = useChatInputStore((s) => s.isSubagentMode);
  const isConcurrentMode = isPlanMode || isSubagentMode;

  const isLobehubSkillEnabled = useServerConfigStore(serverConfigSelectors.enableLobehubSkill);
  const isKlavisEnabled = useServerConfigStore(serverConfigSelectors.enableKlavis);
  const showSkillBanner = isLobehubSkillEnabled || isKlavisEnabled;
  const chatInputRef = useRef<HTMLDivElement>(null);

  // Get agent's model info for vision support check
  const model = useAgentStore((s) => agentByIdSelectors.getAgentModelById(inboxAgentId)(s));
  const provider = useAgentStore((s) =>
    agentByIdSelectors.getAgentModelProviderById(inboxAgentId)(s),
  );
  const { handleUploadFiles } = useUploadFiles({ model, provider });

  // A slot to insert content above the chat input
  const inputContainerProps = useMemo(
    () => ({
      minHeight: 88,
      resize: false,
      style: {
        borderRadius: 20,
        boxShadow: '0 12px 32px rgba(0,0,0,.04)',
      },
    }),
    [],
  );

  const extraActionItems = useMemo(
    () =>
      inputActiveMode
        ? [
            {
              children: <ModeTag />,
              key: 'mode-tag',
            },
          ]
        : [],
    [inputActiveMode],
  );

  return (
    <Flexbox gap={16} style={{ marginBottom: 16 }}>
      <Flexbox
        ref={chatInputRef}
        style={{ paddingBottom: showSkillBanner ? 32 : 0, position: 'relative' }}
      >
        {showSkillBanner && <SkillInstallBanner />}
        <DragUploadZone
          style={{ position: 'relative', zIndex: 1 }}
          onUploadFiles={handleUploadFiles}
        >
          <ChatInputProvider
            agentId={inboxAgentId}
            allowExpand={false}
            leftActions={leftActions}
            slashPlacement="bottom"
            chatInputEditorRef={(instance) => {
              if (!instance) return;
              useChatStore.setState({ mainInputEditor: instance });
            }}
            sendButtonProps={{
              disabled: isConcurrentMode ? false : loading,
              generating: isConcurrentMode ? false : loading,
              onStop: () => {},
              shape: 'round',
            }}
            onSend={send}
            onMarkdownContentChange={(content) => {
              useChatStore.setState({ inputMessage: content });
            }}
          >
            <DesktopChatInput
              dropdownPlacement="bottomLeft"
              extraActionItems={extraActionItems}
              inputContainerProps={inputContainerProps}
              showRuntimeConfig={false}
            />
          </ChatInputProvider>
        </DragUploadZone>
      </Flexbox>

      {/* Keep StarterList hidden but mounted to preserve useInitBuiltinAgent hooks */}
      <div style={{ display: 'none' }}>
        <StarterList />
      </div>
    </Flexbox>
  );
};

export default InputArea;
