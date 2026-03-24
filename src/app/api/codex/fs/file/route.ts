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
      if (!stats.isFile()) {
        return NextResponse.json({ error: 'Target is not a file' }, { status: 400 });
      }

      const ext = path.extname(targetPath).toLowerCase();
      let contentType = 'text/plain; charset=utf-8';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.json') contentType = 'application/json';
      else if (ext === '.md') contentType = 'text/markdown; charset=utf-8';

      const fileBuffer = await fs.readFile(targetPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      throw e;
    }
  } catch (error: any) {
    console.error('File API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
};
