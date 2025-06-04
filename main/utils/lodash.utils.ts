import { cloneDeep, debounce, isEqual, map, minBy, orderBy,clone } from 'lodash-es';

export const deepCloneUtil = cloneDeep;
export const cloneUtil = clone;
export const orderByUtil = orderBy;
export const minByUtil = minBy;
export const deepEqualUtil = isEqual;
export const mapUtil = map;
export const debounceUtil = debounce;
