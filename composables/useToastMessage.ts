import { useToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from 'primevue';

const defaultOptions: Pick<ToastMessageOptions, 'summary' | 'life'> = {
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
      summary: summary ?? 'تمت العملية بنجاح.',
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
      summary: summary ?? 'عذراً، حدث خطأ في الطلب.',
      detail,
      life: life ?? defaultOptions.life,
    });
  };

  const showWarn = ({ summary, detail, life }: WarnType) => {
    toast.add({
      severity: 'warn',
      summary: summary,
      detail,
      life: life ?? defaultOptions.life,
    });
  };

  return { showSuccess, showError, showWarn };
};

type WarnType = { summary: string } & Partial<
  Omit<ToastMessageOptions, 'summary'>
>;
