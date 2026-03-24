import { type IEditor, type SlashOptions } from '@lobehub/editor';
import Fuse from 'fuse.js';
import { Sparkles } from 'lucide-react';
import { useCallback } from 'react';
import useSWR from 'swr';

import { INSERT_ACTION_TAG_COMMAND } from './ActionTag/command';

type SlashItem = NonNullable<SlashOptions['items'] extends (infer U)[] ? U : never>;

export const useCodexSkillItems = (): SlashOptions['items'] => {
  const { data: skills } = useSWR('/api/codex/skills', async (url) => {
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  });

  return useCallback(
    async (
      search: { leadOffset: number; matchingString: string; replaceableString: string } | null,
    ) => {
      const allItems: SlashItem[] = (skills || [])
        .filter((skill: any) => skill.id && !skill.id.startsWith('.'))
        .map((skill: any) => ({
          icon: Sparkles,
          key: `codex-skill-${skill.id}`,
          label: skill.name,
          metadata: { category: 'skill', type: skill.id },
          onSelect: (editor: IEditor) => {
            // 我们直接复用 Lobe 优秀的 ActionTag 的胶囊生成命令，类型指定为 skill
            editor.dispatchCommand(INSERT_ACTION_TAG_COMMAND, {
              category: 'skill',
              label: skill.name,
              type: skill.id,
            });
          },
        }));

      // Fuzzy filtering
      if (search?.matchingString && search.matchingString.length > 0) {
        const fuse = new Fuse(allItems, { keys: ['label'], threshold: 0.4 });
        return fuse.search(search.matchingString).map((r) => r.item);
      }

      return allItems;
    },
    [skills],
  );
};
