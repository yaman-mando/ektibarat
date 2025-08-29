import { Subject } from 'rxjs';

export type SignInActionDataUiModel = {
  id: number;
  email: string | null;
  token: string;
  refreshToken: string | null;
  tokenExpireDate: string;
  showWelcomeModal: boolean;
};

const useAuthEvents = () => {
  const signInDataSub = new Subject<SignInActionDataUiModel>();
  const signInData$ = signInDataSub.asObservable();

  const emitSignIn = (data: SignInActionDataUiModel) => {
    signInDataSub.next(data);
  };

  const destroy = () => {
    signInDataSub.complete();
  };

  return {
    destroy,
    emitSignIn,
    signInData$,
  };
};

export const authEvents = useAuthEvents();
