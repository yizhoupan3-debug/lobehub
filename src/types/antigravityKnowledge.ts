export interface AntigravityReferenceItem {
  type: 'file' | 'conversation_id' | string;
  value: string;
}

export interface AntigravityKnowledgeBaseItem {
  id: string;
  title: string;
  summary: string;
  references: AntigravityReferenceItem[];
  updatedAt: number;
}
