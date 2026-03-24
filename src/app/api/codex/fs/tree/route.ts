import fs from 'node:fs/promises';
import { NextResponse } from 'next/server';
import path from 'node:path';

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get('path');

    if (!targetPath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }

    try {
      const stats = await fs.stat(targetPath);
      if (!stats.isDirectory()) {
        return NextResponse.json({ error: 'Target is not a directory' }, { status: 400 });
      }

      const files = await fs.readdir(targetPath, { withFileTypes: true });
      const tree = files
        .filter((dirent) => !dirent.name.startsWith('.') && dirent.name !== 'node_modules')
        .map((dirent) => ({
          name: dirent.name,
          path: path.join(targetPath, dirent.name),
          type: dirent.isDirectory() ? 'dir' : 'file',
        }))
        .sort((a, b) => {
          if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });

      return NextResponse.json({ tree });
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        return NextResponse.json({ error: 'Directory not found' }, { status: 404 });
      }
      throw e;
    }
  } catch (error: any) {
    console.error('File Tree API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
};
