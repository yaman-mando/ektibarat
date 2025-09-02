import type {
  StudentsExamDataModel,
  StudentsExamPartDataModel,
  StudentsExamPartQuestionDataModel,
} from '~/main/modules/students-exam/data-access/models/students-exam.model';

const MOCK_DATA = {
  id: '68b2e067b3359e494afa1ec2',
  title: 'فحص تجريبي',
  createdDate: '2025-08-30T00:00:00+01:00',
  studentId: 12853,
  deviceId: null,
  startTime: '2025-08-30T12:28:39.701+01:00',
  endTime: null,
  currentQuestionId: null,
  currentPartId: null,
  degree: 25,
  totalPoints: 0,
  remainTime: 0,
  duration: 1440,
  state: 1,
  subjectId: 1,
  subjectName: 'قدرات',
  isManual: false,
  showHelp: false,
  stepId: 48,
  examParts: [
    {
      id: '68b2e069b3359e494afa1ec3',
      examDetailId: 26,
      title: 'مسائل حسابية',
      duration: 180,
      categoryDescription: '<p>المسائل الحسابية شرح</p>',
      isCategoryText: false,
      sort: 3,
      calculatorExist: false,
      pointsSettings: [
        { questionLevel: 0, period: 38, pointsCount: 3 },
        { questionLevel: 0, period: 60, pointsCount: 2 },
        { questionLevel: 1, period: 38, pointsCount: 3 },
        { questionLevel: 1, period: 60, pointsCount: 2 },
        { questionLevel: 2, period: 38, pointsCount: 3 },
        { questionLevel: 2, period: 60, pointsCount: 2 },
        { questionLevel: 0, period: 120, pointsCount: 1 },
        { questionLevel: 1, period: 120, pointsCount: 1 },
        { questionLevel: 2, period: 120, pointsCount: 1 },
      ],
      studentsQuestion: [
        {
          id: '68b2e069b3359e494afa1f87',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f8c',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f91',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f96',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
      ],
      children: [],
    },
    {
      id: '68b2e069b3359e494afa1ec4',
      examDetailId: 27,
      title: 'المسائل الهندسية',
      duration: 1500,
      categoryDescription: null,
      isCategoryText: false,
      sort: 4,
      calculatorExist: false,
      pointsSettings: [
        { questionLevel: 0, period: 36, pointsCount: 3 },
        { questionLevel: 0, period: 60, pointsCount: 2 },
        { questionLevel: 1, period: 36, pointsCount: 3 },
        { questionLevel: 1, period: 60, pointsCount: 2 },
        { questionLevel: 2, period: 36, pointsCount: 3 },
        { questionLevel: 2, period: 60, pointsCount: 2 },
        { questionLevel: 0, period: 120, pointsCount: 1 },
        { questionLevel: 1, period: 120, pointsCount: 1 },
        { questionLevel: 2, period: 120, pointsCount: 1 },
      ],
      studentsQuestion: [
        {
          id: '68b2e069b3359e494afa1ef6',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1efb',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f00',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f05',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f0a',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
      ],
      children: [],
    },
    {
      id: '68b2e069b3359e494afa1ec7',
      examDetailId: 30,
      title: 'اللفظي',
      duration: 1800,
      categoryDescription: null,
      isCategoryText: false,
      sort: 8,
      calculatorExist: false,
      pointsSettings: [
        { questionLevel: 0, period: 17, pointsCount: 3 },
        { questionLevel: 0, period: 60, pointsCount: 2 },
        { questionLevel: 1, period: 17, pointsCount: 3 },
        { questionLevel: 1, period: 60, pointsCount: 2 },
        { questionLevel: 2, period: 17, pointsCount: 3 },
        { questionLevel: 2, period: 60, pointsCount: 2 },
        { questionLevel: 0, period: 120, pointsCount: 1 },
        { questionLevel: 1, period: 120, pointsCount: 1 },
        { questionLevel: 2, period: 120, pointsCount: 1 },
      ],
      studentsQuestion: [
        {
          id: '68b2e069b3359e494afa1f41',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f46',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f4b',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f50',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f55',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f5a',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f5f',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f64',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f69',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
      ],
      children: [
        {
          id: null,
          examDetailId: 0,
          title: 'استيعاب المقروء',
          duration: 300,
          categoryDescription: null,
          isCategoryText: true,
          sort: 9,
          calculatorExist: false,
          pointsSettings: [
            { questionLevel: 0, period: 10, pointsCount: 3 },
            { questionLevel: 0, period: 60, pointsCount: 2 },
            { questionLevel: 1, period: 10, pointsCount: 3 },
            { questionLevel: 1, period: 60, pointsCount: 2 },
            { questionLevel: 2, period: 10, pointsCount: 3 },
            { questionLevel: 2, period: 60, pointsCount: 2 },
            { questionLevel: 0, period: 120, pointsCount: 1 },
            { questionLevel: 1, period: 120, pointsCount: 1 },
            { questionLevel: 2, period: 120, pointsCount: 1 },
          ],
          studentsQuestion: [],
          children: [
            {
              id: '68b2e069b3359e494afa1ec8',
              examDetailId: 30,
              title: 'المسؤولية',
              duration: 300,
              categoryDescription:
                '<p>من الضروري أن نمنح أبناءنا المهام منذ الصغر ليتعلموا تحمل المسؤولية ويتعودوا على الاعتماد على أنفسهم. كما يجب توعية الآباء بأن خوفهم الزائد على أبنائهم، والذي يدفعهم لتجنب منحهم المهام الصعبة، قد يؤدي إلى تكوين عادة الاتكالية لدى الأبناء، مما يجعلهم أقل قدرة على مواجهة التحديات ويطور فيهم الكسل.</p>\n',
              isCategoryText: true,
              sort: 0,
              calculatorExist: false,
              pointsSettings: [
                { questionLevel: 0, period: 17, pointsCount: 3 },
                { questionLevel: 0, period: 30, pointsCount: 2 },
                { questionLevel: 0, period: 60, pointsCount: 1 },
                { questionLevel: 1, period: 17, pointsCount: 3 },
                { questionLevel: 1, period: 30, pointsCount: 2 },
                { questionLevel: 1, period: 60, pointsCount: 1 },
                { questionLevel: 2, period: 17, pointsCount: 3 },
                { questionLevel: 2, period: 30, pointsCount: 2 },
                { questionLevel: 2, period: 60, pointsCount: 1 },
              ],
              studentsQuestion: [
                {
                  id: '68b2e069b3359e494afa1f6e',
                  questionState: 0,
                  isFlagged: false,
                  isFeatured: false,
                },
                {
                  id: '68b2e069b3359e494afa1f73',
                  questionState: 0,
                  isFlagged: false,
                  isFeatured: false,
                },
                {
                  id: '68b2e069b3359e494afa1f78',
                  questionState: 0,
                  isFlagged: false,
                  isFeatured: false,
                },
                {
                  id: '68b2e069b3359e494afa1f7d',
                  questionState: 0,
                  isFlagged: false,
                  isFeatured: false,
                },
                {
                  id: '68b2e069b3359e494afa1f82',
                  questionState: 0,
                  isFlagged: false,
                  isFeatured: false,
                },
              ],
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: '68b2e069b3359e494afa1ec6',
      examDetailId: 29,
      title: 'التناظر اللفظي - اكمال الجمل',
      duration: 1500,
      categoryDescription: null,
      isCategoryText: false,
      sort: 10,
      calculatorExist: false,
      pointsSettings: [
        { questionLevel: 0, period: 15, pointsCount: 3 },
        { questionLevel: 0, period: 60, pointsCount: 2 },
        { questionLevel: 1, period: 15, pointsCount: 3 },
        { questionLevel: 1, period: 60, pointsCount: 2 },
        { questionLevel: 2, period: 15, pointsCount: 3 },
        { questionLevel: 2, period: 60, pointsCount: 2 },
        { questionLevel: 0, period: 120, pointsCount: 1 },
        { questionLevel: 1, period: 120, pointsCount: 1 },
        { questionLevel: 2, period: 120, pointsCount: 1 },
      ],
      studentsQuestion: [
        {
          id: '68b2e069b3359e494afa1f0f',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f14',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f19',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f1e',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f23',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f28',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f2d',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f32',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f37',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1f3c',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
      ],
      children: [],
    },
    {
      id: '68b2e069b3359e494afa1ec5',
      examDetailId: 28,
      title: 'البيانات مقارنات',
      duration: 1320,
      categoryDescription: null,
      isCategoryText: false,
      sort: 100,
      calculatorExist: false,
      pointsSettings: [
        { questionLevel: 0, period: 29, pointsCount: 3 },
        { questionLevel: 0, period: 60, pointsCount: 2 },
        { questionLevel: 1, period: 29, pointsCount: 3 },
        { questionLevel: 1, period: 60, pointsCount: 2 },
        { questionLevel: 2, period: 29, pointsCount: 3 },
        { questionLevel: 2, period: 60, pointsCount: 2 },
        { questionLevel: 0, period: 120, pointsCount: 1 },
        { questionLevel: 1, period: 120, pointsCount: 1 },
        { questionLevel: 2, period: 120, pointsCount: 1 },
      ],
      studentsQuestion: [
        {
          id: '68b2e069b3359e494afa1ec9',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1ece',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1ed3',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1ed8',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1edd',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1ee2',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1ee7',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1eec',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
        {
          id: '68b2e069b3359e494afa1ef1',
          questionState: 0,
          isFlagged: false,
          isFeatured: false,
        },
      ],
      children: [],
    },
  ],
} as any;

export const mapExamDetailModelToUi = (model: StudentsExamDataModel) => {
  model.examParts.forEach((part) => {
    if (part.isCategoryText && part.children?.length) {
      part.children.forEach((child) => {
        child.studentsQuestion.forEach((question) => {
          question.articleUi = child.categoryDescription;
          part.studentsQuestion.push(question);
        });
      });
    }

    if (part.children?.length === 1) {
      const child = part.children[0];
      if (child.isCategoryText && child.id === null) {
        child.children?.forEach((grandchild) => {
          grandchild.studentsQuestion.forEach((question) => {
            part.studentsQuestion.push(question);
          });
        });
      }
    }

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
