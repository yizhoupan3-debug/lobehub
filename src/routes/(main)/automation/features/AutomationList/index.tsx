import { Empty,Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { memo } from 'react';

import { useCodexAutomations } from '@/services/automation';

import AutomationItem from '../AutomationItem';

const useStyles = createStyles(({ css }) => ({
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;

    width: 100%;
    margin-block-start: 24px;
    padding-block-end: 40px;
  `,
  emptyWrapper: css`
    margin-block-start: 60px;
    padding: 60px;
    border-radius: 20px;
    background: rgb(0 0 0 / 2%);
  `
}));

const AutomationList = memo(() => {
  const { styles } = useStyles();
  const { automations, isLoading, isError } = useCodexAutomations();

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton.Button active key={i} style={{ height: 280, width: '100%', borderRadius: 20 }} />
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
