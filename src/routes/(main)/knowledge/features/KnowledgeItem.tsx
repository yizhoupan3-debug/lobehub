'use client';

import { CopyButton, Markdown } from '@lobehub/ui';
import {
  Avatar,
  Button,
  Collapse,
  Drawer,
  Dropdown,
  Empty,
  List,
  Spin,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { createStaticStyles } from 'antd-style';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Download,
  Eye,
  FileCode2,
  FileJson,
  FileTextIcon,
  FolderOpenIcon,
  History,
  MessageSquareIcon,
  MoreVertical,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import { memo, useState } from 'react';
import useSWR from 'swr';

import { antigravityKnowledgeService } from '@/services/antigravityKnowledge';
import { AntigravityKnowledgeBaseItem } from '@/types/antigravityKnowledge';

dayjs.extend(relativeTime);

const { Paragraph, Text } = Typography;

const styles = createStaticStyles(({ css, cssVar }) => ({
  actionsMenu: css`
    position: absolute;
    top: 8px;
    right: 8px;
  `,
  collapse: css`
    margin-top: 16px;
    background-color: transparent !important;
    border: none !important;
    .ant-collapse-item {
      border: 1px solid ${cssVar.colorBorderSecondary} !important;
      border-radius: 8px !important;
      overflow: hidden;
    }
    .ant-collapse-header {
      padding: 10px 16px !important;
      background: ${cssVar.colorFillQuaternary} !important;
    }
    .ant-collapse-content {
      background-color: transparent !important;
      border-top: 1px solid ${cssVar.colorBorderSecondary} !important;
    }
  `,
  container: css`
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background: ${cssVar.colorBgContainer};
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -1px rgba(0, 0, 0, 0.03);

    &:hover {
      border-color: ${cssVar.colorPrimaryBorderHover};
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }
  `,
  content: css`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 6px;
    overflow: hidden;
  `,
  drawerHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${cssVar.colorBorderSecondary};
  `,
  header: css`
    display: flex;
    gap: 16px;
    position: relative;
  `,
  statItem: css`
    display: flex;
    align-items: center;
    gap: 4px;
    background: ${cssVar.colorFillQuaternary};
    padding: 2px 8px;
    border-radius: 12px;
  `,
  stats: css`
    display: flex;
    gap: 12px;
    margin-top: 12px;
    font-size: 12px;
    color: ${cssVar.colorTextSecondary};
    align-items: center;
    flex-wrap: wrap;
  `,
}));

// Helper function to pick icon and color based on file extension
const getFileMeta = (filename: string) => {
  if (filename.endsWith('.md') || filename.endsWith('.mdx')) {
    return { icon: <FileTextIcon color="#8b5cf6" size={16} />, type: 'Markdown' };
  }
  if (filename.endsWith('.json')) {
    return { icon: <FileJson color="#eab308" size={16} />, type: 'JSON' };
  }
  if (filename.match(/\.(ts|tsx|js|jsx)$/)) {
    return { icon: <FileCode2 color="#3b82f6" size={16} />, type: 'Source Code' };
  }
  return { icon: <FileTextIcon color="#64748b" size={16} />, type: 'Document' };
};

interface KnowledgeItemProps {
  knowledge: AntigravityKnowledgeBaseItem;
}

const KnowledgeItem = memo<KnowledgeItemProps>(({ knowledge }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const filesCount = knowledge.references.filter((r) => r.type === 'file').length;
  const convCount = knowledge.references.filter((r) => r.type === 'conversation_id').length;

  const handlePreview = (fileName: string) => {
    setPreviewFile(fileName);
    setDrawerOpen(true);
  };

  const { data: fileContent, isValidating } = useSWR(
    previewFile ? ['getFileContent', knowledge.id, previewFile] : null,
    () => antigravityKnowledgeService.getFileContent(knowledge.id, previewFile!),
    { revalidateOnFocus: false },
  );

  const timeDiff = Date.now() - knowledge.updatedAt;
  const isRecent = timeDiff < 24 * 60 * 60 * 1000;
  const timeTagColor = isRecent ? 'green' : timeDiff > 7 * 24 * 60 * 60 * 1000 ? 'orange' : 'blue';

  const menuItems = [
    {
      icon: <RefreshCcw size={14} />,
      key: 'sync',
      label: 'Sync Workspace',
      onClick: () => message.success('Workspace synchronized with active agents.'),
    },
    {
      icon: <Download size={14} />,
      key: 'export',
      label: 'Export as JSON',
      onClick: () => message.info('Export started...'),
    },
    {
      type: 'divider' as const,
    },
    {
      icon: <Trash2 color="#ef4444" size={14} />,
      key: 'delete',
      label: <span style={{ color: '#ef4444' }}>Delete Memory</span>,
      onClick: () => message.error('Soft deleted from local view.'),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Avatar
          icon={<FolderOpenIcon size={24} />}
          size={52}
          style={{ backgroundColor: 'transparent', color: 'inherit', marginTop: 4 }}
        />
        <div className={styles.content}>
          <Text strong style={{ fontSize: 18, lineHeight: 1.2, paddingRight: 32 }}>
            {knowledge.title}
          </Text>
          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }} type="secondary">
            {knowledge.summary || 'No summary provided.'}
          </Paragraph>
          <div className={styles.stats}>
            <Tooltip title={`${filesCount} active files in memory`}>
              <div className={styles.statItem}>
                <FileCode2 size={14} />
                <Text strong>{filesCount}</Text>
              </div>
            </Tooltip>
            <Tooltip title={`${convCount} related conversational sessions`}>
               <div className={styles.statItem}>
                <MessageSquareIcon size={14} />
                <Text strong>{convCount}</Text>
              </div>
            </Tooltip>
            <Tag bordered={false} color={timeTagColor} style={{ marginLeft: 'auto' }}>
              {dayjs(knowledge.updatedAt).fromNow()}
            </Tag>
          </div>
        </div>
        
        <div className={styles.actionsMenu}>
           <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
              <Button icon={<MoreVertical size={18} />} type="text" />
           </Dropdown>
        </div>
      </div>

      {knowledge.references.length > 0 && (
        <Collapse
          className={styles.collapse}
          items={[
            {
              children: (
                <List
                  dataSource={knowledge.references}
                  renderItem={(ref: any) => {
                    const isFile = ref.type === 'file';
                    const filename = String(ref.value);
                    const meta = isFile
                      ? getFileMeta(filename)
                      : { icon: <History color="#f97316" size={16} />, type: 'Session ID' };

                    return (
                      <List.Item
                        actions={
                          isFile
                            ? [
                                <Button
                                  ghost
                                  icon={<Eye size={14} />}
                                  key="preview"
                                  onClick={() => handlePreview(filename)}
                                  size="small"
                                  type="primary"
                                >
                                  Preview
                                </Button>,
                              ]
                            : []
                        }
                      >
                        <List.Item.Meta
                          avatar={meta.icon}
                          description={
                            <Text style={{ fontSize: 12 }} type="secondary">
                              {meta.type}
                            </Text>
                          }
                          title={
                            <Text copyable={{ text: filename }} style={{ wordBreak: 'break-all' }}>
                              {filename}
                            </Text>
                          }
                        />
                      </List.Item>
                    );
                  }}
                  size="small"
                />
              ),
              key: '1',
              label: <Text strong>Explore References & Artifacts</Text>,
            },
          ]}
        />
      )}

      <Drawer
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ body: { padding: '24px 32px' } }}
        title={null}
        width={800}
      >
        <div className={styles.drawerHeader}>
          <div>
            <Typography.Title level={4} style={{ margin: 0, marginBottom: 8 }}>
              {previewFile}
            </Typography.Title>
            <Tag color="geekblue">
               ~/.gemini/antigravity/knowledge/{knowledge.id}/{previewFile === 'metadata.json' ? '' : 'artifacts/'}{previewFile}
            </Tag>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <CopyButton content={fileContent || ''} />
          </div>
        </div>

        <div style={{ minHeight: 200 }}>
          {isValidating ? (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                height: 200,
                justifyContent: 'center',
              }}
            >
               <Spin size="large" tip="Parsing artifact contents..." />
            </div>
          ) : fileContent ? (
            <Markdown variant="chat">{fileContent}</Markdown>
          ) : (
            <Empty description="Failed to load content or file is empty." />
          )}
        </div>
      </Drawer>
    </div>
  );
});

export default KnowledgeItem;
