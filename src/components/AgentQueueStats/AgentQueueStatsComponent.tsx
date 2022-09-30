import { ContainerProps } from './AgentQueueStatsContainer';
import React, { useEffect, useState } from 'react';
import { ColumnDefinition, DataTable } from '@twilio/flex-ui';
import { QueueStats } from '../../utils/StatsHelper';
import { AgentQueueStatsWrapper } from './AgentQueueStatsStyles';

const AgentQueueStatsComponent = (props: ContainerProps) => {
  const [clock, setClock] = useState(false);
  
  useEffect(() => {
    // tick every second to trigger update
    const interval = setInterval(() => {
      setClock(clock => !clock);
    }, 1000);
    
    return () => {
      clearInterval(interval);
    }
  }, []);
  
  const getDuration = (updatedDateString: string | undefined): string => {
    if (!updatedDateString) return "unknown";
    
    let durStr = "";
    let seconds = Math.trunc(((new Date()).getTime() - Date.parse(updatedDateString)) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    
    if (seconds >= 3600) {
      let hours = Math.trunc(seconds / 3600);
      seconds = seconds % 3600;
      durStr = `${hours}:`;
    }
    
    let minutesStr = Math.trunc(seconds / 60).toString();
    
    if (durStr.length > 0) {
      minutesStr = minutesStr.padStart(2, '0');
    }
    
    let secondsStr = (seconds % 60).toString().padStart(2, '0');
    
    durStr = `${durStr}${minutesStr}:${secondsStr}`
    
    return durStr;
  }
  
  return (
    <AgentQueueStatsWrapper>
      <DataTable
        items={props.agentQueueStats}
        defaultSortColumn="name-column">
        <ColumnDefinition
          key="name-column"
          header="Queues"
          sortDirection='asc'
          sortingFn={(a: QueueStats, b: QueueStats) => (a.queue.queue_name > b.queue.queue_name) ? 1 : -1}
          content={(queue: QueueStats) => {
            return <span>{queue.queue.queue_name}</span>
          }} />
        <ColumnDefinition
          key="active-now-column"
          header="Active Now"
          content={(queue: QueueStats) => {
            return <span>{queue.tasks_now?.active_tasks}</span>
          }} />
        <ColumnDefinition
          key="waiting-now-column"
          header="Waiting Now"
          content={(queue: QueueStats) => {
            return <span>{queue.tasks_now?.waiting_tasks}</span>
          }} />
        <ColumnDefinition
          key="longest-now-column"
          header="Longest Now"
          content={(queue: QueueStats) => {
            return <span>{typeof queue.tasks_now?.longest_task_waiting_from === 'string' ? getDuration(queue.tasks_now?.longest_task_waiting_from) : 'N/A'}</span>
          }} />
        <ColumnDefinition
          key="sla-today-column"
          header="SLA Today"
          content={(queue: QueueStats) => {
            return <span>{typeof queue.tasks_today?.sla_percentage === 'number' && queue.tasks_today?.sla_percentage >= 0 ? `${Math.round(queue.tasks_today?.sla_percentage * 100)}%` : 'N/A'}</span>
          }} />
        <ColumnDefinition
          key="handled-today-column"
          header="Handled Today"
          content={(queue: QueueStats) => {
            return <span>{queue.tasks_today?.handled_tasks_count}</span>
          }} />
        <ColumnDefinition
          key="abandoned-today-column"
          header="Abandoned Today"
          content={(queue: QueueStats) => {
            return <span>{queue.tasks_today?.abandoned_tasks_count}</span>
          }} />
        <ColumnDefinition
          key="agents-available-column"
          header="Agents Available"
          content={(queue: QueueStats) => {
            return <span>{queue.workers?.total_available_workers}</span>
          }} />
        <ColumnDefinition
          key="total-agents-column"
          header="Total Agents"
          content={(queue: QueueStats) => {
            return <span>{queue.workers?.total_eligible_workers}</span>
          }} />
      </DataTable>
    </AgentQueueStatsWrapper>
  )
}

export default AgentQueueStatsComponent;