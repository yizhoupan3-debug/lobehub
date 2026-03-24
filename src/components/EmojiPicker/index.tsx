import { type EmojiPickerProps } from '@lobehub/ui';
import dynamic from 'next/dynamic';
import { memo } from 'react';

import { useGlobalStore } from '@/store/global';
import { globalGeneralSelectors } from '@/store/global/selectors';

const LobeEmojiPicker = dynamic(() => import('@lobehub/ui').then((mod) => mod.EmojiPicker), {
  ssr: false,
});

export const EmojiPicker = memo<EmojiPickerProps>(({ shape = 'square', ...rest }) => {
  const locale = useGlobalStore(globalGeneralSelectors.currentLanguage);

  return <LobeEmojiPicker shape={shape} {...rest} defaultAvatar={null as any} locale={locale} />;
});

export default EmojiPicker;
