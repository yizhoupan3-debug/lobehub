'use client';

import { Flexbox } from '@lobehub/ui';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import InputArea from './InputArea';
import WelcomeText from './WelcomeText';

const Home = memo(() => {
  const { i18n } = useTranslation();

  // eslint-disable-next-line @eslint-react/no-nested-component-definitions
  const Welcome = useCallback(() => <WelcomeText />, [i18n.language]);

  return (
    <Flexbox gap={40}>
      <Welcome />
      <InputArea />
    </Flexbox>
  );
});

export default Home;
