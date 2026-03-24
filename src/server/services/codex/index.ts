import fs from 'node:fs/promises';
import path from 'node:path';

export class CodexService {
  async getFile(targetPath: string) {
    const stats = await fs.stat(targetPath);
    if (!stats.isFile()) {
      throw new Error('Target is not a file');
    }

    const ext = path.extname(targetPath).toLowerCase();
    let contentType = 'text/plain; charset=utf-8';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.md') contentType = 'text/markdown; charset=utf-8';

    const fileBuffer = await fs.readFile(targetPath);
    return { buffer: fileBuffer, contentType };
  }
}

export const codexService = new CodexService();
