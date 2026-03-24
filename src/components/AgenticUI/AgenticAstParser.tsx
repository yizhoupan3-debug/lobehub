import { SiReact } from '@icons-pack/react-simple-icons';
import { Flexbox, Icon, Markdown } from '@lobehub/ui';
import { ChevronDown, ChevronRight, FileCode2, FileText, FolderTree, ListTodo, Map, Waypoints } from 'lucide-react';
import { useState } from 'react';

import { useStyles } from './style';

const getFileIconComponent = (f: string) => {
  const name = f.toLowerCase();
  if (name.includes('walkthrough')) return <Icon icon={Waypoints} style={{ color: 'var(--color-text-secondary)' }} />;
  if (name.includes('task')) return <Icon icon={ListTodo} style={{ color: 'var(--color-text-secondary)' }} />;
  if (name.includes('implementation_plan')) return <Icon icon={Map} style={{ color: 'var(--color-text-secondary)' }} />;
  if (name.endsWith('.tsx') || name.endsWith('.ts') || name.endsWith('.jsx')) return <SiReact size={14} style={{ color: '#61DAFB' }} />;
  if (name.endsWith('.md')) return <Icon icon={FileText} style={{ color: 'var(--color-text-secondary)' }} />;
  return <Icon icon={FileCode2} style={{ color: 'var(--color-text-secondary)' }} />;
};

function parseAgenticLog(text: string) {
  const files: string[] = [];
  const filesRegex = /Files Edited\n((?:[-*]\s+.*\n?)*)/i;
  const filesMatch = text.match(filesRegex);
  if (filesMatch) {
    const lines = filesMatch[1].split('\n').filter(Boolean);
    for (const line of lines) {
      files.push(line.replace(/^[-*]\s+/, '').trim());
    }
  }

  const progressUpdates: any[] = [];
  const progRegex = /Progress Updates\n([\s\S]*)/i;
  const progMatch = text.match(progRegex);
  
  if (progMatch) {
    const lines = progMatch[1].split('\n');
    let currentStep: any = null;
    
    for (const line of lines) {
      const stepMatch = line.match(/^(\d+)[.|、\s]+\s*(.*)/);
      if (stepMatch) {
        if (currentStep) progressUpdates.push(currentStep);
        currentStep = { id: stepMatch[1], title: stepMatch[2], content: [] };
      } else if (currentStep) {
        currentStep.content.push(line);
      }
    }
    if (currentStep) progressUpdates.push(currentStep);
  }

  let taskTitle = '';
  let taskSummary = '';
  const headerText = text.split(/Files Edited/i)[0] || '';
  
  const headerLines = headerText.split('\n').map(l => l.replace(/^>\s?/, '').trim()).filter(Boolean);
  const contentLines = headerLines.filter(l => !l.toLowerCase().startsWith('thought for'));
  
  if (contentLines.length > 0) {
    taskTitle = contentLines[0].replace(/^\*\*|##?\s?|\*\*$/g, '').trim();
    taskSummary = contentLines.slice(1).join('\n').trim();
  }

  const isMatched = files.length > 0 || progressUpdates.length > 0 || taskTitle;
  return { files, progressUpdates, isMatched, taskTitle, taskSummary };
}

// 深度解析 Timeline 的内容项，拆出 Action、Thought 等
const TimelineDetailContent = ({ content }: { content: string[] }) => {
  const { styles } = useStyles();
  
  // 分组解析
  const blocks: any[] = [];
  let currentThought: any = null;

  for (const line of content) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    // 匹配 Thought
    const thoughtHeadMatch = cleanLine.match(/^>?\s*Thought for (.*)/i);
    if (thoughtHeadMatch) {
      if (currentThought) blocks.push(currentThought);
      currentThought = { type: 'thought', time: thoughtHeadMatch[1], lines: [] };
      continue;
    }
    
    if (currentThought) {
      if (cleanLine.startsWith('>') || cleanLine.startsWith('    ')) {
        currentThought.lines.push(cleanLine.replace(/^>\s?/, ''));
        continue;
      } else {
        blocks.push(currentThought);
        currentThought = null;
      }
    }

    // 匹配 Action Log: Analyzed, Edited, Created, Deleted
    const actionMatch = cleanLine.match(/^(Analyzed|Edited|Created|Deleted|Viewed)\s+(.*)/i);
    if (actionMatch) {
       blocks.push({ type: 'action', action: actionMatch[1], target: actionMatch[2], raw: line });
       continue;
    }

    blocks.push({ type: 'text', raw: line });
  }
  if (currentThought) blocks.push(currentThought);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {blocks.map((block, i) => {
        if (block.type === 'thought') {
          return <ThoughtBlock key={i} lines={block.lines} time={block.time} />;
        }
        if (block.type === 'action') {
          return (
            <Flexbox horizontal align="center" gap={8} key={i} style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              <Icon icon={block.target.includes('.') ? FileText : FolderTree} style={{ opacity: 0.7 }} />
              <span><b>{block.action}</b> {block.target}</span>
            </Flexbox>
          );
        }
        return <Markdown key={i}>{block.raw}</Markdown>;
      })}
    </div>
  );
};

// 折叠的 Thought 块
const ThoughtBlock = ({ time, lines }: { time: string, lines: string[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ paddingLeft: 8, borderLeft: '2px solid var(--color-border)', marginBlock: 4 }}>
      <Flexbox 
        horizontal 
        align="center" 
        gap={6} 
        style={{ cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: 13, userSelect: 'none' }}
        onClick={() => setOpen(!open)}
      >
        <Icon icon={ChevronRight} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'all 0.2s', fontSize: 14 }} />
        Thought for {time}
      </Flexbox>
      {open && lines.length > 0 && (
        <div style={{ marginTop: 8, color: 'var(--color-text-secondary)', fontSize: 13 }}>
          <Markdown>{lines.join('\n')}</Markdown>
        </div>
      )}
    </div>
  );
};

const TimelineStep = ({ step, isLast, expandAll }: { step: any, isLast: boolean, expandAll: boolean }) => {
  const { styles, cx } = useStyles();
  const [open, setOpen] = useState(false);
  
  const hasContent = step.content.some((c: string) => c.trim().length > 0);
  const isOpen = expandAll || open;

  return (
    <div className={styles.timelineItem}>
      {!isLast && <div className={styles.timelineLine} />}
      <div className={styles.timelineIndicator}>{step.id}</div>
      <div className={styles.timelineContent}>
        <div 
           className={cx(styles.timelineTitle, hasContent ? styles.timelineTitleHoverable : '')} 
           onClick={() => hasContent && setOpen(!open)}
        >
          {step.title}
        </div>
        
        {isOpen && hasContent && (
           <div className={styles.timelineDetail}>
              <TimelineDetailContent content={step.content} />
           </div>
        )}
      </div>
    </div>
  )
}

export const AgenticAstParser = ({ content }: { content: string }) => {
  const { styles } = useStyles();
  const { files, progressUpdates, isMatched, taskTitle, taskSummary } = parseAgenticLog(content);
  const [expandAll, setExpandAll] = useState(false);

  if (!isMatched) {
     return <Markdown>{content}</Markdown>;
  }

  return (
    <div className={styles.astContainer}>
      {taskTitle && (
        <div style={{ marginBottom: 16 }}>
          <div className={styles.taskTitle}>{taskTitle}</div>
          {taskSummary && <div className={styles.taskSummary}>{taskSummary}</div>}
        </div>
      )}

       {files.length > 0 && (
         <>
           {(taskTitle || taskSummary) && <div className={styles.divider} />}
           <div className={styles.sectionBlock}>
             <div className={styles.sectionTitle}>Files Edited</div>
             <Flexbox horizontal gap={12} style={{ flexWrap: 'wrap', marginTop: 12, marginBottom: 12 }}>
               {files.map(f => (
                 <Flexbox horizontal align="center" className={styles.fileChip} gap={6} key={f}>
                   {getFileIconComponent(f)}
                   <span style={{ fontWeight: 600 }}>{f}</span>
                 </Flexbox>
               ))}
             </Flexbox>
           </div>
         </>
       )}

       {progressUpdates.length > 0 && (
         <>
           {(files.length > 0 || taskTitle || taskSummary) && <div className={styles.divider} />}
           <div className={styles.sectionBlock}>
           <Flexbox horizontal align="center" justify="space-between" style={{ marginBottom: 16 }}>
             <div className={styles.sectionTitle}>Progress Updates</div>
             <div className={styles.collapseAllBtn} onClick={() => setExpandAll(!expandAll)}>
               {expandAll ? 'Collapse all' : 'Expand all'} <Icon icon={ChevronDown} style={{ transform: expandAll ? 'rotate(180deg)' : 'none', transition: 'all 0.2s' }}/>
             </div>
           </Flexbox>

           <div className={styles.timelineRoot}>
             {progressUpdates.map((step, idx) => (
               <TimelineStep expandAll={expandAll} isLast={idx === progressUpdates.length - 1} key={idx} step={step} />
             ))}
           </div>
         </div>
       )}
    </div>
  );
};
