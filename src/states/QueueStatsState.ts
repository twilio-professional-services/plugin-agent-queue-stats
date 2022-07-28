import { QueueStats } from '../utils/StatsHelper';
import { Action } from '.';

const ACTION_UPDATE_STATS = 'AGENTSTATS_UPDATE_STATS';

const initialState: Array<QueueStats> = [];

export class Actions {
  public static updateStats = (stats: Array<QueueStats>): Action => ({
    type: ACTION_UPDATE_STATS,
    payload: stats
  });
}

export function reduce(state: Array<QueueStats> = initialState, action: Action): Array<QueueStats> {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ACTION_UPDATE_STATS: {
      let removedItems: number[] = [];
      
      action.payload.forEach((item: QueueStats, index: number) => {
        let existingStats = state.find(queueStats => queueStats.queue.queue_sid == item.queue.queue_sid);
        
        if (existingStats) {
          // replace existing item in state
          state.splice(state.indexOf(existingStats), 1, item);
          removedItems.push(index);
        }
      })
      
      removedItems.forEach(removedItemIndex => {
        action.payload.splice(removedItemIndex, 1);
      });
      
      return [
        ...state,
        ...action.payload
      ];
    }

    default:
      return state;
  }
}
