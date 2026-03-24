'use client';

import type { BuiltinInspectorProps } from '@lobechat/types';
import { cx } from 'antd-style';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { inspectorTextStyles, shinyTextStyles } from '@/styles';

export const CreateAutomationInspector = memo<BuiltinInspectorProps<any>>(
  ({ args, partialArgs, isArgumentsStreaming }) => {
    const { t } = useTranslation('plugin');
    
    const name = args?.name || partialArgs?.name || '';

    if (isArgumentsStreaming && !name) {
      return (
        <div className={cx(inspectorTextStyles.root, shinyTextStyles.shinyText)}>
          <span>{t('builtins.lobe-local-system.apiName.createAutomation', { defaultValue: 'Creating Automation Task' })}</span>
        </div>
      );
    }

    return (
      <div
        className={cx(inspectorTextStyles.root, isArgumentsStreaming && shinyTextStyles.shinyText)}
      >
        <span>{t('builtins.lobe-local-system.apiName.createAutomation', { defaultValue: 'Creating Automation Task' })}: </span>
        <span style={{ fontWeight: 600, marginLeft: 4 }}>{name}</span>
      </div>
    );
  },
);

CreateAutomationInspector.displayName = 'CreateAutomationInspector';
