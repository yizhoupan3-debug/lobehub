'use client';

import { ActionIcon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { X } from 'lucide-react';
import { memo } from 'react';

import { useGlobalStore } from '@/store/global';

import DocumentPreviewer from './DocumentPreviewer';
import FileTreeViewer from './FileTreeViewer';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    height: 100%;
    border-inline-start: 1px solid ${token.colorBorder};

    background: ${token.colorBgContainer};

    transition: width 0.2s ease-in-out;
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

const WorkspaceRightPanel = memo(() => {
  const { styles } = useStyles();
  const mode = useGlobalStore((s) => s.status.workspaceRightPanelMode);
  const previewFile = useGlobalStore((s) => s.status.workspacePreviewFile);
  const closePanel = useGlobalStore((s) => s.closeWorkspaceRightPanel);

  if (!mode) return null;

  return (
    <div className={styles.container} style={{ width: mode === 'preview' ? '50%' : 260, maxWidth: 800 }}>
      <div className={styles.header}>
        <span className={styles.title}>
          {mode === 'tree' ? '工作区文件' : previewFile?.title || '文档预览'}
        </span>
        <ActionIcon icon={X} size="small" title="关闭" onClick={() => closePanel()} />
      </div>
      <div className={styles.content}>
        {mode === 'tree' && <FileTreeViewer />}
        {mode === 'preview' && <DocumentPreviewer />}
      </div>
    </div>
  );
});

export default WorkspaceRightPanel;
