import { differenceInSeconds } from 'date-fns';

export const isTokenExpiredUtil = (
  expireDate: string | null | undefined,
  thresholdSeconds = 20
): boolean => {
  if (!expireDate) return false;

  const expire = new Date(expireDate);
  if (isNaN(expire.getTime())) return true;

  const diff = differenceInSeconds(expire, new Date());
  console.log(diff);
  return diff <= thresholdSeconds;
};
