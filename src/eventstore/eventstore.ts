import { EventType } from "./types";
import { EventEmitter } from 'events'

export const eventstore = () =>{
  const events: EventType[] = [];
  const eventEmitter = new EventEmitter();
  
  const commitEvent = async (event: EventType) : Promise<void> => {
    events.push(event);
    eventEmitter.emit(event.name, event);
  };
  
  const getEvents = async ( accountId: string ) : Promise<EventType[]> => {
    return events.filter(event => event.accountId === accountId);
  };

  return {
    commitEvent,
    getEvents,
    onEvent: (eventName: string, callback: (event: EventType) => void) => {
      eventEmitter.on(eventName, callback);
    },
  };

}
