import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import reducers, { namespace } from './states';
import { StatsHelper } from './utils/StatsHelper';
import AgentQueueStats from './components/AgentQueueStats/AgentQueueStatsContainer';
import AgentQueueStatsSideLink from './components/AgentQueueStatsSideLink/AgentQueueStatsSideLink';

const PLUGIN_NAME = 'AgentQueueStatsPlugin';

export default class AgentQueueStatsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    if (!this.showAgentViews(manager)) return;
    
    this.registerReducers(manager);
    
    flex.ViewCollection.Content.add(
      <Flex.View name="agent-queue-stats" key="agent-queue-stats">
        <AgentQueueStats />
      </Flex.View>
    )
    
    flex.SideNav.Content.add(
      <AgentQueueStatsSideLink key='agent-queue-stats-side-link' />, {sortOrder:1}
    )
    
    let statsHelper = new StatsHelper(manager);
  }
  
  showAgentViews(manager: Flex.Manager) {
    const { roles } = manager.user;
    return roles.indexOf("agent") >= 0;
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  private registerReducers(manager: Flex.Manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
