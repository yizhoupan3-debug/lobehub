'use client';

import { ActionIcon, DraggablePanel } from '@lobehub/ui';
import { createStyles, cssVar } from 'antd-style';
import { PanelLeftClose } from 'lucide-react';
import { memo } from 'react';

import { useGlobalStore } from '@/store/global';

import FileTreeViewer from './FileTreeViewer';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    height: 100%;
    border-inline-end: 1px solid ${token.colorBorder};

    background: ${token.colorBgContainer};
  `,
  header: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;

    min-height: 48px;
    padding-block: 8px;
    padding-inline: 12px;
    border-block-end: 1px solid ${token.colorBorderSecondary};
  `,
  title: css`
    overflow: hidden;

    font-size: 14px;
    font-weight: 500;
    color: ${token.colorText};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  content: css`
    overflow: hidden;
    flex: 1;
  `
}));

const WorkspaceLeftPanel = memo(() => {
  const { styles } = useStyles();
  const show = useGlobalStore((s) => s.status.showWorkspaceLeftPanel);
  const togglePanel = useGlobalStore((s) => s.toggleWorkspaceTree);

  return (
    <DraggablePanel
      backgroundColor={cssVar.colorBgContainer}
      expand={show}
      expandable={false}
      minWidth={200}
      maxWidth={800}
      placement="left"
      size={{ width: '33vw', height: '100%' }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>工作区文件</span>
          <ActionIcon icon={PanelLeftClose} size="small" title="关闭" onClick={() => togglePanel()} />
        </div>
        <div className={styles.content}>
          <FileTreeViewer />
        </div>
      </div>
    </DraggablePanel>
  );
});

export default WorkspaceLeftPanel;
