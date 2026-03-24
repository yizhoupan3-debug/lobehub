'use client';

import { FolderOpen, FileText } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { createStyles } from 'antd-style';

import { useHomeStore } from '@/store/home';
import { useGlobalStore } from '@/store/global';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    padding: 8px;
    height: 100%;
    overflow-y: auto;
  `,
  item: css`
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
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
    text-align: center;
    color: ${token.colorTextDescription};
    font-size: 13px;
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
          <div key={idx} className={styles.item} onClick={() => handleFileClick(item)}>
            {item.type === 'dir' ? (
              <FolderOpen size={14} className={styles.icon} />
            ) : (
              <FileText size={14} className={styles.icon} />
            )}
            {item.name}
          </div>
        ))
      )}
    </div>
  );
});

export default FileTreeViewer;
