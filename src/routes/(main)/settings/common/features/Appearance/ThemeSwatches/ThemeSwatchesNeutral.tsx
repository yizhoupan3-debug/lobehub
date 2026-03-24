import { type NeutralColors } from '@lobehub/ui';
import { ColorSwatches, findCustomThemeName, neutralColors } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  onChange?: (v: NeutralColors) => void;
  value?: NeutralColors;
}

const ThemeSwatchesNeutral = memo<IProps>(({ value, onChange }) => {
  const { t } = useTranslation('color');

  const handleSelect = (v: any) => {
    const customNeutrals = [
      '#0a0a0a', '#000000', '#2e3440', '#282a36', '#272822',
      '#0d1117', '#002b36', '#282828', '#282c34', '#1a1b26'
    ];
    const customNames = [
      'cursor', 'vercel', 'nord', 'dracula', 'monokai',
      'github', 'solarized', 'gruvbox', 'onedark', 'tokyonight'
    ];
    const index = customNeutrals.indexOf(v);
    
    if (index !== -1) {
      onChange?.(customNames[index] as any);
      return;
    }
    const name = findCustomThemeName('neutral', v) as NeutralColors;
    onChange?.(name || '');
  };

  return (
    <ColorSwatches
      value={value ? neutralColors[value] : undefined}
      colors={[
        {
          color: 'rgba(0, 0, 0, 0)',
          title: t('default'),
        },
        { color: '#0a0a0a', title: t('cursor') },
        { color: '#000000', title: t('vercel') },
        { color: '#2e3440', title: t('nord') },
        { color: '#282a36', title: t('dracula') },
        { color: '#272822', title: t('monokai') },
        { color: '#0d1117', title: t('github') },
        { color: '#002b36', title: t('solarized') },
        { color: '#282828', title: t('gruvbox') },
        { color: '#282c34', title: t('onedark') },
        { color: '#1a1b26', title: t('tokyonight') },
        {
          color: neutralColors.mauve,
          title: t('mauve'),
        },
        {
          color: neutralColors.olive,
          title: t('olive'),
        },
        {
          color: neutralColors.sage,
          title: t('sage'),
        },
        {
          color: neutralColors.sand,
          title: t('sand'),
        },
        {
          color: neutralColors.slate,
          title: t('slate'),
        },
      ]}
      onChange={handleSelect}
    />
  );
});

export default ThemeSwatchesNeutral;
