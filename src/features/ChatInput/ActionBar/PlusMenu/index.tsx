import { ActionIcon } from '@lobehub/ui';
import { Dropdown } from 'antd';
import { Plus, ListTodo, AtSign, Sparkles } from 'lucide-react';
import { memo } from 'react';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { useChatInputStore } from '../../store';

const PlusMenu = memo(() => {
  const { t } = useTranslation('chat');
  const [isPlanMode, togglePlanMode, editor] = useChatInputStore((s) => [
    s.isPlanMode,
    s.togglePlanMode,
    s.editor,
  ]);

  const items: MenuProps['items'] = [
    {
      key: 'planMode',
      icon: <ListTodo size={16} />,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {t('input.planMode', '计划模式')}
          {isPlanMode && <span style={{ color: 'var(--lobe-color-primary)' }}>✓</span>}
        </span>
      ),
      onClick: () => togglePlanMode(),
    },
    {
      type: 'divider',
    },
    {
      key: 'mention',
      icon: <AtSign size={16} />,
      label: '引用与提及 (@)',
      onClick: () => {
        if (editor) {
          editor.insertText('@');
          editor.focus();
        }
      },
    },
    {
      key: 'skill',
      icon: <Sparkles size={16} />,
      label: '调用技能 ($)',
      onClick: () => {
        if (editor) {
          editor.insertText('$');
          editor.focus();
        }
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="top" trigger={['click']}>
      <ActionIcon icon={Plus} placement="bottom" title="更多操作" />
    </Dropdown>
  );
});

PlusMenu.displayName = 'PlusMenu';

export default PlusMenu;
