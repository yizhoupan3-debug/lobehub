import { memo } from 'react';
import { Skeleton, Empty } from 'antd';
import { createStyles } from 'antd-style';
import { useCodexAutomations } from '@/services/automation';
import AutomationItem from '../AutomationItem';

const useStyles = createStyles(({ css }) => ({
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    width: 100%;
    margin-top: 24px;
    padding-bottom: 40px;
  `,
  emptyWrapper: css`
    margin-top: 60px;
    padding: 60px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.02);
  `
}));

const AutomationList = memo(() => {
  const { styles } = useStyles();
  const { automations, isLoading, isError } = useCodexAutomations();

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton.Button key={i} active style={{ height: 280, width: '100%', borderRadius: 20 }} />
        ))}
      </div>
    );
  }

  if (isError || !automations || automations.length === 0) {
    return (
      <div className={styles.emptyWrapper}>
        <Empty 
          description={isError ? "Failed to load automations." : "No Codex automations found. Create one in your ~/.codex/automations folder."} 
        />
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {automations.map((task) => (
        <AutomationItem key={task.id} task={task} />
      ))}
    </div>
  );
});

AutomationList.displayName = 'AutomationList';
export default AutomationList;
