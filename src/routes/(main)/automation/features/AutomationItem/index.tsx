import { memo } from 'react';
import { Card, Typography, Tag, Space, Button } from 'antd';
import { createStyles } from 'antd-style';
import { Bot, Calendar, Sparkles, Play, Code, Box } from 'lucide-react';
import { AutomationTask } from '@/services/automation';

const { Text, Paragraph } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  card: css`
    position: relative;
    border-radius: 20px;
    background: linear-gradient(
      145deg,
      ${token.colorBgContainerBase || token.colorBgContainer} 0%,
      ${token.colorBgElevated} 100%
    );
    border: 1px solid ${token.colorBorderSecondary};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: default;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ff007f, #7928ca, #0070f3);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
      border-color: transparent;

      &::before {
        opacity: 1;
      }

      .hover-action {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  `,
  titleGroup: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,
  iconWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, ${token.colorPrimaryBg}, ${token.colorPrimaryBgHover});
    color: ${token.colorPrimary};
  `,
  title: css`
    font-size: 18px !important;
    font-weight: 700 !important;
    margin: 0 !important;
    background: -webkit-linear-gradient(45deg, ${token.colorText}, ${token.colorTextSecondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `,
  body: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  prompt: css`
    margin: 0 !important;
    color: ${token.colorTextSecondary};
    font-size: 14px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,
  sectionRow: css`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${token.colorTextTertiary};
    font-size: 13px;
  `,
  actionOverlay: css`
    position: absolute;
    bottom: 20px;
    right: 20px;
    opacity: 0;
    transform: translateY(10px);
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
    <Card bordered={false} className={styles.card} bodyStyle={{ padding: '24px' }}>
      {/* Header Area */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconWrapper}>
            <Bot size={24} strokeWidth={2.5} />
          </div>
          <div>
            <Typography.Title level={4} className={styles.title}>
              {task.name}
            </Typography.Title>
            <Space size={4} style={{ marginTop: 4 }}>
              <Tag color={isStatusActive ? 'processing' : 'default'} bordered={false}>
                {task.status}
              </Tag>
              {task.model && (
                <Tag color="purple" bordered={false} icon={<Sparkles size={12} style={{ marginRight: 4 }} />}>
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
            <Text type="secondary" style={{ fontSize: 13 }}>Schedule: {task.rrule || 'No Schedule'}</Text>
          </div>
          
          <div className={styles.sectionRow}>
            <Box size={14} />
            <Text type="secondary" style={{ fontSize: 13 }}>Env: {task.execution_environment}</Text>
          </div>

          <div className={styles.sectionRow}>
            <Code size={14} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              CWDs: {task.cwds && task.cwds.length > 0 ? task.cwds.length + ' registered' : 'None'}
            </Text>
          </div>
        </div>
      </div>

      <div className={`${styles.actionOverlay} hover-action`}>
        <Button 
          type="primary" 
          shape="round" 
          icon={<Play size={16} />} 
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          Run Now
        </Button>
      </div>
    </Card>
  );
});

AutomationItem.displayName = 'AutomationItem';
export default AutomationItem;
