import { NextResponse } from 'next/server';

import { codexService } from '@/server/services/codex';

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get('path');

    if (!targetPath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }

    try {
      const file = await codexService.getFile(targetPath);
      return new NextResponse(file.buffer, {
        headers: {
          'Content-Type': file.contentType,
        },
      });
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('File API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
};
