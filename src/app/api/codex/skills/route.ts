import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// 扫描 /Users/joe/Documents/指示词宝库/skills/ 目录下的所有技能
export async function GET() {
  const skillsDir = '/Users/joe/Documents/指示词宝库/skills';
  const skills = [];

  try {
    if (fs.existsSync(skillsDir)) {
      const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          // 只把有实际名称的当做技能目录
          skills.push({
            id: entry.name,
            name: entry.name,
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to read codex skills directory', err);
  }

  return NextResponse.json(skills);
}
