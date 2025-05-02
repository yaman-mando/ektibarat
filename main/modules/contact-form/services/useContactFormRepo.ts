import type { ContactFormDTOModel } from '~/main/modules/contact-form/data-access/contact-form.model';

export const useContactFormRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/contactForm`;

  const add = async (model: ContactFormDTOModel) => {
    const data = await $fetch(`${baseUrl}`, {
      method: 'POST',
      body: model,
    });

    return data;
  };

  return {
    add,
  };
};
