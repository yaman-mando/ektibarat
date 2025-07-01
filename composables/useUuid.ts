import { v4 as uuidv4 } from 'uuid'
import { computed } from 'vue'

export function useUuid() {
  return computed(() => uuidv4())
}