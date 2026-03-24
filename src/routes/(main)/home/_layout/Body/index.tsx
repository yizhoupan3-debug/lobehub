'use client';

import { Accordion, Flexbox } from '@lobehub/ui';
import { memo } from 'react';

import { useHomeStore } from '@/store/home';

import Agent from './Agent';
import BottomMenu from './BottomMenu';
import WorkspaceSidebar from './WorkspaceSidebar';

export enum GroupKey {
  Agent = 'agent',
  Project = 'project',
}

const Body = memo(() => {
  const sidebarMode = useHomeStore((s) => s.sidebarMode);

  return (
    <Flexbox flex={1} justify={'space-between'} paddingInline={4} style={{ overflow: 'hidden' }}>
      {sidebarMode === 'workspace' ? (
        // Cursor-style workspace + thread view
        <WorkspaceSidebar />
      ) : (
        // Default session history view
        <Accordion defaultExpandedKeys={[GroupKey.Project, GroupKey.Agent]} gap={8}>
          <Agent itemKey={GroupKey.Agent} />
        </Accordion>
      )}
      <BottomMenu />
    </Flexbox>
  );
});

export default Body;
