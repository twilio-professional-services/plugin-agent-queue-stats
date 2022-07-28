import { AppState as FlexAppState } from '@twilio/flex-ui';
import { combineReducers, Action as ReduxAction } from 'redux';
import { QueueStats } from '../utils/StatsHelper';

import { reduce as QueueStatsReducer } from './QueueStatsState';

// Register your redux store under a unique namespace
export const namespace = 'agentQueueStats';

// Extend this payload to be of type that your ReduxAction is
export interface Action extends ReduxAction {
  payload?: any;
}

// Register all component states under the namespace
export interface AppState {
  flex: FlexAppState;
  agentQueueStats: {
    stats: Array<QueueStats>
  };
}

// Combine the reducers
export default combineReducers({
  stats: QueueStatsReducer,
});
