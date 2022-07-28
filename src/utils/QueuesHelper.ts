import LiveQueryHelper, { LiveQueryAddedEvent, LiveQueryUpdatedEvent } from "./LiveQueryHelper";

export interface AgentQueue {
  queue_name: string;
  date_updated: string;
  workspace_sid: string;
  queue_sid: string;
}

export default class QueuesHelper extends LiveQueryHelper<AgentQueue> {
  constructor(onInit: (items: {[key: string]: AgentQueue}) => void, 
              onItemAdded: (event: LiveQueryAddedEvent<AgentQueue>) => void, 
              onItemUpdated: (event: LiveQueryUpdatedEvent<AgentQueue>) => void) {
    super('tr-queue', '');
    this.initQuery(onInit);
    this.onItemAdded = onItemAdded;
    this.onItemUpdated = onItemUpdated;
  }
  
  private initQuery(onInit: (items: {[key: string]: AgentQueue}) => void) {
    this.startLiveQuery().then(onInit);
  }
}