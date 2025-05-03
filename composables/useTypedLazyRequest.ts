import { useLazyAsyncData } from '#app';

export function useTypedLazyRequest<P, R = null>(
  key: string,
  requestFn: (param: P) => Promise<R>
) {
  let currentParam: P;

  const request = useLazyAsyncData(key, () => requestFn(currentParam), {
    immediate: false,
  });

  const callApi = async (param: P) => {
    currentParam = param;
    await request.execute();
    return request.data.value;
  };

  return {
    request,
    callApi,
  };
}
