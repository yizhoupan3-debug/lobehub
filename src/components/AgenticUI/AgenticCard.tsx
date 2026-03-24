import { Flexbox, Icon } from '@lobehub/ui';
import { cx } from 'antd-style';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo, ReactNode, useState } from 'react';

import { useChatStore } from '@/store/chat';
import { AgenticAstParser } from './AgenticAstParser';
import { useStyles } from './style';

export interface AgenticCardProps {
  id: string;
  icon: any;
  iconColor: string;
  title: string;
  status: string;
  tagType: string;
  children?: ReactNode;
}

export const AgenticCard = memo<AgenticCardProps>(({ id, iconColor, title, status, tagType, children }) => {
  const { styles } = useStyles();
  const [expanded, setExpanded] = useState(true);
  const openArtifact = useChatStore((s) => s.openArtifact);

  const strContent = ((children as string) || '').toString?.();

  const handleOpenArtifact = () => {
    openArtifact({
      id,
      identifier: `agentic-${tagType}`,
      title: title || tagType,
      type: 'text/markdown',
    });
  };

  return (
    <div className={styles.container}>
      <Flexbox
        className={styles.header}
        onClick={handleOpenArtifact}
      >
        <Flexbox style={{ flex: 1 }}>
          <div className={styles.titleRow}>
            <span className={styles.titleText}>{title}</span>
          </div>
          <div className={styles.statusText}>{status}</div>
        </Flexbox>
      </Flexbox>

      {expanded && children && (
        <div className={cx(styles.markdownContainer, 'markdown-body')}>
          <AgenticAstParser content={strContent} />
        </div>
      )}

      {/* 底部 Footer 栏：Edited Task 与 收起/展开按钮 */}
      <div className={styles.footer} onClick={() => setExpanded(!expanded)}>
        <Flexbox horizontal align={'center'} gap={8}>
          <Icon icon={ChevronRight} style={{ fontSize: 14 }} />
          <span>Edited <b>{title.split(' ')[0] || 'Task'}</b></span>
        </Flexbox>

        <div className="footer-btn">
          <Icon
            icon={ChevronDown}
            style={{
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--color-text-tertiary)',
            }}
          />
        </div>
      </div>
    </div>
  );
});
