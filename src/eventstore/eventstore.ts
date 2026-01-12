import { EventType } from "./types";
import { EventEmitter } from 'events'

export const eventstore = () =>{
  const events: EventType[] = [];
  const eventEmitter = new EventEmitter();
  
  const commitEvent = (event: EventType) : void => {
    events.push(event);
    eventEmitter.emit(event.name, event);
  };
  
  const getEvents = () : EventType[] => {
    return events;
  };

  return {
    commitEvent,
    getEvents,
    onEvent: (eventName: string, callback: (event: EventType) => void) => {
      eventEmitter.on(eventName, callback);
    },
  };

}
