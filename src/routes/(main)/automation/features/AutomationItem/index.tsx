import { Button,Card, Space, Tag, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Bot, Box,Calendar, Code, Play, Sparkles } from 'lucide-react';
import { memo } from 'react';

import type { AutomationTask } from '@/services/automation';

const { Text, Paragraph } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  card: css`
    cursor: default;

    position: relative;

    overflow: hidden;

    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 20px;

    background: linear-gradient(
      145deg,
      ${token.colorBgContainerBase || token.colorBgContainer} 0%,
      ${token.colorBgElevated} 100%
    );
    box-shadow: 0 4px 20px rgb(0 0 0 / 5%);

    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &::before {
      content: '';

      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;

      height: 4px;

      opacity: 0;
      background: linear-gradient(90deg, #ff007f, #7928ca, #0070f3);

      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-6px);
      border-color: transparent;
      box-shadow: 0 12px 30px rgb(0 0 0 / 10%);

      &::before {
        opacity: 1;
      }

      .hover-action {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  header: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-block-end: 16px;
  `,
  titleGroup: css`
    display: flex;
    gap: 12px;
    align-items: center;
  `,
  iconWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 48px;
    height: 48px;
    border-radius: 12px;

    color: ${token.colorPrimary};

    background: linear-gradient(135deg, ${token.colorPrimaryBg}, ${token.colorPrimaryBgHover});
  `,
  title: css`
    margin: 0 !important;

    font-size: 18px !important;
    font-weight: 700 !important;

    background: linear-gradient(45deg, ${token.colorText}, ${token.colorTextSecondary});
    background-clip: text;

    -webkit-text-fill-color: transparent;
  `,
  body: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  prompt: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;

    margin: 0 !important;

    font-size: 14px;
    line-height: 1.6;
    color: ${token.colorTextSecondary};
  `,
  sectionRow: css`
    display: flex;
    gap: 8px;
    align-items: center;

    font-size: 13px;
    color: ${token.colorTextTertiary};
  `,
  actionOverlay: css`
    position: absolute;
    inset-block-end: 20px;
    inset-inline-end: 20px;
    transform: translateY(10px);

    opacity: 0;

    transition: all 0.3s ease;
  `,
}));

export interface AutomationItemProps {
  task: AutomationTask;
}

const AutomationItem = memo<AutomationItemProps>(({ task }) => {
  const { styles, theme } = useStyles();

  const isStatusActive = task.status === 'ACTIVE';

  return (
    <Card bodyStyle={{ padding: '24px' }} bordered={false} className={styles.card}>
      {/* Header Area */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconWrapper}>
            <Bot size={24} strokeWidth={2.5} />
          </div>
          <div>
            <Typography.Title className={styles.title} level={4}>
              {task.name}
            </Typography.Title>
            <Space size={4} style={{ marginTop: 4 }}>
              <Tag bordered={false} color={isStatusActive ? 'processing' : 'default'}>
                {task.status}
              </Tag>
              {task.model && (
                <Tag bordered={false} color="purple" icon={<Sparkles size={12} style={{ marginRight: 4 }} />}>
                  {task.model}
                </Tag>
              )}
            </Space>
          </div>
        </div>
      </div>

      {/* Body Area */}
      <div className={styles.body}>
        <Paragraph className={styles.prompt}>{task.prompt}</Paragraph>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <div className={styles.sectionRow}>
            <Calendar size={14} />
            <Text style={{ fontSize: 13 }} type="secondary">Schedule: {task.rrule || 'No Schedule'}</Text>
          </div>
          
          <div className={styles.sectionRow}>
            <Box size={14} />
            <Text style={{ fontSize: 13 }} type="secondary">Env: {task.execution_environment}</Text>
          </div>

          <div className={styles.sectionRow}>
            <Code size={14} />
            <Text style={{ fontSize: 13 }} type="secondary">
              CWDs: {task.cwds && task.cwds.length > 0 ? task.cwds.length + ' registered' : 'None'}
            </Text>
          </div>
        </div>
      </div>

      <div className={`${styles.actionOverlay} hover-action`}>
        <Button 
          icon={<Play size={16} />} 
          shape="round" 
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} 
          type="primary"
        >
          Run Now
        </Button>
      </div>
    </Card>
  );
});

AutomationItem.displayName = 'AutomationItem';
export default AutomationItem;
