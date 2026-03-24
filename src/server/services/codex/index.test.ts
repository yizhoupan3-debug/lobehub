import fs from 'node:fs/promises';

import { describe, expect, it, vi } from 'vitest';

import { CodexService } from './index';

vi.mock('node:fs/promises', () => ({
  default: {
    stat: vi.fn(),
    readFile: vi.fn(),
  },
}));

describe('CodexService', () => {
  const service = new CodexService();

  describe('getFile', () => {
    it('should throw if target is not a file', async () => {
      vi.mocked(fs.stat).mockResolvedValue({ isFile: () => false } as any);

      await expect(service.getFile('/test/dir')).rejects.toThrow('Target is not a file');
    });

    it('should return buffer and correct content type for md file', async () => {
      vi.mocked(fs.stat).mockResolvedValue({ isFile: () => true } as any);
      vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('hello markdown'));

      const result = await service.getFile('/test/file.md');

      expect(result.contentType).toBe('text/markdown; charset=utf-8');
      expect(result.buffer.toString()).toBe('hello markdown');
    });

    it('should return correct content type for json', async () => {
      vi.mocked(fs.stat).mockResolvedValue({ isFile: () => true } as any);
      vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('{}'));

      const result = await service.getFile('/test/file.json');

      expect(result.contentType).toBe('application/json');
    });
  });
});
