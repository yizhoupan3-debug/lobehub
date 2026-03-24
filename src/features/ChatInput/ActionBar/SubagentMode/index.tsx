import { ActionIcon } from '@lobehub/ui';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatInputStore } from '../../store';

const SubagentMode = memo(() => {
  const { t } = useTranslation('chat');
  const [isSubagentMode, toggleSubagentMode] = useChatInputStore((s) => [
    s.isSubagentMode,
    s.toggleSubagentMode,
  ]);

  return (
    <motion.div
      animate={
        isSubagentMode
          ? { opacity: [1, 0.6, 1], scale: [1, 1.05, 1] }
          : { opacity: 1, scale: 1 }
      }
      transition={
        isSubagentMode
          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      <ActionIcon
        active={isSubagentMode}
        icon={Network}
        placement={'bottom'}
        title={t('input.subagentMode', 'Subagent Mode')}
        onClick={() => toggleSubagentMode()}
      />
    </motion.div>
  );
});

SubagentMode.displayName = 'SubagentModeAction';

export default SubagentMode;
