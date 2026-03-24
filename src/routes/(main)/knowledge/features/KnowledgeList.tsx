'use client';

import { Center, Empty } from '@lobehub/ui';
import { Badge, Input, Segmented, Skeleton, Typography } from 'antd';
import { createStaticStyles } from 'antd-style';
import { LibraryBigIcon, ListFilter, Search } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import useSWR from 'swr';

import { antigravityKnowledgeService } from '@/services/antigravityKnowledge';
import { AntigravityKnowledgeBaseItem } from '@/types/antigravityKnowledge';

import KnowledgeItem from './KnowledgeItem';

const styles = createStaticStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  `,
  controls: css`
    display: flex;
    gap: 12px;
    align-items: center;
    flex: 1;
    max-width: 600px;
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 16px;
    align-items: start;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  `,
}));

type FilterType = 'all' | 'recent' | 'stale';

const KnowledgeList = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const { data, isLoading } = useSWR<AntigravityKnowledgeBaseItem[]>(
    'getAntigravityKnowledgeBases',
    () => antigravityKnowledgeService.getKnowledgeBaseList(),
  );

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(term) || item.summary.toLowerCase().includes(term);

      const timeDiff = Date.now() - item.updatedAt;
      const isRecent = timeDiff < 24 * 60 * 60 * 1000;
      const isStale = timeDiff > 7 * 24 * 60 * 60 * 1000;

      let matchesFilter = true;
      if (filter === 'recent') matchesFilter = isRecent;
      if (filter === 'stale') matchesFilter = isStale;

      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, filter]);

  if (isLoading) {
    return (
      <Center padding={48}>
        <Skeleton active />
        <br />
        <Skeleton active />
      </Center>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Center paddingBlock={48}>
        <Empty description="No local Antigravity knowledge bases found" icon={LibraryBigIcon} />
      </Center>
    );
  }

  const SegmentOptions = [
    { label: 'All Memory', value: 'all' },
    { label: <Badge color="green" text="Recent (<24h)" />, value: 'recent' },
    { label: <Badge color="orange" text="Stale (>7d)" />, value: 'stale' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Antigravity Knowledge Workspace
        </Typography.Title>
        <div className={styles.controls}>
          <Input
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or summary..."
            prefix={<Search size={16} />}
            style={{ flex: 1 }}
            value={searchTerm}
          />
          <Segmented
            onChange={(val) => setFilter(val as FilterType)}
            options={SegmentOptions}
            value={filter}
          />
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className={styles.grid}>
          {filteredData.map((item) => (
            <KnowledgeItem key={item.id} knowledge={item} />
          ))}
        </div>
      ) : (
        <Center paddingBlock={48}>
          <Empty
            description={`No results found for "${searchTerm}" or current filters.`}
            icon={ListFilter}
          />
        </Center>
      )}
    </div>
  );
});

export default KnowledgeList;
