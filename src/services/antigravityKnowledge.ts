import { lambdaClient } from '@/libs/trpc/client';

class AntigravityKnowledgeService {
  getKnowledgeBaseList = async () => {
    return lambdaClient.antigravityKnowledge.getAntigravityKnowledgeBases.query();
  };

  getFileContent = async (id: string, filename: string) => {
    return lambdaClient.antigravityKnowledge.getKnowledgeFileContent.query({ id, filename });
  };
}

export const antigravityKnowledgeService = new AntigravityKnowledgeService();
