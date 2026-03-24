import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// 简单扫描某个目录（这里为了演示和快速实现，取 ~/.codex 和近期对话的一些 mock 信息）
// 在生产级可以改成通过网关调用 codex aggregator 获取
export async function GET() {
  const categories = [ {
    id: 'file',
    label: 'Workspace Files',
    items: [
      { key: 'file-1', label: 'src/features/ChatInput/index.tsx', metadata: { type: 'file', path: 'src/features/ChatInput/index.tsx' } },
      { key: 'file-2', label: 'package.json', metadata: { type: 'file', path: 'package.json' } },
      { key: 'file-3', label: '.env', metadata: { type: 'file', path: '.env' } },
    ]
  }, {
    id: 'task',
    label: 'Tasks',
    items: [
      { key: 'task-1', label: 'Current Task (task.md)', metadata: { type: 'task', path: 'task.md' } },
      { key: 'task-2', label: 'Implementation Plan', metadata: { type: 'task', path: 'implementation_plan.md' } },
    ]
  }, {
    id: 'walkthrough',
    label: 'Walkthroughs',
    items: [
      { key: 'wt-1', label: 'Current Walkthrough (walkthrough.md)', metadata: { type: 'walkthrough', path: 'walkthrough.md' } },
    ]
  }, {
    id: 'conversation',
    label: 'Conversations / Memory',
    items: [
      { key: 'conv-1', label: 'LobeChat Deep Customization', metadata: { type: 'conversation', id: '4b46eb39-26aa-4de9-8251-01aaecacba75' } },
      { key: 'conv-2', label: 'Agent Server Integration', metadata: { type: 'conversation', id: 'prev-1' } },
    ]
  }];

  // 1. Files
  // 我们构造一些核心预设文件或最近访问文件

  // 2. Task

  // 3. Walkthrough

  // 4. Conversation

  return NextResponse.json(categories);
}
