import type { VuexRootState } from '~/store';
import type { VuexSubsState } from '~/store/subs-vuex.store';
import type { VuexStudentState } from '~/store/student-vuex.store';
import type { VuexAdminState } from '~/store/admin/admin-vuex.store';

declare module 'vuex' {
  export interface Store<S> {
    state: S &
      VuexRootState & {
        subs: VuexSubsState;
        student: VuexStudentState;
        admin: VuexAdminState;
      };
  }
}
