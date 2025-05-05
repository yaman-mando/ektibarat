export const QUESTION_ANIMATE_DEFAULT_CONFIG = {
  classes: {
    answerRect: 'answer-rect-class',
  },
  hideQuestionTopActions: false,
  showClockTicking: false,
  showAnswerRect: false,
  stopFunctionName: 'stopCapture',
  disableLazyImage: true,
};

export const getAnimationDuration = (duration: number) => duration;

/**
 * @param el : HTMLElement
 */
export const hasChildMathTag = (el: HTMLElement) => {
  if (!el) return false;

  return el.querySelector('math') !== null;
};

export const typingTimeEstimate = (numChars: number, wpm = 100) => {
  const cpm = wpm * 5;
  const timeSeconds = (numChars / cpm) * 60;
  return timeSeconds;
};
