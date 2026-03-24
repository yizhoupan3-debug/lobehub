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
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 16px;

    background: linear-gradient(145deg, ${token.colorFillTertiary}, ${token.colorFillQuaternary});
    box-shadow: 0 4px 12px rgb(0 0 0 / 5%);

    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: ${token.colorPrimaryBorder};
      box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
    }
    
    a {
      color: inherit;
    }
  `,
  glow: css`
    pointer-events: none;

    position: absolute;
    inset-block-start: -20px;
    inset-inline-end: -20px;

    width: 100px;
    height: 100px;
    border-radius: 50%;

    opacity: 0.15;
    background: ${token.colorPrimary};
    filter: blur(50px);

    animation: pulse 4s ease-in-out infinite alternate;
    
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
    gap: 4px;
    align-items: center;

    padding-block: 2px;
    padding-inline: 8px;
    border: 1px solid ${token.colorSuccessBorder};
    border-radius: 12px;

    font-size: 12px;
    font-weight: 500;
    color: ${token.colorSuccess};

    background: ${token.colorSuccessBg};
  `,
  rrule: css`
    display: inline-flex;
    gap: 4px;
    align-items: center;

    padding-block: 2px;
    padding-inline: 8px;
    border-radius: 12px;

    font-size: 12px;
    font-weight: 500;
    color: ${token.colorTextSecondary};

    background: ${token.colorFillSecondary};
  `,
  promptBox: css`
    overflow: hidden;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 8px;
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
      animate={{ opacity: 1, scale: 1, y: 0 }}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
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
            <a href="/automation" rel="noreferrer" target="_blank" title="View in Dashboard">
              <ActionIcon icon={ArrowUpRight} size="small" />
            </a>
          </Flexbox>
        </Flexbox>

        {prompt && (
          <motion.div 
            animate={{ opacity: 1, y: 0 }}
            className={styles.promptBox}
            initial={{ opacity: 0, y: 10 }}
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
