import { Flexbox, ScrollShadow, TooltipGroup } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { type ReactNode } from 'react';
import { memo, Suspense } from 'react';

import SkeletonList, { SkeletonItem } from '@/features/NavPanel/components/SkeletonList';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    overflow: hidden;

    height: 100%;
    border-inline-end: 1px solid ${token.colorBorderSecondary};

    background: rgba(var(--lobe-background-rgb), 0.5); /* fallback */
    backdrop-filter: blur(16px) saturate(180%);

    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  `,
}));

interface SidebarLayoutProps {
  body?: ReactNode;
  header?: ReactNode;
}

const SideBarLayout = memo<SidebarLayoutProps>(({ header, body }) => {
  const { styles, theme } = useStyles();

  return (
    <Flexbox
      className={styles.container}
      gap={4}
      style={{ background: theme.isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)' }}
    >
      <Suspense fallback={<SkeletonItem height={44} style={{ marginTop: 8 }} />}>{header}</Suspense>
      <ScrollShadow size={2} style={{ height: '100%' }}>
        <TooltipGroup>
          <Suspense fallback={<SkeletonList paddingBlock={8} />}>{body}</Suspense>
        </TooltipGroup>
      </ScrollShadow>
    </Flexbox>
  );
});

export default SideBarLayout;
