import { Subject } from 'rxjs';

export type SignInActionDataUiModel = {
  id: number;
  email: string | null;
  token: string;
  refreshToken: string | null;
  showWelcomeModal: boolean;
};

const useAuthEvents = () => {
  const eventSubject = new Subject<SignInActionDataUiModel>();

  const events$ = eventSubject.asObservable();

  const emitSignIn = (data: SignInActionDataUiModel) => {
    eventSubject.next(data);
  };

  const destroy = () => {
    eventSubject.complete();
  };

  return {
    destroy,
    emitSignIn,
    events$,
  };
};

export const authEvents = useAuthEvents();
