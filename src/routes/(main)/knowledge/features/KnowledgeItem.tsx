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
  message,
  Spin,
  Tag,
  Tooltip,
  Typography,
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
import type { AntigravityKnowledgeBaseItem } from '@/types/antigravityKnowledge';

dayjs.extend(relativeTime);

const { Paragraph, Text } = Typography;

const styles = createStaticStyles(({ css, cssVar }) => ({
  actionsMenu: css`
    position: absolute;
    inset-block-start: 8px;
    inset-inline-end: 8px;
  `,
  collapse: css`
    margin-block-start: 16px;
    border: none !important;
    background-color: transparent !important;

    .ant-collapse-item {
      overflow: hidden;
      border: 1px solid ${cssVar.colorBorderSecondary} !important;
      border-radius: 8px !important;
    }

    .ant-collapse-header {
      padding-block: 10px !important;
      padding-inline: 16px !important;
      background: ${cssVar.colorFillQuaternary} !important;
    }

    .ant-collapse-content {
      border-block-start: 1px solid ${cssVar.colorBorderSecondary} !important;
      background-color: transparent !important;
    }
  `,
  container: css`
    display: flex;
    flex-direction: column;

    padding: 20px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    background: ${cssVar.colorBgContainer};
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 5%),
      0 2px 4px -1px rgb(0 0 0 / 3%);

    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:hover {
      transform: translateY(-2px);
      border-color: ${cssVar.colorPrimaryBorderHover};
      box-shadow:
        0 10px 15px -3px rgb(0 0 0 / 10%),
        0 4px 6px -2px rgb(0 0 0 / 5%);
    }
  `,
  content: css`
    overflow: hidden;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
  `,
  drawerHeader: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    margin-block-end: 24px;
    padding-block-end: 16px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
  `,
  header: css`
    position: relative;
    display: flex;
    gap: 16px;
  `,
  statItem: css`
    display: flex;
    gap: 4px;
    align-items: center;

    padding-block: 2px;
    padding-inline: 8px;
    border-radius: 12px;

    background: ${cssVar.colorFillQuaternary};
  `,
  stats: css`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;

    margin-block-start: 12px;

    font-size: 12px;
    color: ${cssVar.colorTextSecondary};
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
  if (/\.(ts|tsx|js|jsx)$/.test(filename)) {
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
                  size="small"
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
                                  size="small"
                                  type="primary"
                                  onClick={() => handlePreview(filename)}
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
                />
              ),
              key: '1',
              label: <Text strong>Explore References & Artifacts</Text>,
            },
          ]}
        />
      )}

      <Drawer
        open={drawerOpen}
        styles={{ body: { padding: '24px 32px' } }}
        title={null}
        width={800}
        onClose={() => setDrawerOpen(false)}
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
