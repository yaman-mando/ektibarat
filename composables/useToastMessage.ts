import { useToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from 'primevue';

const defaultOptions: Pick<ToastMessageOptions, 'summary' | 'life'> = {
  summary: 'عذراً، حدث خطأ غير متوقع.',
  life: 3000,
};

export const useToastMessage = () => {
  const toast = useToast();

  const showSuccess = ({
    summary,
    detail,
    life,
  }: Partial<ToastMessageOptions> = {}) => {
    toast.add({
      severity: 'success',
      summary: summary ?? defaultOptions.summary,
      detail,
      life: life ?? defaultOptions.life,
    });
  };

  const showError = ({
    summary,
    detail,
    life,
  }: Partial<ToastMessageOptions> = {}) => {
    toast.add({
      severity: 'error',
      summary: summary ?? defaultOptions.summary,
      detail,
      life: life ?? defaultOptions.life,
    });
  };

  const showInfo = ({
    summary,
    detail,
    life,
  }: Partial<ToastMessageOptions> = {}) => {
    toast.add({
      severity: 'info',
      summary: summary ?? defaultOptions.summary,
      detail,
      life: life ?? defaultOptions.life,
    });
  };

  const showWarn = ({
    summary,
    detail,
    life,
  }: Partial<ToastMessageOptions> = {}) => {
    toast.add({
      severity: 'warn',
      summary: summary ?? defaultOptions.summary,
      detail,
      life: life ?? defaultOptions.life,
    });
  };

  return { showSuccess, showError, showInfo, showWarn };
};
