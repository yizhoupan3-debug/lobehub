'use client';

import { ActionIcon, DropdownMenu, Flexbox } from '@lobehub/ui';
import { FolderTree, MoreHorizontal } from 'lucide-react';
import { memo } from 'react';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { useHomeStore } from '@/store/home';

import { useMenu } from './useMenu';

const HeaderActions = memo(() => {
  const { menuItems } = useMenu();
  const sidebarMode = useHomeStore((s) => s.sidebarMode);
  const isWorkspace = sidebarMode === 'workspace';
  
  const rightPanelMode = useGlobalStore((s) => s.status.workspaceRightPanelMode);
  const toggleTree = useGlobalStore((s) => s.toggleWorkspaceTree);

  return (
    <Flexbox horizontal align={'center'} gap={4}>
      {isWorkspace && (
        <ActionIcon 
          icon={FolderTree} 
          size={DESKTOP_HEADER_ICON_SIZE} 
          onClick={() => toggleTree()}
          title="切换文件目录树"
          active={rightPanelMode === 'tree'}
        />
      )}
      <DropdownMenu items={menuItems}>
        <ActionIcon icon={MoreHorizontal} size={DESKTOP_HEADER_ICON_SIZE} />
      </DropdownMenu>
    </Flexbox>
  );
});

HeaderActions.displayName = 'HeaderActions';

export default HeaderActions;
