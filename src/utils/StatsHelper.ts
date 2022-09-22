import * as Flex from '@twilio/flex-ui';
import { AppState, namespace } from '../states';
import { SyncMap } from 'twilio-sync';
import QueuesHelper, { AgentQueue } from './QueuesHelper';
import { Actions } from '../states/QueueStatsState';
import { LiveQueryAddedEvent, LiveQueryUpdatedEvent } from "./LiveQueryHelper";

export interface QueueStats {
  queue: AgentQueue;
  tasks_now?: QueueTasksNow;
  tasks_today?: QueueTasksHistorical;
  tasks_thirty_minutes?: QueueTasksHistorical;
  workers?: QueueWorkerActivities;
}

export interface QueueTasksNow {
  pending_tasks: number;
  reserved_tasks: number;
  assigned_tasks: number;
  wrapping_tasks: number;
  waiting_tasks: number;
  active_tasks: number;
  total_tasks: number;
  longest_task_waiting_sid: string;
  longest_task_waiting_from: string;
  timestamp_updated: number;
}

export interface QueueTasksNowMap {
  [key: string]: QueueTasksNow
}

export interface QueueTasksHistorical {
  total_tasks_count: number;
  handled_tasks_count: number;
  handled_tasks_within_sl_threshold_count: number;
  handled_tasks_within_sl_threshold_percentage: number;
  abandoned_tasks_count: number;
  abandoned_tasks_percentage: number;
  short_abandoned_tasks_count: number;
  short_abandoned_tasks_percentage: number;
  flow_out_tasks_count: number;
  flow_out_tasks_percentage: number;
  sla_percentage: number;
  timestamp_updated: number;
}

export interface QueueTasksHistoricalMap {
  [key: string]: QueueTasksHistorical
}

export interface QueueWorkerActivities {
  activity_statistics: QueueWorkerActivityStats[];
  timestamp_updated: number;
  total_available_workers: number;
  total_eligible_workers: number;
}

export interface QueueWorkerActivityStats {
  sid: string;
  workers: number;
  friendly_name: string;
}

interface MapCache {
  [queueSid: string]: SyncMap
}

export class StatsHelper {
  mapCache: MapCache;
  manager: Flex.Manager;
  queuesHelper: QueuesHelper
  
  constructor(manager: Flex.Manager) {
    this.mapCache = {};
    this.manager = manager;
    
    this.queuesHelper = new QueuesHelper(
      async (items: {[key: string]: AgentQueue}) => {
        this.onQueuesLoaded(items);
      },
      async (event: LiveQueryAddedEvent<AgentQueue>) => {
        this.onQueueAdded(event);
      },
      (event: LiveQueryUpdatedEvent<AgentQueue>) => {
        this.onQueueUpdated(event);
      });
  }
  
  async fetchQueueStats(queue: AgentQueue): Promise<QueueStats | null> {
    let stats: QueueStats = {
      queue
    };
    
    let queueStatsMap: SyncMap;
    
    // no need to do anything if the map is open already.
    if (this.mapCache[queue.queue_sid]) return null;
    
    this.mapCache[queue.queue_sid] = await this.manager.insightsClient.map({
      id: `${queue.queue_sid}.realtime_statistics.v1`,
      mode: "open_existing"
    });
    
    queueStatsMap = this.mapCache[queue.queue_sid];
    
    // set up listeners
    queueStatsMap.on('itemAdded', (args: any) => {
      this.onStatsUpdated(queue.queue_sid, args.item);
    });
    queueStatsMap.on('itemUpdated', (args: any) => {
      this.onStatsUpdated(queue.queue_sid, args.item);
    });
    
    // get initial data
    let mapItems = await queueStatsMap.getItems();
    
    mapItems.items.forEach(item => {
      stats = this.updateStatsItem(item, stats);
    });
    
    return stats;
  }
  
  async onQueuesLoaded(items: {[key: string]: AgentQueue}) {
    let allStats: Array<QueueStats> = [];
    
    for (const queueSid in items) {
      let stats = await this.fetchQueueStats(items[queueSid]);
      if (!stats) continue;
      
      allStats.push(stats);
      
      console.log(`Stats for queue: ${items[queueSid].queue_name}`, stats);
    }
    
    this.manager.store.dispatch(Actions.updateStats(allStats));
  }
  
  async onQueueAdded(event: LiveQueryAddedEvent<AgentQueue>) {
    console.log('Queue added', event);
    
    let stats = await this.fetchQueueStats(event.value);
    if (!stats) return;
    
    console.log(`Stats for queue: ${event.value.queue_name}`, stats);
    
    this.manager.store.dispatch(Actions.updateStats([stats]));
  }
  
  async onQueueUpdated(event: LiveQueryUpdatedEvent<AgentQueue>) {
    console.log('Queue updated', event);
    
    const state = (this.manager.store.getState() as AppState)[namespace];
    let stats = state.stats.find(queueStats => queueStats.queue.queue_sid == event.key);
    if (!stats) return;
    
    stats.queue = event.value;
    
    this.manager.store.dispatch(Actions.updateStats([stats]));
  }
  
  onStatsUpdated(queueSid: string, item: any) {
    // get existing item from state
    const state = (this.manager.store.getState() as AppState)[namespace];
    let stats = state.stats.find(queueStats => queueStats.queue.queue_sid == queueSid);
    
    if (!stats) {
      // queue removed from state, do nothing
      return;
    }
    
    console.log(`Stats update for queue ${queueSid}`, item);
    
    stats = this.updateStatsItem(item, stats);
    
    this.manager.store.dispatch(Actions.updateStats([stats]));
  }
  
  updateStatsItem(newItem: any, stats: QueueStats): QueueStats {
    switch (newItem.key) {
      case 'tasks_now':
        stats.tasks_now = (newItem.data as QueueTasksNowMap)["queue"];
        break;
      case 'tasks_thirty_minutes':
        stats.tasks_thirty_minutes = (newItem.data as QueueTasksHistoricalMap)["queue"];
        break;
      case 'tasks_today':
        stats.tasks_today = (newItem.data as QueueTasksHistoricalMap)["queue"];
        break;
      case 'worker_activities_statistics':
        stats.workers = newItem.data as QueueWorkerActivities;
        break;
      default:
    }
    
    return stats;
  }
  
  closeMaps() {
    // close all maps that were opened
    for (const queueSid in this.mapCache) {
      this.mapCache[queueSid].close();
    }
    
    this.mapCache = {};
  }
}