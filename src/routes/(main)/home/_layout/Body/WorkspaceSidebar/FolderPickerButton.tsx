'use client';

import { ActionIcon, Tooltip } from '@lobehub/ui';
import { FolderOpenIcon } from 'lucide-react';
import { memo, useCallback, useRef } from 'react';

import { useHomeStore } from '@/store/home';

/**
 * Triggers the native OS folder picker.
 * Uses <input webkitdirectory> for broad browser compatibility,
 * which shows the same native dialog as file upload.
 */
const FolderPickerButton = memo(() => {
  const inputRef = useRef<HTMLInputElement>(null);
  const addWorkspace = useHomeStore((s) => s.addWorkspace);

  const handleClick = useCallback(async () => {
    // Prefer File System Access API (modern browsers — gives a nicer dialog)
    if ('showDirectoryPicker' in window) {
      try {
        // @ts-ignore — experimental API
        const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
        const name = dirHandle.name as string;
        // We can't get the full absolute path from the browser API for security reasons,
        // so we store the folder handle name and let users type the rest if needed.
        // The path shown in AI context will be the folder name.
        addWorkspace({
          id: name + '-' + Date.now(),
          path: name, // folder name only (browser security limitation)
          name,
          parent: undefined,
        });
        return;
      } catch (e: any) {
        // User cancelled — do nothing
        if (e?.name === 'AbortError') return;
        // Fall through to input fallback
      }
    }

    // Fallback: <input type="file" webkitdirectory> — same native dialog
    inputRef.current?.click();
  }, [addWorkspace]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // webkitRelativePath gives "folderName/file.ext" — extract folder name
      const firstFile = files[0];
      const relativePath = (firstFile as any).webkitRelativePath as string | undefined;
      const folderName = relativePath ? relativePath.split('/')[0] : firstFile.name;

      addWorkspace({
        id: folderName + '-' + Date.now(),
        path: folderName,
        name: folderName,
        parent: undefined,
      });

      // Reset input so same folder can be re-selected
      e.target.value = '';
    },
    [addWorkspace],
  );

  return (
    <>
      <Tooltip title="添加项目文件夹">
        <ActionIcon icon={FolderOpenIcon} size={'small'} onClick={handleClick} />
      </Tooltip>

      {/* Hidden file input for fallback */}
      <input
        ref={inputRef}
        accept="*/*"
        multiple
        style={{ display: 'none' }}
        type="file"
        // @ts-ignore — non-standard but widely supported
        webkitdirectory=""
        onChange={handleInputChange}
      />
    </>
  );
});

export default FolderPickerButton;
