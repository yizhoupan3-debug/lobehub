'use client';

import { ActionIcon, ContextMenu } from '@lobehub/ui';
import { useLocalStorageState } from 'ahooks';
import { Dropdown, Input, message, Modal } from 'antd';
import { createStyles } from 'antd-style';
import { AppWindowIcon, ChevronDownIcon, ChevronRightIcon, CodeIcon, FileDiffIcon, FolderIcon, FolderOpenIcon, GitBranchIcon, MessageSquareIcon, PlusIcon, SettingsIcon, TerminalSquareIcon, Trash2Icon } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SESSION_CHAT_URL } from '@/const/index';
import { useHomeStore } from '@/store/home';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

import FolderPickerButton from './FolderPickerButton';
import { SubAccountDashboard } from './SubAccountDashboard';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  header: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;

    padding-block: 8px 4px;
    padding-inline: 12px;
  `,
  headerTitle: css`
    font-size: 12px;
    font-weight: 500;
    color: ${token.colorTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,
  headerActions: css`
    display: flex;
    gap: 2px;
  `,
  scrollArea: css`
    overflow: hidden auto;
    flex: 1;
    padding-block: 4px 12px;
    padding-inline: 4px;
  `,
  folderRow: css`
    cursor: pointer;
    user-select: none;

    display: flex;
    gap: 6px;
    align-items: center;

    min-height: 28px;
    padding-block: 4px;
    padding-inline: 8px;
    border-radius: 6px;

    &:hover {
      background: ${token.colorFillQuaternary};
    }

    &:hover .folder-actions {
      pointer-events: auto !important;
      opacity: 1 !important;
    }
  `,
  folderIcon: css`
    flex-shrink: 0;
    color: ${token.colorTextTertiary};
  `,
  folderName: css`
    overflow: hidden;
    flex: 1;

    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  folderParent: css`
    overflow: hidden;
    flex-shrink: 0;

    max-width: 80px;

    font-size: 11px;
    color: ${token.colorTextQuaternary};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  threadList: css`
    margin-block-end: 4px;
    margin-inline-start: 20px;
    padding-inline-start: 8px;
    border-inline-start: 1px solid ${token.colorBorderSecondary};
  `,
  threadRow: css`
    cursor: pointer;

    display: flex;
    gap: 6px;
    align-items: center;

    min-height: 26px;
    padding-block: 3px;
    padding-inline: 6px;
    border-radius: 5px;

    &:hover {
      background: ${token.colorFillQuaternary};
    }
  `,
  threadTitle: css`
    overflow: hidden;
    flex: 1;

    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  threadTime: css`
    flex-shrink: 0;
    font-size: 11px;
    color: ${token.colorTextQuaternary};
  `,
  empty: css`
    padding-block: 8px;
    padding-inline: 12px;

    font-size: 12px;
    color: ${token.colorTextQuaternary};
    text-align: center;
  `,
}));

/** Format relative time (e.g. "2 小时") */
function formatRelativeTime(date: Date | string | number): string {
  const now = Date.now();
  const ts = new Date(date).getTime();
  const diff = now - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins} 分钟`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时`;
  const days = Math.floor(hours / 24);
  return `${days} 天`;
}

const WorkspaceSidebar = memo(() => {
  const { styles } = useStyles();
  const navigate = useNavigate();

  const [workspaces, collapsedIds, toggleCollapsed, removeWorkspace, setSidebarMode, setWorkspacePath] =
    useHomeStore((s) => [
      s.workspaces,
      s.collapsedWorkspaceIds,
      s.toggleWorkspaceCollapsed,
      s.removeWorkspace,
      s.setSidebarMode,
      s.setWorkspacePath,
    ]);

  const [customApps, setCustomApps] = useLocalStorageState<{ id: string; name: string; appName: string }[]>('lobe-codex-custom-apps', {
    defaultValue: [],
  });
  const [isAppModalOpen, setAppModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');

  // Get all sessions from session store
  const sessions = useSessionStore(sessionSelectors.sessionList);

  // Group sessions by workspacePath embedded in their config/systemRole
  const getSessionsForWorkspace = useCallback(
    (workspacePath: string) => {
      return sessions.filter((s) => {
        const role = (s as any).config?.systemRole || '';
        return role.includes(`[Workspace] cwd: ${workspacePath}`);
      });
    },
    [sessions],
  );

  const handleThreadClick = useCallback(
    (sessionId: string, configId?: string) => {
      navigate(SESSION_CHAT_URL(configId || sessionId, false));
    },
    [navigate],
  );

  const handleFolderClick = useCallback(
    (workspaceId: string) => {
      toggleCollapsed(workspaceId);
    },
    [toggleCollapsed],
  );

  const handleFolderSelect = useCallback(
    (workspacePath: string) => {
      setWorkspacePath(workspacePath);
    },
    [setWorkspacePath],
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>线程</span>
        <div className={styles.headerActions}>
          {/* Native folder picker */}
          <FolderPickerButton />
        </div>
      </div>

      {/* Workspace folder list */}
      <div className={styles.scrollArea}>
        {workspaces.length === 0 ? (
          <div className={styles.empty}>
            <FolderIcon size={20} style={{ opacity: 0.3, display: 'block', margin: '8px auto 4px' }} />
            <div>点击右上角 + 添加项目文件夹</div>
          </div>
        ) : (
          workspaces.map((workspace) => {
            const isCollapsed = collapsedIds.includes(workspace.id);
            const workspaceSessions = getSessionsForWorkspace(workspace.path);

            const handleIdeAction = async (action: string, workspacePath: string, customAppName?: string) => {
              const hide = message.loading('执行中...', 0);
              try {
                const res = await fetch('/api/codex/ide-action', {
                  method: 'POST',
                  body: JSON.stringify({ action, workspacePath, customAppName }),
                  headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                hide();
                if (!res.ok) throw new Error(data.error || 'Unknown Error');

                if (action.startsWith('git_')) {
                  Modal.info({
                    title: action === 'git_status' ? 'Git 状态' : 'Git Diff',
                    width: 700,
                    content: (
                      <pre style={{ maxHeight: 400, overflowY: 'auto', background: 'var(--color-bg-layout)', padding: 12, borderRadius: 8, fontSize: 13, border: '1px solid var(--color-border)', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                        {data.stdout}
                      </pre>
                    ),
                    maskClosable: true,
                  });
                } else {
                  message.success(`打开成功`);
                }
              } catch (e: any) {
                hide();
                message.error(`执行失败: ${e.message}`);
              }
            };

            const plusMenu = [
              {
                icon: <FolderOpenIcon size={14} />,
                key: 'finder',
                label: '在访达中打开',
                onClick: () => handleIdeAction('finder', workspace.path),
              },
              {
                icon: <CodeIcon size={14} />,
                key: 'ide',
                label: '使用 Antigravity 打开',
                onClick: () => handleIdeAction('ide', workspace.path),
              },
              { type: 'divider' as const },
              ...(customApps || []).map(app => ({
                icon: <AppWindowIcon size={14} />,
                key: `custom_${app.id}`,
                label: `使用 ${app.name} 打开`,
                onClick: () => handleIdeAction('custom_app', workspace.path, app.appName),
              })),
              ...(customApps && customApps.length > 0 ? [{ type: 'divider' as const }] : []),
              {
                icon: <SettingsIcon size={14} />,
                key: 'add_app',
                label: '配置第三方应用...',
                onClick: () => setAppModalOpen(true),
              }
            ];

            const folderContextMenu = [
              {
                icon: <GitBranchIcon size={14} />,
                key: 'git_status',
                label: '查看 Git 状态',
                onClick: () => handleIdeAction('git_status', workspace.path),
              },
              {
                icon: <FileDiffIcon size={14} />,
                key: 'git_diff',
                label: '查看修改文件 (Diff)',
                onClick: () => handleIdeAction('git_diff', workspace.path),
              },
              {
                type: 'divider',
              },
              {
                danger: true,
                icon: <Trash2Icon size={14} />,
                key: 'delete',
                label: '删除文件夹',
                onClick: () => removeWorkspace(workspace.id),
              },
            ];

            return (
              <div key={workspace.id}>
                {/* Folder header row */}
                <ContextMenu items={folderContextMenu} triggerType="contextMenu">
                  <div
                    className={styles.folderRow}
                    onClick={() => handleFolderClick(workspace.id)}
                    onDoubleClick={() => handleFolderSelect(workspace.path)}
                  >
                    {isCollapsed ? (
                      <ChevronRightIcon className={styles.folderIcon} size={14} />
                    ) : (
                      <ChevronDownIcon className={styles.folderIcon} size={14} />
                    )}
                    <FolderIcon className={styles.folderIcon} size={14} />
                    <span className={styles.folderName}>{workspace.name}</span>
                    {workspace.parent && (
                      <span className={styles.folderParent}>{workspace.parent}</span>
                    )}

                    <div className="folder-actions" style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto', opacity: 0, pointerEvents: 'none', transition: 'all 0.2s ease-in-out' }}>
                      <ActionIcon
                        icon={TerminalSquareIcon}
                        size="small"
                        title="在终端中打开"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIdeAction('terminal', workspace.path);
                        }}
                      />
                      <Dropdown
                        menu={{ items: plusMenu }}
                        placement="bottomRight"
                        trigger={['click', 'hover']}
                      >
                        <ActionIcon
                          icon={PlusIcon}
                          size="small"
                          title="扩展应用"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </ContextMenu>

                {/* Thread list */}
                {!isCollapsed && (
                  <div className={styles.threadList}>
                    {workspaceSessions.length === 0 ? (
                      <div style={{ padding: '4px 6px', fontSize: 11, opacity: 0.4 }}>
                        暂无对话线程
                      </div>
                    ) : (
                      workspaceSessions.map((session) => (
                        <ThreadItem
                          key={session.id}
                          session={session}
                          onNavigate={handleThreadClick}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <SubAccountDashboard />

      {/* Custom App Modal */}
      <Modal 
        cancelText="取消" 
        okText="添加" 
        open={isAppModalOpen}
        title="添加自定义应用"
        onCancel={() => setAppModalOpen(false)}
        onOk={() => {
          if (!newAppName.trim()) return;
          setCustomApps(prev => [...(prev || []), { id: Date.now().toString(), name: newAppName.trim(), appName: newAppName.trim() }]);
          setNewAppName('');
          setAppModalOpen(false);
        }}
      >
        <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-text-description)' }}>
          请输入 macOS 应用程序的确切名称（如 <code>Cursor</code>、<code>Xcode</code>、<code>WebStorm</code> 等），它将通过系统的 <code>open -a</code> 命令拉起：
        </div>
        <Input 
          placeholder="应用名称 (例如 Cursor)..." 
          value={newAppName} 
          onChange={(e) => setNewAppName(e.target.value)} 
          onPressEnter={() => {
            if (!newAppName.trim()) return;
            setCustomApps(prev => [...(prev || []), { id: Date.now().toString(), name: newAppName.trim(), appName: newAppName.trim() }]);
            setNewAppName('');
            setAppModalOpen(false);
          }}
        />
        {customApps && customApps.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500 }}>已添加的应用：</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {customApps.map(app => (
                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-fill-tertiary)', padding: '4px 8px', borderRadius: 4 }}>
                  <span style={{ fontSize: 13 }}>{app.name}</span>
                  <ActionIcon icon={Trash2Icon} size={'small'} onClick={() => {
                    setCustomApps(prev => (prev || []).filter(a => a.id !== app.id));
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
});

export default WorkspaceSidebar;

// ── ThreadItem ─────────────────────────────────────────────────────────────

interface ThreadItemProps {
  onNavigate: (sessionId: string, configId?: string) => void;
  session: any;
}

const ThreadItem = memo<ThreadItemProps>(({ session, onNavigate }) => {
  const { styles } = useStyles();
  const [removeSession] = useSessionStore((s) => [s.removeSession]);

  const title = session.meta?.title || session.config?.title || '未命名对话';
  const time = session.updatedAt ? formatRelativeTime(session.updatedAt) : '';
  const configId = (session as any).config?.id;

  const contextMenu = [
    {
      danger: true,
      icon: <Trash2Icon size={14} />,
      key: 'delete',
      label: '删除线程',
      onClick: () => removeSession(session.id),
    },
  ];

  return (
    <ContextMenu items={contextMenu} triggerType="contextMenu">
      <div
        className={styles.threadRow}
        onClick={() => onNavigate(session.id, configId)}
      >
        <MessageSquareIcon size={12} style={{ opacity: 0.4, flexShrink: 0 }} />
        <span className={styles.threadTitle}>{title}</span>
        {time && <span className={styles.threadTime}>{time}</span>}
      </div>
    </ContextMenu>
  );
});
