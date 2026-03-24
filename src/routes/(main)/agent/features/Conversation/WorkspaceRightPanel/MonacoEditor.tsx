'use client';

import { ActionIcon } from '@lobehub/ui';
import Editor from '@monaco-editor/react';
import { createStyles } from 'antd-style';
import { Save } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    position: relative;

    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
  `,
  actions: css`
    position: absolute;
    z-index: 10;
    inset-block-end: 16px;
    inset-inline-end: 24px;

    display: flex;
    gap: 8px;
    align-items: center;

    padding: 6px;
    border: 1px solid ${token.colorBorder};
    border-radius: 8px;

    background: ${token.colorBgElevated};
    box-shadow: ${token.boxShadowSecondary};
  `,
  saving: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
  `,
}));

interface MonacoEditorProps {
  filePath: string;
  initialValue: string;
  language: string;
  onSave?: (content: string) => Promise<void>;
}

const MonacoEditor = memo<MonacoEditorProps>(({ filePath, initialValue, language, onSave }) => {
  const { styles, theme } = useStyles();
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Sync when initial value changes (e.g. file switched)
  useEffect(() => {
    setValue(initialValue);
    setIsDirty(false);
  }, [initialValue]);

  const handleSave = useCallback(async () => {
    if (!onSave || !isDirty) return;
    setIsSaving(true);
    try {
      await onSave(value);
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to save file:', err);
    } finally {
      setIsSaving(false);
    }
  }, [value, onSave, isDirty]);

  // Handle Command+S / Ctrl+S
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isDarkMode = theme.appearance === 'dark';

  return (
    <div className={styles.container}>
      {isDirty && (
        <div className={styles.actions}>
          {isSaving ? (
            <span className={styles.saving}>保存中...</span>
          ) : (
            <>
              <span className={styles.saving}>未保存</span>
              <ActionIcon icon={Save} title="保存 (Cmd+S)" onClick={handleSave} />
            </>
          )}
        </div>
      )}
      <Editor
        defaultLanguage={language}
        height="100%"
        language={language}
        path={filePath} // Helps Monaco understand file context
        theme={isDarkMode ? 'vs-dark' : 'light'}
        value={value}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: 'SF Mono, Consolas, Courier New, monospace',
          padding: { top: 16 },
          readOnly: !onSave,
        }}
        onChange={(val) => {
          if (val !== undefined) {
            setValue(val);
            if (val !== initialValue) {
              setIsDirty(true);
            } else {
              setIsDirty(false);
            }
          }
        }}
      />
    </div>
  );
});

export default MonacoEditor;
