<template>
  <section></section>
</template>
<script setup lang="ts">
import { webErrorPathUtil } from '~/main/utils/web-routes.utils';

//catch any unmatched route - server and client
navigateTo(webErrorPathUtil(), { replace: true });
</script>
