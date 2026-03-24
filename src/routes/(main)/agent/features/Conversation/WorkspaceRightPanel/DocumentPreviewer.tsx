'use client';

import { createStyles } from 'antd-style';
import { memo, useEffect, useState } from 'react';

import { useGlobalStore } from '@/store/global';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    overflow: auto;
    width: 100%;
    height: 100%;
    background: ${token.colorBgLayout};
  `,
  iframe: css`
    width: 100%;
    height: 100%;
    border: none;
  `,
  textPreview: css`
    padding: 16px;

    font-family: monospace;
    font-size: 13px;
    color: ${token.colorText};
    white-space: pre-wrap;
  `,
  error: css`
    padding: 24px;
    color: ${token.colorError};
    text-align: center;
  `
}));

const DocumentPreviewer = memo(() => {
  const { styles } = useStyles();
  const file = useGlobalStore((s) => s.status.workspacePreviewFile);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const isText = file && ['md', 'tex', 'txt', 'json', 'py', 'js', 'ts', 'tsx', 'jsx', 'csv', 'r', 'css', 'html'].includes(file.type);
  const isImage = file && ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(file.type);
  const isPdf = file && file.type === 'pdf';

  useEffect(() => {
    if (file && isText) {
      setLoading(true);
      let fetchUrl = file.url;
      if (!fetchUrl.startsWith('http') && !fetchUrl.startsWith('/api') && !fetchUrl.startsWith('blob:')) {
        fetchUrl = `/api/codex/fs/file?path=${encodeURIComponent(file.url)}`;
      }
      
      fetch(fetchUrl)
        .then(res => res.text())
        .then(text => setContent(text))
        .finally(() => setLoading(false));
    }
  }, [file, isText]);

  if (!file) return null;

  const getMediaUrl = () => {
    let url = file.url;
    if (!url.startsWith('http') && !url.startsWith('/api') && !url.startsWith('blob:')) {
       url = `/api/codex/fs/file?path=${encodeURIComponent(file.url)}`;
    }
    return url;
  };

  if (isPdf) {
    return (
      <div className={styles.container}>
        <iframe className={styles.iframe} src={getMediaUrl()} title="PDF Preview" />
      </div>
    );
  }

  if (isImage) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <img alt={file.title} src={getMediaUrl()} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
    );
  }

  if (isText) {
    return (
      <div className={styles.container}>
        {loading ? (
          <div style={{ padding: 16, opacity: 0.5 }}>加载中...</div>
        ) : (
          <div className={styles.textPreview}>{content}</div>
        )}
      </div>
    );
  }

  // Fallback for pptx, docx, etc.
  return (
    <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-description)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
        <div>不支持直接预览格式: <b>.{file.type}</b></div>
        <div style={{ marginTop: 8, fontSize: 12 }}>您可以在本地应用中打开该文件 ({file.title})</div>
      </div>
    </div>
  );
});

export default DocumentPreviewer;
