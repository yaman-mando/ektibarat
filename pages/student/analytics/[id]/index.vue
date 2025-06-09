<template>
  <analytics-id-page />
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { useAuthStore } from '~/core/auth/data-access/services/useAuthStore';
import {
  webErrorPathUtil,
  webHomePathUtil,
} from '~/main/utils/web-routes.utils';
import { UserRoles } from '~/core/auth/constants/user-roles';

const store = useStore();
const authStore = useAuthStore();
const route = useRoute();
const query = route.query;
const params = route.params;
const analyticsData = ref<any | null>(null);

try {
  if (query && query['catId']) {
    if (authStore.state.userData?.role != UserRoles.teacher) {
      await navigateTo(webHomePathUtil());
    }
    analyticsData.value = await store.dispatch(
      'student/callStudentAnalyticsForTeacher',
      { studentId: params.id, catId: query['catId'] }
    );
    store.commit('student/SET_STUDENT_ID_FOR_TEACHER', params.id);
  } else {
    analyticsData.value = await store.dispatch(
      'student/callStudentAnalytics',
      params.id
    );
  }

  if (
    !query['catId'] &&
    analyticsData.value &&
    analyticsData.value.length > 0
  ) {
    await store.dispatch('student/callStudentAnalyticsChart', {
      categoryId: analyticsData.value[0].categoryId,
      period: 2,
    });
  } else {
    if (
      analyticsData.value.analyzes &&
      analyticsData.value.analyzes.length > 0
    ) {
      await store.dispatch('student/callTeacherAnalyticsChart', {
        bodyData: {
          categoryId: analyticsData.value.analyzes[0].categoryId,
          period: 2,
        },
        id: analyticsData.value.studentId,
      });
    }
  }
} catch (e) {
  console.log('student-analytics: ' + e);
  await navigateTo(webErrorPathUtil());
}

definePageMeta({
  layout: 'website-layout',
});
</script>
