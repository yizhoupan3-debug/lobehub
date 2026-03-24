import { CheckCircle, FileText, Navigation } from 'lucide-react';
import { type FC } from 'react';

import { AgenticCard } from '@/components/AgenticUI/AgenticCard';

import { type MarkdownElement, type MarkdownElementProps } from '../type';
import createAgenticRehypePlugin from './rehypePlugin';

// 1. Task Element
const TaskRender = (props: MarkdownElementProps & any) => {
  return (
    <AgenticCard
      icon={CheckCircle}
      iconColor="#10b981"
      id={props.id}
      status={props.TaskStatus || props.taskstatus || 'Task progress...'}
      tagType="task"
      title={props.TaskName || props.taskname || 'Agent Task'}
    >
      {props.children}
    </AgenticCard>
  );
};

export const AgenticTaskElement: MarkdownElement = {
  Component: TaskRender as unknown as FC<MarkdownElementProps>,
  rehypePlugin: createAgenticRehypePlugin('task'),
  scope: 'assistant',
  tag: 'task',
};

// 2. Implementation Plan Element
const PlanRender = (props: MarkdownElementProps & any) => {
  return (
    <AgenticCard
      icon={FileText}
      iconColor="#6366f1"
      id={props.id}
      status="Architectural planning and implementation details"
      tagType="implementation_plan"
      title="Implementation Plan"
    >
      {props.children}
    </AgenticCard>
  );
};

export const AgenticPlanElement: MarkdownElement = {
  Component: PlanRender as unknown as FC<MarkdownElementProps>,
  rehypePlugin: createAgenticRehypePlugin('implementation_plan'),
  scope: 'assistant',
  tag: 'implementation_plan',
};

// 3. Walkthrough Element
const WalkthroughRender = (props: MarkdownElementProps & any) => {
  return (
    <AgenticCard
      icon={Navigation}
      iconColor="#8b5cf6"
      id={props.id}
      status="Post-execution review and summary"
      tagType="walkthrough"
      title="Verification Walkthrough"
    >
      {props.children}
    </AgenticCard>
  );
};

export const AgenticWalkthroughElement: MarkdownElement = {
  Component: WalkthroughRender as unknown as FC<MarkdownElementProps>,
  rehypePlugin: createAgenticRehypePlugin('walkthrough'),
  scope: 'assistant',
  tag: 'walkthrough',
};
