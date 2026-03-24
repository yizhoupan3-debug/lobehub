import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { authedProcedure, router } from '@/libs/trpc/lambda';
import { AntigravityKnowledgeBaseItem } from '@/types/antigravityKnowledge';

const antigravityKnowledgeProcedure = authedProcedure;

export const antigravityKnowledgeRouter = router({
  getAntigravityKnowledgeBases: antigravityKnowledgeProcedure.query(
    async (): Promise<AntigravityKnowledgeBaseItem[]> => {
      try {
        const knowledgeDir = path.join(os.homedir(), '.gemini', 'antigravity', 'knowledge');
        const items: AntigravityKnowledgeBaseItem[] = [];

        try {
          const dirs = await fs.readdir(knowledgeDir, { withFileTypes: true });
          for (const dir of dirs) {
            if (dir.isDirectory()) {
              try {
                const metadataPath = path.join(knowledgeDir, dir.name, 'metadata.json');
                const timestampsPath = path.join(knowledgeDir, dir.name, 'timestamps.json');

                const metadataContent = await fs.readFile(metadataPath, 'utf8');
                const metadata = JSON.parse(metadataContent);

                let updatedAt = Date.now();
                try {
                  const timestampsContent = await fs.readFile(timestampsPath, 'utf8');
                  const timestamps = JSON.parse(timestampsContent);
                  updatedAt = timestamps.updatedAt || Date.now();
                } catch {
                  // Ignore timestamp read error -> use current time
                }

                items.push({
                  id: dir.name,
                  references: metadata.references || [],
                  summary: metadata.summary || '',
                  title: metadata.title || dir.name,
                  updatedAt,
                });
              } catch {
                // skip directories that don't have valid metadata.json
              }
            }
          }
        } catch {
          // knowledgeDir might not exist
          return [];
        }

        return items.sort((a, b) => b.updatedAt - a.updatedAt);
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch Antigravity knowledge bases',
        });
      }
    },
  ),

  getKnowledgeFileContent: antigravityKnowledgeProcedure
    .input(z.object({ id: z.string(), filename: z.string() }))
    .query(async ({ input }) => {
      try {
        const knowledgeDir = path.join(os.homedir(), '.gemini', 'antigravity', 'knowledge', input.id);
        
        let targetPath = '';
        if (input.filename === 'metadata.json') {
          targetPath = path.join(knowledgeDir, 'metadata.json');
        } else {
          targetPath = path.join(knowledgeDir, 'artifacts', input.filename);
        }

        // Prevent directory traversal
        const resolvedPath = path.resolve(targetPath);
        if (!resolvedPath.startsWith(path.resolve(knowledgeDir))) {
           throw new Error('Invalid path');
        }

        const content = await fs.readFile(resolvedPath, 'utf8');
        return content;
      } catch (e) {
         throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'File not found or unreadable. ' + String(e),
        });
      }
    }),
});
