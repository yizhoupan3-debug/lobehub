import type { BuiltinRenderProps } from '@lobechat/types';
import { ActionIcon, Flexbox, Highlighter, Skeleton } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Play, Sparkles } from 'lucide-react';
import React, { memo } from 'react';

const useStyles = createStyles(({ css, token }) => ({
  card: css`
    position: relative;
    overflow: hidden;
    padding: 16px;
    border-radius: 16px;
    background: linear-gradient(145deg, ${token.colorFillTertiary}, ${token.colorFillQuaternary});
    border: 1px solid ${token.colorBorderSecondary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
      border-color: ${token.colorPrimaryBorder};
    }
    
    a {
      color: inherit;
    }
  `,
  glow: css`
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    background: ${token.colorPrimary};
    filter: blur(50px);
    opacity: 0.15;
    border-radius: 50%;
    animation: pulse 4s ease-in-out infinite alternate;
    pointer-events: none;
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0.25;
      }
    }
  `,
  header: css`
    font-size: 16px;
    font-weight: 600;
    color: ${token.colorText};
    letter-spacing: 0.5px;
  `,
  tag: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 12px;
    background: ${token.colorSuccessBg};
    color: ${token.colorSuccess};
    border: 1px solid ${token.colorSuccessBorder};
  `,
  rrule: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 12px;
    background: ${token.colorFillSecondary};
    color: ${token.colorTextSecondary};
  `,
  promptBox: css`
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid ${token.colorBorderSecondary};
    background: ${token.colorBgContainer};
  `
}));

interface CreateAutomationArgs {
  id: string;
  name: string;
  prompt: string;
  rrule: string;
  status: string;
}

const CreateAutomation = memo<BuiltinRenderProps<CreateAutomationArgs>>(({ args }) => {
  const { styles, theme } = useStyles();

  if (!args) return <Skeleton active />;

  const { name, prompt, rrule, status } = args;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Flexbox className={styles.card} gap={16}>
        <div className={styles.glow} />
        
        <Flexbox horizontal align={'center'} justify={'space-between'}>
          <Flexbox horizontal align={'center'} gap={8}>
            <Sparkles size={20} style={{ color: theme.colorPrimary }} />
            <span className={styles.header}>{name || 'New Automation'}</span>
          </Flexbox>
          
          <Flexbox horizontal align={'center'} gap={8} style={{ zIndex: 1 }}>
            <div className={styles.tag}>
              <Play size={12} />
              {status || 'ACTIVE'}
            </div>
            {rrule && (
              <div className={styles.rrule}>
                <Clock size={12} />
                {rrule}
              </div>
            )}
            <a href="/automation" target="_blank" rel="noreferrer" title="View in Dashboard">
              <ActionIcon icon={ArrowUpRight} size="small" />
            </a>
          </Flexbox>
        </Flexbox>

        {prompt && (
          <motion.div 
            className={styles.promptBox}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Highlighter
              wrap
              language="markdown"
              showLanguage={false}
              style={{ maxHeight: 240, overflow: 'auto', background: 'transparent' }}
              variant="borderless"
            >
              {prompt}
            </Highlighter>
          </motion.div>
        )}
      </Flexbox>
    </motion.div>
  );
});

export default CreateAutomation;
