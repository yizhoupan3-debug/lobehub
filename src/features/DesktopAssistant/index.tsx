'use client';

import { Flexbox } from '@lobehub/ui';
import { useTheme } from 'antd-style';
import { useState } from 'react';

export const DesktopAssistant = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 16,
        fontFamily: 'SF Mono, Consolas, monospace',
      }}
    >
      {open && (
        <Flexbox
          gap={12}
          padding={16}
          style={{
            background: theme.colorBgElevated,
            border: `1px solid ${theme.colorText}`,
            width: 300,
            boxShadow: `4px 4px 0px 0px ${theme.colorText}`,
            color: theme.colorText,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
              borderBottom: `1px dashed ${theme.colorBorder}`,
              paddingBottom: 8,
            }}
          >
            SYSTEM.CODEX
          </div>
          <div style={{ fontSize: 13, lineHeight: '1.6', color: theme.colorText }}>
            &gt; Codex runtime initialized.
            <br />
            &gt; Awaiting instruction...
          </div>
        </Flexbox>
      )}

      <div
        style={{
          cursor: 'pointer',
          width: 48,
          height: 48,
          background: theme.colorText,
          color: theme.colorBgBase,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 18,
          transition: 'transform 0.1s ease',
          boxShadow: `4px 4px 0px 0px ${theme.colorText}40`,
          border: `2px solid ${theme.colorBgBase}`,
          transform: open ? 'translate(2px, 2px)' : 'none',
        }}
        onClick={() => setOpen(!open)}
      >
        CX
      </div>
    </div>
  );
};

export default DesktopAssistant;
