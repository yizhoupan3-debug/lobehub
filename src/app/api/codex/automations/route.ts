import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { NextResponse } from 'next/server';

const CODEX_HOME = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
const AUTOMATIONS_DIR = path.join(CODEX_HOME, 'automations');

/**
 * Parses simple TOML properties specific to Codex automation config
 * Supports strings, numbers, arrays of strings, etc.
 */
function parseToml(content: string) {
  const result: Record<string, any> = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Naive key-value split
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    
    const key = trimmed.slice(0, eqIndex).trim();
    const valString = trimmed.slice(eqIndex + 1).trim();
    
    // Parse value basic types
    if (valString.startsWith('"') && valString.endsWith('"')) {
      result[key] = valString.slice(1, -1);
    } else if (valString === 'true' || valString === 'false') {
      result[key] = valString === 'true';
    } else if (valString.startsWith('[') && valString.endsWith(']')) {
      // naive array string parser
      const inner = valString.slice(1, -1);
      result[key] = inner.split(',').map(s => {
        const t = s.trim();
        if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
        return t;
      }).filter(Boolean);
    } else if (!isNaN(Number(valString))) {
      result[key] = Number(valString);
    } else {
      result[key] = valString;
    }
  }
  return result;
}

export const GET = async () => {
  try {
    const isExist = await fs.stat(AUTOMATIONS_DIR).catch(() => null);
    if (!isExist || !isExist.isDirectory()) {
      return NextResponse.json({ automations: [] });
    }

    const automations = [];
    const entries = await fs.readdir(AUTOMATIONS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const tomlPath = path.join(AUTOMATIONS_DIR, entry.name, 'automation.toml');
        const tomlExist = await fs.stat(tomlPath).catch(() => null);
        if (tomlExist && tomlExist.isFile()) {
          const content = await fs.readFile(tomlPath, 'utf8');
          const data = parseToml(content);
          
          if (data.id && data.name) {
            automations.push({
              id: data.id,
              name: data.name,
              status: data.status || 'UNKNOWN',
              rrule: data.rrule || '',
              prompt: data.prompt || '',
              model: data.model || '',
              execution_environment: data.execution_environment || 'unknown',
              created_at: data.created_at || Date.now(),
              updated_at: data.updated_at || Date.now(),
              cwds: data.cwds || []
            });
          }
        }
      }
    }

    // Sort by created_at desc
    automations.sort((a, b) => b.created_at - a.created_at);

    return NextResponse.json({ automations });
  } catch (e) {
    console.error('Failed to read codex automations', e);
    return NextResponse.json({ error: 'Failed to read codex automations' }, { status: 500 });
  }
};
