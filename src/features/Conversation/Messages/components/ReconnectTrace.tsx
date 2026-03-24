import { ActionIcon, Flexbox } from '@lobehub/ui';
import { AnimatePresence,motion } from 'framer-motion';
import { Activity,ChevronDown, ChevronRight, Wifi } from 'lucide-react';
import { memo, useState } from 'react';

import { Markdown } from '@/components/Markdown';

interface ReconnectTraceProps {
  traces: string[];
}

const ReconnectTrace = memo<ReconnectTraceProps>(({ traces }) => {
  const [expanded, setExpanded] = useState(false);

  if (!traces || traces.length === 0) return null;

  return (
    <Flexbox
      gap={8}
      style={{
        padding: '2px', // Thin border space
        background: 'linear-gradient(145deg, var(--color-fill-tertiary), var(--color-fill-quaternary))',
        borderRadius: 12,
        fontSize: 14,
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
      }}
    >
      <Flexbox
        horizontal
        align={'center'}
        gap={12}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          userSelect: 'none',
          color: expanded ? 'var(--color-primary)' : 'var(--color-text-secondary)',
          background: 'var(--color-bg-layout)',
          borderRadius: 10,
          transition: 'all 0.2s ease-in-out',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <ActionIcon
          icon={expanded ? ChevronDown : ChevronRight}
          size={{ blockSize: 24, fontSize: 16 }}
        />
        <motion.div
          animate={expanded ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Wifi size={18} />
        </motion.div>
        
        <Flexbox horizontal align={'center'} gap={8} style={{ flex: 1 }}>
          <span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>
            {(() => {
              const lastTrace = traces.at(-1);
              const errorMatch = lastTrace?.match(/error[:：\s]+(.*)/i) || lastTrace?.match(/失败[:：\s]+(.*)/);
              if (errorMatch) {
                return `Error: ${errorMatch[1]}`;
              }
              return `Reconnecting... ${traces.length}/5`;
            })()}
          </span>
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
            <Flexbox gap={12} style={{ padding: '12px 16px' }}>
              {traces.map((trace, index) => (
                <motion.div
                  animate={{ x: 0, opacity: 1 }}
                  initial={{ x: -10, opacity: 0 }}
                  key={index}
                  transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                >
                  <Flexbox
                    style={{
                      padding: '12px 16px',
                      backgroundColor: 'var(--color-fill-secondary)',
                      borderRadius: 8,
                      borderLeft: '3px solid var(--color-primary)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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

export default ReconnectTrace;
