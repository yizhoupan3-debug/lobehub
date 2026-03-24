import { type PrimaryColors } from '@lobehub/ui';
import { ColorSwatches, findCustomThemeName, primaryColors } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  onChange?: (v: PrimaryColors) => void;
  value?: PrimaryColors;
}

const ThemeSwatchesPrimary = memo<IProps>(({ onChange, value }) => {
  const { t } = useTranslation('color');

  const handleSelect = (v: any) => {
    const customPrimaries = [
      '#007acc', '#0070f3', '#88c0d0', '#bd93f9', '#f92672',
      '#58a6ff', '#268bd2', '#d79921', '#61afef', '#7aa2f7'
    ];
    const customNames = [
      'cursor', 'vercel', 'nord', 'dracula', 'monokai',
      'github', 'solarized', 'gruvbox', 'onedark', 'tokyonight'
    ];
    const index = customPrimaries.indexOf(v);
    
    if (index !== -1) {
      onChange?.(customNames[index] as any);
      return;
    }
    const name = findCustomThemeName('primary', v) as PrimaryColors;
    onChange?.(name || '');
  };

  return (
    <ColorSwatches
      value={value ? primaryColors[value] : undefined}
      colors={[
        {
          color: 'rgba(0, 0, 0, 0)',
          title: t('default'),
        },
        { color: '#007acc', title: t('cursor') },
        { color: '#0070f3', title: t('vercel') },
        { color: '#88c0d0', title: t('nord') },
        { color: '#bd93f9', title: t('dracula') },
        { color: '#f92672', title: t('monokai') },
        { color: '#58a6ff', title: t('github') },
        { color: '#268bd2', title: t('solarized') },
        { color: '#d79921', title: t('gruvbox') },
        { color: '#61afef', title: t('onedark') },
        { color: '#7aa2f7', title: t('tokyonight') },
        {
          color: primaryColors.red,
          title: t('red'),
        },
        {
          color: primaryColors.orange,
          title: t('orange'),
        },
        {
          color: primaryColors.gold,
          title: t('gold'),
        },
        {
          color: primaryColors.yellow,
          title: t('yellow'),
        },
        {
          color: primaryColors.lime,
          title: t('lime'),
        },
        {
          color: primaryColors.green,
          title: t('green'),
        },
        {
          color: primaryColors.cyan,
          title: t('cyan'),
        },
        {
          color: primaryColors.blue,
          title: t('blue'),
        },
        {
          color: primaryColors.geekblue,
          title: t('geekblue'),
        },
        {
          color: primaryColors.purple,
          title: t('purple'),
        },
        {
          color: primaryColors.magenta,
          title: t('magenta'),
        },
        {
          color: primaryColors.volcano,
          title: t('volcano'),
        },
      ]}
      onChange={handleSelect}
    />
  );
});

export default ThemeSwatchesPrimary;
