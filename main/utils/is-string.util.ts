export function isStringUtil(str: unknown): str is string {
  return typeof str === 'string' || str instanceof String;
}
