import type {
  StudentsExamDataModel,
  StudentsExamPartDataModel,
  StudentsExamPartQuestionDataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam.model';

export const mapExamDetailModelToUi = (model: StudentsExamDataModel) => {
  model.examParts.forEach((part) => {
    if (part.isCategoryText && part.children?.length) {
      // collect all questions from children into the parent
      part.children.forEach((child) => {
        child.studentsQuestion.forEach((question) => {
          question.articleUi = child.categoryDescription;
          part.studentsQuestion.push(question);
        });
      });
    }

    // still handle nested category parts inside children
    part.children?.forEach((innerPart) => {
      if (innerPart.isCategoryText && innerPart.children?.length) {
        innerPart.children.forEach((articlePart) => {
          articlePart.studentsQuestion.forEach((question) => {
            question.articleUi = articlePart.categoryDescription;
            innerPart.studentsQuestion.push(question);
          });
        });
      }
    });
  });

  return model;
};

export const getAllQuestionsInExam = (
  exam: StudentsExamDataModel
): StudentsExamPartQuestionDataModel[] => {
  const allQuestions: StudentsExamPartQuestionDataModel[] = [];

  function collectQuestionsInPart(part: StudentsExamPartDataModel): void {
    if (part.studentsQuestion.length) {
      allQuestions.push(...part.studentsQuestion);
    }

    // only traverse children if NOT a categoryText part
    if (!part.isCategoryText && part.children.length) {
      part.children.forEach((child) => collectQuestionsInPart(child));
    }
  }

  if (exam.examParts.length) {
    exam.examParts.forEach((part) => collectQuestionsInPart(part));
  }

  return allQuestions;
};
