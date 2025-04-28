import { configure, defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import ar from '@vee-validate/i18n/dist/locale/ar.json';

export const setupVeeValidate = () => {
  Object.entries(all).forEach(([rule, fn]) => {
    defineRule(rule, fn);
  });

  const customArabicMessages = {
    ...ar,
    messages: {
      ...ar.messages,
      required: 'هذا الحقل مطلوب',
      email: 'يجب إدخال بريد إلكتروني صحيح',
      min: 'يجب أن يحتوي على الأقل على {length} أحرف',
    },
  };

  configure({
    generateMessage: localize({
      ar: customArabicMessages,
    }),
    validateOnInput: true,
  });

  setLocale('ar');
};
