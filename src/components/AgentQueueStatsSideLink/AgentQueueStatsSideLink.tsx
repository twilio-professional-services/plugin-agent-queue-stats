import React from 'react';
import { Actions, SideLink } from '@twilio/flex-ui';

export interface OwnProps {
  activeView?: string;
}

const AgentQueueStatsSideLink = (props: OwnProps) => {
  
  return (
    <SideLink
    key="agent-queue-stats"
    icon="Queues"
    iconActive="QueuesBold"
    isActive={props.activeView === 'agent-queue-stats'}
    showLabel={true}
    onClick={() => {
      Actions.invokeAction("NavigateToView", {
        viewName: "agent-queue-stats"
      })
    }}>Agent Queue Stats</SideLink>
  )
}

export default AgentQueueStatsSideLink;