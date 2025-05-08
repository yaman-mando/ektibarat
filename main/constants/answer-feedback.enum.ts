export const ANSWER_FEEDBACK_ENUM = Object.freeze({
  text: 0,
  photo: 1,
  video: 2,
  audio: 3,
} as const);

export type AnswerFeedbackEnumType =
  (typeof ANSWER_FEEDBACK_ENUM)[keyof typeof ANSWER_FEEDBACK_ENUM];
