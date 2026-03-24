'use client';

import { CURRENT_ONBOARDING_VERSION } from '@lobechat/const';
import { type LobeUser } from '@lobechat/types';
import { type PropsWithChildren } from 'react';
import { memo } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { useUserStore } from '@/store/user';

const LOCAL_NO_AUTH_USER: LobeUser = {
  email: 'local-no-auth@localhost',
  fullName: 'Local User',
  id: 'local-dev-user',
  username: 'local',
};

const NoAuthProvider = memo<PropsWithChildren>(({ children }) => {
  const useStoreUpdater = createStoreUpdater(useUserStore);

  useStoreUpdater('isLoaded', true);
  useStoreUpdater('isOnboard', true);
  useStoreUpdater('isSignedIn', true);
  useStoreUpdater('isUserStateInit', true);
  useStoreUpdater('onboarding', {
    finishedAt: '2026-03-24T00:00:00.000Z',
    version: CURRENT_ONBOARDING_VERSION,
  });
  useStoreUpdater('user', LOCAL_NO_AUTH_USER);

  return children;
});

export default NoAuthProvider;
