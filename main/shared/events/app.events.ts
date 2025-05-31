import { Subject } from 'rxjs';

const useAppEvents = () => {
  //to training
  const toTrainingSub = new Subject<symbol>();
  const toTraining$ = toTrainingSub.asObservable();
  const emitToTraining = () => {
    toTrainingSub.next(Symbol());
  };

  //hello modal
  const helloModalSub = new Subject<symbol>();
  const helloModal$ = helloModalSub.asObservable();
  const emitHelloModal = () => {
    helloModalSub.next(Symbol());
  };

  //panner modal hidden
  const pannerModalHiddenSub = new Subject<symbol>();
  const pannerModalHidden$ = pannerModalHiddenSub.asObservable();
  const emitPannerModalHidden = () => {
    pannerModalHiddenSub.next(Symbol());
  };

  //survey modal
  const surveyModalSub = new Subject<symbol>();
  const surveyModal$ = surveyModalSub.asObservable();
  const emitSurveyModal = () => {
    surveyModalSub.next(Symbol());
  };

  return {
    emitToTraining,
    toTraining$,
    emitHelloModal,
    helloModal$,
    emitPannerModalHidden,
    pannerModalHidden$,
    emitSurveyModal,
    surveyModal$,
  };
};

export const appEvents = useAppEvents();
