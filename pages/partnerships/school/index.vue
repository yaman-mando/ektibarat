<template>
  <lazy-partnerships-shared-from
    :selectedType="PartnerShipFormTypesEnum.school"
  />
</template>
<script lang="ts" setup>
import { defaultMeta } from '~/main/constants/default-meta';
import { PartnerShipFormTypesEnum } from '~/main/constants/partnership-form-types.enum';

//meta
definePageMeta({
  layout: 'website-layout',
});

useHead({
  title: defaultMeta.title,
  meta: [
    {
      property: 'og:title',
      content: defaultMeta.title,
    },
    {
      name: 'keywords',
      content: defaultMeta.keywords,
    },
    {
      name: 'description',
      content: defaultMeta.description,
    },
    {
      name: 'description',
      content: defaultMeta.description,
    },
    {
      property: 'og:image',
      content: defaultMeta.img,
    },
    {
      property: 'twitter:image',
      content: defaultMeta.img,
    },
    {
      property: 'twitter:title',
      content: defaultMeta.title,
    },
    {
      property: 'twitter:description',
      content: defaultMeta.description,
    },
  ],
});
</script>
