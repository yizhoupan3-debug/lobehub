import { type MarkdownProps } from '@lobehub/ui';
import { Markdown } from '@lobehub/ui';
import { memo } from 'react';

import { useUserStore } from '@/store/user';
import { userGeneralSettingsSelectors } from '@/store/user/selectors';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  antigravityMarkdown: css`
    /* Task List Checkboxes */
    li.task-list-item {
      list-style-type: none;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
    }
    
    li.task-list-item input[type="checkbox"] {
      appearance: none;
      margin-top: 4px;
      width: 16px;
      height: 16px;
      border: 1px solid ${token.colorBorder};
      border-radius: 4px;
      display: grid;
      place-content: center;
      transition: all 0.2s ease;
      background: ${token.colorBgContainer};
      cursor: pointer;
    }

    li.task-list-item input[type="checkbox"]::before {
      content: "";
      width: 10px;
      height: 10px;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em ${token.colorTextLightSolid};
      background-color: ${token.colorTextLightSolid};
      transform-origin: center;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }

    li.task-list-item input[type="checkbox"]:checked {
      background-color: ${token.colorPrimary};
      border-color: ${token.colorPrimary};
    }

    li.task-list-item input[type="checkbox"]:checked::before {
      transform: scale(1);
    }

    /* GitHub style Alerts / Blockquotes */
    blockquote,
    .markdown-alert {
      padding: 12px 16px;
      margin-top: 16px;
      margin-bottom: 16px;
      border-left: 3px solid var(--color-border);
      background-color: ${isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
      border-radius: 4px;
      color: var(--color-text-secondary);
    }
    blockquote p,
    .markdown-alert p {
      margin-bottom: 0;
    }
    .markdown-alert > p:first-child {
      display: flex;
      align-items: center;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .markdown-alert-note {
      border-left-color: #0969da;
      background-color: ${isDarkMode ? 'rgba(9,105,218,0.1)' : 'rgba(9,105,218,0.05)'};
    }
    .markdown-alert-note > p:first-child { color: #0969da; }
    
    .markdown-alert-tip {
      border-left-color: #1a7f37;
      background-color: ${isDarkMode ? 'rgba(26,127,55,0.1)' : 'rgba(26,127,55,0.05)'};
    }
    .markdown-alert-tip > p:first-child { color: #1a7f37; }

    .markdown-alert-important {
      border-left-color: #8250df;
      background-color: ${isDarkMode ? 'rgba(130,80,223,0.1)' : 'rgba(130,80,223,0.05)'};
    }
    .markdown-alert-important > p:first-child { color: #8250df; }

    .markdown-alert-warning {
      border-left-color: #9a6700;
      background-color: ${isDarkMode ? 'rgba(154,103,0,0.1)' : 'rgba(154,103,0,0.05)'};
    }
    .markdown-alert-warning > p:first-child { color: #9a6700; }

    .markdown-alert-caution {
      border-left-color: #d1242f;
      background-color: ${isDarkMode ? 'rgba(209,36,47,0.1)' : 'rgba(209,36,47,0.05)'};
    }
    .markdown-alert-caution > p:first-child { color: #d1242f; }
  `,
}));

const MarkdownMessage = memo<MarkdownProps>(({ children, componentProps, className, style, ...rest }) => {
  const { highlighterTheme, mermaidTheme, fontSize } = useUserStore(
    userGeneralSettingsSelectors.config,
  );
  const { styles } = useStyles();

  return (
    <div className={styles.antigravityMarkdown} style={style}>
      <Markdown
      fontSize={fontSize}
      variant={'chat'}
      componentProps={{
        ...componentProps,
        highlight: {
          fullFeatured: true,
          theme: highlighterTheme,
          ...componentProps?.highlight,
        },
        mermaid: { fullFeatured: false, theme: mermaidTheme, ...componentProps?.mermaid },
      }}
      className={className}
      {...rest}
    >
      {children}
    </Markdown>
    </div>
  );
});

export default MarkdownMessage;
