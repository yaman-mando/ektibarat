import type { StudentsExamDataModel } from '~/main/modules/students-exam/data-access/models/students-exam.model';

export const mapExamDetailModelToUi = (model: StudentsExamDataModel) => {
  model.examParts.forEach((part) => {
    //in case article is parent part
    if (part.isCategoryText) {
      const firstArticlePart = part.children[0];
      firstArticlePart.studentsQuestion.forEach((ques) => {
        ques.articleUi = firstArticlePart.categoryDescription;
        part.studentsQuestion.push(ques);
      });
    }

    //in case article is nested in another part
    part.children.forEach((innerPart) => {
      if (innerPart.isCategoryText) {
        innerPart.children.forEach((articlePart) => {
          articlePart.studentsQuestion.forEach((question) => {
            question.articleUi = articlePart.categoryDescription;
            part.studentsQuestion.push(question);
          });
        });
      }
    });
  });

  return model;
};
