import { ActionIcon } from '@lobehub/ui';
import { ListTodo } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatInputStore } from '../../store';

const PlanMode = memo(() => {
  const { t } = useTranslation('chat');
  const [isPlanMode, togglePlanMode] = useChatInputStore((s) => [s.isPlanMode, s.togglePlanMode]);

  return (
    <ActionIcon
      active={isPlanMode}
      icon={ListTodo}
      onClick={() => togglePlanMode()}
      placement={'bottom'}
      title={t('input.planMode', 'Plan Mode')}
    />
  );
});

PlanMode.displayName = 'PlanModeAction';

export default PlanMode;
