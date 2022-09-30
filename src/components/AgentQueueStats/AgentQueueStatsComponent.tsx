import { ContainerProps } from './AgentQueueStatsContainer';
import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { AgentQueueStatsWrapper, StatsTableCell, StatsKeyTableCell } from './AgentQueueStatsStyles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Queues</TableCell>
            <TableCell>Active Now</TableCell>
            <TableCell>Waiting Now</TableCell>
            <TableCell>Longest Now</TableCell>
            <TableCell>SLA Today</TableCell>
            <TableCell>Handled Today</TableCell>
            <TableCell>Abandoned Today</TableCell>
            <TableCell>Agents Available</TableCell>
            <TableCell>Total Agents</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            props.agentQueueStats.map(queue => (
              <TableRow key={queue.queue.queue_sid}>
                <StatsKeyTableCell>{queue.queue.queue_name}</StatsKeyTableCell>
                <StatsTableCell>{queue.tasks_now?.active_tasks}</StatsTableCell>
                <StatsTableCell>{queue.tasks_now?.waiting_tasks}</StatsTableCell>
                <StatsTableCell>{typeof queue.tasks_now?.longest_task_waiting_from === 'string' ? getDuration(queue.tasks_now?.longest_task_waiting_from) : 'N/A'}</StatsTableCell>
                <StatsTableCell>{typeof queue.tasks_today?.sla_percentage === 'number' && queue.tasks_today?.sla_percentage >= 0 ? `${Math.round(queue.tasks_today?.sla_percentage * 100)}%` : 'N/A'}</StatsTableCell>
                <StatsTableCell>{queue.tasks_today?.handled_tasks_count}</StatsTableCell>
                <StatsTableCell>{queue.tasks_today?.abandoned_tasks_count}</StatsTableCell>
                <StatsTableCell>{queue.workers?.total_available_workers}</StatsTableCell>
                <StatsTableCell>{queue.workers?.total_eligible_workers}</StatsTableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </AgentQueueStatsWrapper>
  )
}

export default AgentQueueStatsComponent;