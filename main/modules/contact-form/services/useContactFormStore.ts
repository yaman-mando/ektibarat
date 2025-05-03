import { defineStore } from 'pinia';
import { useContactFormRepo } from '~/main/modules/contact-form/services/useContactFormRepo';
import type { ContactFormDTOModel } from '~/main/modules/contact-form/data-access/contact-form.model';

export const useContactFormStore = defineStore('contact-form-store', () => {
  const repo = useContactFormRepo();

  const add = async (model: ContactFormDTOModel) => {
    return await repo.add(model);
  };

  return {
    //actions
    add,
  };
});
