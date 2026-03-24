'use client';

import { createStyles } from 'antd-style';
import { FileText,FolderOpen } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

import { useGlobalStore } from '@/store/global';
import { useHomeStore } from '@/store/home';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    overflow-y: auto;
    height: 100%;
    padding: 8px;
  `,
  item: css`
    cursor: pointer;

    display: flex;
    gap: 8px;
    align-items: center;

    padding-block: 6px;
    padding-inline: 8px;
    border-radius: 4px;

    font-size: 13px;
    color: ${token.colorText};
    
    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  icon: css`
    color: ${token.colorTextDescription};
  `,
  empty: css`
    padding: 24px;
    font-size: 13px;
    color: ${token.colorTextDescription};
    text-align: center;
  `
}));

const FileTreeViewer = memo(() => {
  const { styles } = useStyles();
  const workspacePath = useHomeStore((s) => s.workspacePath);
  const openPreview = useGlobalStore((s) => s.openWorkspacePreview);
  const [tree, setTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspacePath) return;
    setLoading(true);
    fetch(`/api/codex/fs/tree?path=${encodeURIComponent(workspacePath)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.tree) setTree(data.tree);
      })
      .finally(() => setLoading(false));
  }, [workspacePath]);

  const handleFileClick = (file: any) => {
    if (file.type === 'file') {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      openPreview({
        url: file.path, 
        type: ext,
        title: file.name
      });
    }
  };

  if (!workspacePath) {
    return <div className={styles.empty}>未选择工作区文件夹</div>;
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.empty}>加载中...</div>
      ) : tree.length === 0 ? (
        <div className={styles.empty}>空文件夹</div>
      ) : (
        tree.map((item, idx) => (
          <div className={styles.item} key={idx} onClick={() => handleFileClick(item)}>
            {item.type === 'dir' ? (
              <FolderOpen className={styles.icon} size={14} />
            ) : (
              <FileText className={styles.icon} size={14} />
            )}
            {item.name}
          </div>
        ))
      )}
    </div>
  );
});

export default FileTreeViewer;
