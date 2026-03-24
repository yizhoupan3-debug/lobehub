import { createStyles } from 'antd-style';
import { Bot, Sparkles } from 'lucide-react';
import { memo } from 'react';

import AutomationList from './features/AutomationList';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    scroll-behavior: smooth;

    overflow: hidden auto;

    width: 100%;
    height: 100%;
    padding-block: 0;
    padding-inline: 40px;
  `,
  inner: css`
    max-width: 1200px;
    margin-block: 0;
    margin-inline: auto;
    padding-block-start: 60px;
  `,
  hero: css`
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 16px;

    margin-block-end: 24px;
    padding-block: 40px;
    padding-inline: 0;
    border-block-end: 1px solid ${token.colorBorderSecondary};
  `,
  heroBg: css`
    pointer-events: none;

    position: absolute;
    z-index: 0;
    inset-block-start: -50px;
    inset-inline-start: -50px;

    width: 300px;
    height: 300px;

    opacity: 0.1;
    background: radial-gradient(circle, ${token.colorPrimary} 0%, transparent 70%);
    filter: blur(40px);
  `,
  titleWrapper: css`
    position: relative;
    z-index: 1;

    display: flex;
    gap: 16px;
    align-items: center;
  `,
  title: css`
    margin: 0;

    font-size: 36px;
    font-weight: 800;
    line-height: 1.2;
    color: ${token.colorText};
    letter-spacing: -0.5px;
  `,
  subtitle: css`
    position: relative;
    z-index: 1;

    max-width: 600px;

    font-size: 16px;
    line-height: 1.6;
    color: ${token.colorTextSecondary};
  `
}));

const AutomationPage = memo(() => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Dynamic & Premium Header */}
        <div className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.titleWrapper}>
            <Bot color="var(--lobe-color-primary)" size={40} strokeWidth={2.5} />
            <h1 className={styles.title}>Codex Automations</h1>
          </div>
          <p className={styles.subtitle}>
            Manage and monitor your self-hosted Codex autonomous routines. 
            All tasks are integrated natively with deep framework bindings and kernel-level task supervision.
            <Sparkles size={16} style={{ marginLeft: 8, display: 'inline-block', color: 'var(--lobe-color-warning)' }} />
          </p>
        </div>

        {/* Task Grid */}
        <AutomationList />
      </div>
    </div>
  );
});

AutomationPage.displayName = 'AutomationPage';
export default AutomationPage;
