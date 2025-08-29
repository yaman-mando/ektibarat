import { differenceInSeconds } from 'date-fns';

export const tokenThresholdSeconds = 30;
export const isTokenExpiredUtil = (
  expireDate: string | null | undefined
): boolean => {
  if (!expireDate) return false;

  const expire = new Date(expireDate);
  if (isNaN(expire.getTime())) return true;

  const diff = differenceInSeconds(expire, new Date());
  // console.log(diff - tokenThresholdSeconds, 'remain');
  return diff <= tokenThresholdSeconds;
};
