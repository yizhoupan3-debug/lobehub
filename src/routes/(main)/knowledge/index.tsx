'use client';

import { useTranslation } from 'react-i18next';

import SettingHeader from '@/routes/(main)/settings/features/SettingHeader';

import KnowledgeList from './features/KnowledgeList';

const Page = () => {
  const { t } = useTranslation('setting');

  return (
    <>
      <SettingHeader title={t('tab.knowledge', '知识库')} />
      <KnowledgeList />
    </>
  );
};

Page.displayName = 'KnowledgeBasePage';

export default Page;
