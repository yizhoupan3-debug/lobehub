'use client';

import { ActionIcon } from '@lobehub/ui';
import { X } from 'lucide-react';
import { memo } from 'react';
import { createStyles } from 'antd-style';

import { useGlobalStore } from '@/store/global';

import FileTreeViewer from './FileTreeViewer';
import DocumentPreviewer from './DocumentPreviewer';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    border-left: 1px solid ${token.colorBorder};
    background: ${token.colorBgContainer};
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: width 0.2s ease-in-out;
    flex-shrink: 0;
  `,
  header: css`
    padding: 8px 12px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    flex-shrink: 0;
  `,
  title: css`
    font-weight: 500;
    font-size: 14px;
    color: ${token.colorText};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  content: css`
    flex: 1;
    overflow: hidden;
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
        <ActionIcon icon={X} onClick={() => closePanel()} size="small" title="关闭" />
      </div>
      <div className={styles.content}>
        {mode === 'tree' && <FileTreeViewer />}
        {mode === 'preview' && <DocumentPreviewer />}
      </div>
    </div>
  );
});

export default WorkspaceRightPanel;
