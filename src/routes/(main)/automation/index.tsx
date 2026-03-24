import { memo } from 'react';
import { createStyles } from 'antd-style';
import { Bot, Sparkles } from 'lucide-react';

import AutomationList from './features/AutomationList';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 40px;
    scroll-behavior: smooth;
  `,
  inner: css`
    max-width: 1200px;
    margin: 0 auto;
    padding-top: 60px;
  `,
  hero: css`
    position: relative;
    padding: 40px 0;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  heroBg: css`
    position: absolute;
    top: -50px;
    left: -50px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, ${token.colorPrimary} 0%, transparent 70%);
    opacity: 0.1;
    filter: blur(40px);
    z-index: 0;
    pointer-events: none;
  `,
  titleWrapper: css`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 16px;
  `,
  title: css`
    font-size: 36px;
    font-weight: 800;
    line-height: 1.2;
    margin: 0;
    letter-spacing: -0.5px;
    color: ${token.colorText};
  `,
  subtitle: css`
    position: relative;
    z-index: 1;
    font-size: 16px;
    color: ${token.colorTextSecondary};
    max-width: 600px;
    line-height: 1.6;
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
            <Bot size={40} color="var(--lobe-color-primary)" strokeWidth={2.5} />
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
