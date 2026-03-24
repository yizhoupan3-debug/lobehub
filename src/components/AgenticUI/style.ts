import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cssVar, token }) => ({
  container: css`
    margin-block: 16px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: 12px;
    background: ${token.colorBgContainer};
    color: ${cssVar.colorText};
    overflow: hidden;
    font-family: var(--font-mono);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    &:hover {
      border-color: ${cssVar.colorBorderSecondary};
    }
  `,
  header: css`
    padding: 16px;
    background: ${cssVar.colorFillQuaternary};
    border-bottom: 1px solid ${cssVar.colorBorder};
  `,
  iconBox: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: ${cssVar.colorFillTertiary};
  `,
  titleRow: css`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  `,
  titleText: css`
    font-size: 16px;
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
  statusText: css`
    font-size: 13px;
    color: ${cssVar.colorTextSecondary};
    margin-top: 6px;
  `,
  markdownContainer: css`
    padding: 16px;
    background: ${token.colorBgLayout};

    .markdown-body {
      font-size: 13px;
    }
  `,
  footer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: ${cssVar.colorFillQuaternary};
    border-top: 1px solid ${cssVar.colorBorder};
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};

    .footer-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: ${cssVar.colorFillTertiary};
      transition: background 0.2s;

      &:hover {
        background: ${cssVar.colorFillSecondary};
        color: ${cssVar.colorText};
      }
    }
  `,

  /* AST Parser Styles */
  astContainer: css`
    font-size: 13px;
  `,
  taskTitle: css`
    font-size: 16px;
    font-weight: 700;
    color: ${cssVar.colorText};
    line-height: 1.4;
    margin-bottom: 6px;
  `,
  taskSummary: css`
    font-size: 14px;
    color: ${cssVar.colorTextSecondary};
    line-height: 1.6;
  `,
  divider: css`
    height: 1px;
    background: ${cssVar.colorBorderSecondary};
    margin: 16px 0;
  `,
  sectionBlock: css`
    display: flex;
    flex-direction: column;
  `,
  sectionTitle: css`
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  `,
  fileChip: css`
    padding: 6px 10px;
    border-radius: 6px;
    background: transparent;
    border: none;
    color: ${cssVar.colorTextSecondary};
    font-size: 13px;
    
    &:hover {
      background: ${cssVar.colorFillTertiary};
      color: ${cssVar.colorText};
    }
  `,
  collapseAllBtn: css`
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;

    &:hover {
      color: ${cssVar.colorText};
    }
  `,
  timelineRoot: css`
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: 4px;
  `,
  timelineItem: css`
    position: relative;
    padding-bottom: 20px;
  `,
  timelineLine: css`
    position: absolute;
    left: 10.5px;
    top: 24px;
    bottom: -4px;
    width: 1px;
    background: ${cssVar.colorBorder};
  `,
  timelineIndicator: css`
    position: absolute;
    left: 0;
    top: 0;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: ${cssVar.colorTextTertiary};
    z-index: 1;
  `,
  timelineContent: css`
    padding-left: 36px;
    padding-top: 2px;
  `,
  timelineTitle: css`
    font-weight: 600;
    line-height: 1.5;
    color: ${cssVar.colorText};
  `,
  timelineTitleHoverable: css`
    cursor: pointer;
    &:hover {
      color: var(--color-primary);
    }
  `,
  timelineDetail: css`
    margin-top: 8px;
    padding: 12px;
    border-radius: 8px;
    background: ${cssVar.colorFillQuaternary};
    border: 1px solid ${cssVar.colorBorder};
    font-size: 12px;
    color: ${cssVar.colorTextSecondary};
  `
}));
