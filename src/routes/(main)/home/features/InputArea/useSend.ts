import { SESSION_CHAT_URL } from '@lobechat/const';
import { useCallback } from 'react';

import { useQueryRoute } from '@/hooks/useQueryRoute';
import { useAgentStore } from '@/store/agent';
import { builtinAgentSelectors } from '@/store/agent/selectors';
import { useChatStore } from '@/store/chat';
import { fileChatSelectors, useFileStore } from '@/store/file';
import { useHomeStore } from '@/store/home';
import { useChatInputStore } from '@/features/ChatInput/store';

export const useSend = () => {
  const router = useQueryRoute();
  const inboxAgentId = useAgentStore(builtinAgentSelectors.inboxAgentId);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const clearChatUploadFileList = useFileStore((s) => s.clearChatUploadFileList);
  const clearChatContextSelections = useFileStore((s) => s.clearChatContextSelections);

  const homeInputLoading = useHomeStore((s) => s.homeInputLoading);

  const send = useCallback(async () => {
    const { inputMessage, mainInputEditor } = useChatStore.getState();
    const fileList = fileChatSelectors.chatUploadFileList(useFileStore.getState());
    const contextList = fileChatSelectors.chatContextSelections(useFileStore.getState());
    const { sendAsAgent, sendAsGroup, sendAsWrite, sendAsResearch, inputActiveMode } =
      useHomeStore.getState();

    // Require input content (except for default inbox which can have files/context)
    if (!inputMessage && fileList.length === 0 && contextList.length === 0) return;

    let finalMessage = inputMessage;
    const { isPlanMode, isSubagentMode } = useChatInputStore.getState();
    if (finalMessage) {
      if (isPlanMode) {
        finalMessage = `[PLAN_MODE]\n请为以下需求提供详细的 implementation_plan.md 设计。\n要求：包含 Goal Description、Proposed Changes（明确文件和具体的修改）、Verification Plan。\n\n需求详情：\n${finalMessage}`;
      } else if (isSubagentMode) {
        finalMessage = `[SUBAGENT_MODE]\n请为以下需求启动 Codex 并发子代理派发 (subagent-delegation)。\n核心要求：\n1. 采用侧边车架构 (sidecar) 执行并发任务；\n2. 必须显式维护 \`.supervisor_state.json\` 做状态持久化与防崩溃恢复；\n3. 严格遵守 90/10 法则：主线程仅保留高阶决策与结论摘要，将详细探索逻辑、执行堆栈与输出收集分发至子节点。\n\n需求详情：\n${finalMessage}`;
      }
    }

    try {
      switch (inputActiveMode) {
        case 'agent': {
          await sendAsAgent(finalMessage);
          break;
        }

        case 'group': {
          await sendAsGroup(finalMessage);
          break;
        }

        case 'write': {
          await sendAsWrite(finalMessage);
          break;
        }

        case 'research': {
          await sendAsResearch(finalMessage);
          break;
        }

        default: {
          // Default inbox behavior
          if (!inboxAgentId) return;

          sendMessage({
            context: { agentId: inboxAgentId },
            contexts: contextList,
            files: fileList,
            message: finalMessage,
          });

          router.push(SESSION_CHAT_URL(inboxAgentId, false));
        }
      }
    } finally {
      // Clear input and files after send
      clearChatUploadFileList();
      clearChatContextSelections();
      mainInputEditor?.clearContent();
    }
  }, [inboxAgentId, sendMessage, clearChatContextSelections, clearChatUploadFileList, router]);

  return {
    inboxAgentId,
    loading: homeInputLoading,
    send,
  };
};
