import { type MarkdownProps } from '@lobehub/ui';
import { Markdown } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo } from 'react';

import { useUserStore } from '@/store/user';
import { userGeneralSettingsSelectors } from '@/store/user/selectors';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  antigravityMarkdown: css`
    /* Task List Checkboxes */
    li.task-list-item {
      display: flex;
      gap: 8px;
      align-items: flex-start;

      margin-block-end: 6px;

      list-style-type: none;
    }
    
    li.task-list-item input[type="checkbox"] {
      cursor: pointer;

      display: grid;
      place-content: center;

      width: 16px;
      height: 16px;
      margin-block-start: 4px;
      border: 1px solid ${token.colorBorder};
      border-radius: 4px;

      appearance: none;
      background: ${token.colorBgContainer};

      transition: all 0.2s ease;
    }

    li.task-list-item input[type="checkbox"]::before {
      content: "";

      transform-origin: center;
      transform: scale(0);

      width: 10px;
      height: 10px;

      background-color: ${token.colorTextLightSolid};
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      box-shadow: inset 1em 1em ${token.colorTextLightSolid};

      transition: 120ms transform ease-in-out;
    }

    li.task-list-item input[type="checkbox"]:checked {
      border-color: ${token.colorPrimary};
      background-color: ${token.colorPrimary};
    }

    li.task-list-item input[type="checkbox"]:checked::before {
      transform: scale(1);
    }

    /* GitHub style Alerts / Blockquotes */
    blockquote,
    .markdown-alert {
      margin-block: 16px;
      padding-block: 12px;
      padding-inline: 16px;
      border-inline-start: 3px solid var(--color-border);
      border-radius: 4px;

      color: var(--color-text-secondary);

      background-color: ${isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
    }

    blockquote p,
    .markdown-alert p {
      margin-block-end: 0;
    }

    .markdown-alert > p:first-child {
      display: flex;
      align-items: center;
      margin-block-end: 4px;
      font-weight: 600;
    }

    .markdown-alert-note {
      border-inline-start-color: #0969da;
      background-color: ${isDarkMode ? 'rgba(9,105,218,0.1)' : 'rgba(9,105,218,0.05)'};
    }
    .markdown-alert-note > p:first-child { color: #0969da; }
    
    .markdown-alert-tip {
      border-inline-start-color: #1a7f37;
      background-color: ${isDarkMode ? 'rgba(26,127,55,0.1)' : 'rgba(26,127,55,0.05)'};
    }
    .markdown-alert-tip > p:first-child { color: #1a7f37; }

    .markdown-alert-important {
      border-inline-start-color: #8250df;
      background-color: ${isDarkMode ? 'rgba(130,80,223,0.1)' : 'rgba(130,80,223,0.05)'};
    }
    .markdown-alert-important > p:first-child { color: #8250df; }

    .markdown-alert-warning {
      border-inline-start-color: #9a6700;
      background-color: ${isDarkMode ? 'rgba(154,103,0,0.1)' : 'rgba(154,103,0,0.05)'};
    }
    .markdown-alert-warning > p:first-child { color: #9a6700; }

    .markdown-alert-caution {
      border-inline-start-color: #d1242f;
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
      className={className}
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
      {...rest}
    >
      {children}
    </Markdown>
    </div>
  );
});

export default MarkdownMessage;
