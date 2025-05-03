import type { StudentsExamDataModel } from '~/main/modules/students-exam/data-access/models/students-exam.model';

export const useStudentsExamRepo = () => {
  const config = useRuntimeConfig();

  const baseUrl = `${config.public.apiUrl}/studentsExam`;

  const getById = async (id: string) => {
    const data = await $fetch(`${baseUrl}/${id}`, {
      method: 'GET',
    });

    return data as StudentsExamDataModel;
  };

  return {
    getById,
  };
};
