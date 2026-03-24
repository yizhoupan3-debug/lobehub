import { ActionIcon, Flexbox } from '@lobehub/ui';
import { AnimatePresence,motion } from 'framer-motion';
import { Activity,ChevronDown, ChevronRight, Network } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Markdown } from '@/components/Markdown';

interface SubagentTraceProps {
  generating?: boolean;
  mode?: 'workspace' | 'session';
  traces: string[];
}

const SubagentTrace = memo<SubagentTraceProps>(({ traces, mode = 'session', generating = false }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation('chat');

  if (!traces || traces.length === 0) return null;

  return (
    <Flexbox
      style={{
        background: 'transparent',
        borderRadius: 8,
        fontSize: 13,
        border: '1px solid var(--color-border-secondary)',
        overflow: 'hidden',
        width: '100%',
        marginBottom: 8,
      }}
    >
      <Flexbox
        horizontal
        align={'center'}
        gap={8}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          userSelect: 'none',
          color: expanded ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
          background: 'transparent',
          borderBottom: expanded ? '1px solid var(--color-border-secondary)' : 'none',
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <ActionIcon
          icon={expanded ? ChevronDown : ChevronRight}
          size={{ blockSize: 24, fontSize: 16 }}
        />
        <motion.div
          animate={
            generating 
              ? { rotate: 360 } 
              : expanded ? { rotate: 360 } : { rotate: 0 }
          }
          transition={
            generating 
              ? { repeat: Infinity, duration: 2, ease: 'linear' } 
              : { duration: 0.5, ease: 'easeOut' }
          }
        >
          <Network size={18} />
        </motion.div>
        
        <Flexbox horizontal align={'center'} gap={8} style={{ flex: 1, fontFamily: 'var(--font-mono)' }}>
          <span style={{ fontWeight: 500, letterSpacing: '0.2px', fontSize: 13 }}>
            {traces.length > 1 ? `[ ${traces.length} Traces ]` : '> Subagent Trace'}
          </span>
          {!generating && (
            <motion.div
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
              }}
            />
          )}
          {expanded && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
            >
              <Activity size={14} style={{ color: 'var(--color-primary)' }} />
            </motion.div>
          )}
        </Flexbox>
      </Flexbox>

      <AnimatePresence>
        {expanded && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Flexbox gap={8} style={{ padding: '8px 12px' }}>
              {traces.map((trace, index) => (
                <motion.div
                  animate={{ x: 0, opacity: 1 }}
                  initial={{ x: -5, opacity: 0 }}
                  key={index}
                  transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                >
                  <Flexbox
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--color-fill-tertiary)',
                      borderRadius: 6,
                      borderLeft: '2px solid var(--color-border)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                    }}
                  >
                    <Markdown variant={'chat'}>{trace}</Markdown>
                  </Flexbox>
                </motion.div>
              ))}
            </Flexbox>
          </motion.div>
        )}
      </AnimatePresence>
    </Flexbox>
  );
});

export default SubagentTrace;
