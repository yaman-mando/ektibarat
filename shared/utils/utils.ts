export const sleepUtil = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
