import type { ProjectSettingsRegistrationMethodDataModel } from '~/main/modules/project-settings/data-access/project-settings.model';

export const useProjectSettingsRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/projectSettings`;

  const getRegistrationMethod = async () => {
    const data = await $fetch(`${baseUrl}/registrationMethod`, {
      method: 'GET',
    });

    return data as ProjectSettingsRegistrationMethodDataModel;
  };

  return {
    getRegistrationMethod,
  };
};
