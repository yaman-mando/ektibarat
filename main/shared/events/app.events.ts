import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';

//TODO-z handle $on - $off events
type AppEventsModel = 'toTraining';
const useAppEvents = () => {
  const eventSub = new Subject<AppEventsModel>();
  const events$ = eventSub.asObservable() as Observable<AppEventsModel>;

  const emitEvent = (data: AppEventsModel) => {
    eventSub.next(data);
  };

  return {
    emitEvent,
    events$,
  };
};

export const appEvents = useAppEvents();
