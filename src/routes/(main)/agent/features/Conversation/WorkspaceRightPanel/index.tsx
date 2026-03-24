'use client';

import { ActionIcon, DraggablePanel } from '@lobehub/ui';
import { createStyles, cssVar } from 'antd-style';
import { PanelRightClose } from 'lucide-react';
import { memo } from 'react';

import { useGlobalStore } from '@/store/global';

import DocumentPreviewer from './DocumentPreviewer';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    height: 100%;
    border-inline-start: 1px solid ${token.colorBorder};

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

const WorkspaceRightPanel = memo(() => {
  const { styles } = useStyles();
  const mode = useGlobalStore((s) => s.status.workspaceRightPanelMode);
  const previewFile = useGlobalStore((s) => s.status.workspacePreviewFile);
  const closePanel = useGlobalStore((s) => s.closeWorkspaceRightPanel);

  return (
    <DraggablePanel
      backgroundColor={cssVar.colorBgContainer}
      expand={!!mode}
      expandable={false}
      minWidth={200}
      maxWidth={800}
      placement="right"
      size={{ width: '33vw', height: '100%' }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>
            {previewFile?.title || '文档预览'}
          </span>
          <ActionIcon icon={PanelRightClose} size="small" title="关闭" onClick={() => closePanel()} />
        </div>
        <div className={styles.content}>
          {mode === 'preview' && <DocumentPreviewer />}
        </div>
      </div>
    </DraggablePanel>
  );
});

export default WorkspaceRightPanel;
