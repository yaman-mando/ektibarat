// ~/mocks/mockData.ts

import type { categoriesListForModal, stepCategoryInfo, studentStages } from "~/main/modules/user-panel/data-access/user-panel.model";

// export const mockStudentStages: studentStages = {
//   "active_step_id": 11,
//   "active_phase_id": 2,
//   "show_modal_need_help": true,
//   "stages": [
//     {
//       "phase_name": "مرحلة التعارف",
//       "phase_id": 1,
//       "total_steps": 20,
//       "completed_steps": 20,
//       "total_time_remaining": 6000,
//       "color_1": "#24A7F1",
//       "color_2": "#0266D6",
//       "steps": [
//         {
//           "id": 1,
//           "title": "المسائل الحسابية",
//           "status": 2,
//           "image_path": "/images/robot.png",
//           "categoryInfo": {
//             "categoryId": 101,
//             "categoryName": "المسائل الحسابية",
//             "numberQuestion": 180,
//             "numberQuestionComplte": 144,
//             "time": 1450,
//             "isWrong": false,
//           },
//           "text_before": "دعنا نبدأ الأن",
//           "text_after": " دعنا نبدأ الأن نص بعد"
//         },
//         {
//           "id": 2,
//           "status": 2,
//           "title": "المسائل الهندسية",
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 101,
//             "categoryName": "المسائل الهندسية",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 200,
//             "time": 2000,
//             "isWrong": true
//           },
//           "text_before": "",
//           "text_after": ""
//         },
//         {
//           "id": 3,
//           "status": 2,
//           "title": "المقارنات",
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 101,
//             "categoryName": "المقارنات",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 200,
//             "time": 2000,
//             "isWrong": false
//           },
//           "text_before": "",
//           "text_after": ""
//         },
//         {
//           "id": 4,
//           "status": 1,
//           "title": "التحليل البياني",
//           "image_path": "/images/robot2.png",
//           "categoryInfo": {
//             "categoryId": 101,
//             "categoryName": "التحليل البياني",
//             "numberQuestion": 140,
//             "numberQuestionComplte": 30,
//             "time": 1655,
//             "isWrong": false
//           },
//           "text_before": "",
//           "text_after": ""
//         },
//         {
//           "id": 5,
//           "status": 0,
//           "image_path": null,
//           "title": "المسائل الجبرية",
//           "categoryInfo": {
//             "categoryId": 102,
//             "categoryName": "المسائل الجبرية",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": false
//           },
//           "text_before": "دعنا نبدأ الأن",
//           "text_after": " دعنا نبدأ الأن نص بعد"
//         },
//         {
//           "id": 6,
//           "status": 0,
//           "title": "الاستيعاب المقروء",
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 102,
//             "categoryName": "الاستيعاب المقروء",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": false
//           },
//           "text_before": "",
//           "text_after": ""
//         },
//         {
//           "id": 7,
//           "status": 0,
//           "title": "الاستيعاب المقروء",
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 102,
//             "categoryName": "الاستيعاب المقروء",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": false
//           },
//           "text_before": "",
//           "text_after": ""
//         },
//         {
//           "id": 8,
//           "status": 0,
//           "title": "الاستيعاب المقروء",
//           "image_path": "/images/robot2.png",
//           "categoryInfo": {
//             "categoryId": 102,
//             "categoryName": "الاستيعاب المقروء",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": false
//           },
//           "text_before": "",
//           "text_after": ""
//         },
//         {
//           "id": 9,
//           "status": 0,
//           "title": "الاستيعاب المقروء",
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 102,
//             "categoryName": "الاستيعاب المقروء",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": false
//           },
//           "text_before": "",
//           "text_after": ""
//         },
//         {
//           "id": 10,
//           "status": 0,
//           "title": "الاستيعاب المقروء",
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 102,
//             "categoryName": "الاستيعاب المقروء",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": false
//           },
//           "text_before": "",
//           "text_after": ""
//         },
//         {
//           "id": 11,
//           "status": 0,
//           "title": "الاستيعاب المقروء",
//           "image_path": "/images/robot2.png",
//           "categoryInfo": {
//             "categoryId": 102,
//             "categoryName": "الاستيعاب المقروء",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": false
//           },
//           "text_before": "",
//           "text_after": ""
//         }

//       ]
//     }
//     ,
//     {
//       "phase_name": "مرحلة التدريب الذكي",
//       "phase_id": 2,
//       "total_steps": 50,
//       "completed_steps": 2,
//       "total_time_remaining": 2000,
//       "color_1": "#24AFA6",
//       "color_2": "#026A66",
//       "steps": [
//         {
//           "id": 11,
//           "title": "خطوة 1: تدريب المسائل الحسابية",
//           "status": 2,
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 101,
//             "categoryName": "المسائل الحسابية",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 200,
//             "time": 2000,
//             "isWrong": false
//           }
//         },
//         {
//           "id": 12,
//           "title": "خطوة 2: تدريب المسائل الحسابية",
//           "status": 2,
//           "image_path": "/images/robot.png",
//           "categoryInfo": {
//             "categoryId": 101,
//             "categoryName": "المسائل الحسابية",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 200,
//             "time": 2000,
//             "isWrong": false
//           }
//         },
//         {
//           "id": 13,
//           "title": "خطوة 3: تدريب المسائل الحسابية",
//           "status": 1,
//           "image_path": null,
//           "categoryInfo": null
//         },
//         {
//           "id": 14,
//           "title": "خطوة 4: تدريب المسائل الحسابية",
//           "status": 0,
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 101,
//             "categoryName": "المسائل الحسابية",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": false
//           }
//         },
//         {
//           "id": 15,
//           "title": " خطوة 5: تدريب المسائل الحسابية التي اخطات بها",
//           "status": 0,
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": 101,
//             "categoryName": "المسائل الحسابية",
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": true
//           }
//         },
//         {
//           "id": 16,
//           "title": " خطوة 6اختر تصنيف جديدة",
//           "status": 0,
//           "image_path": null,
//           "categoryInfo": {
//             "categoryId": null,
//             "categoryName": null,
//             "numberQuestion": 200,
//             "numberQuestionComplte": 0,
//             "time": 2000,
//             "isWrong": true
//           }
//         }
//       ]
//     }

//   ]
// };



export const mockCategoriesForModal: categoriesListForModal =
  [
    {
      name: 'القسم الكمي',
      children: [
        { id: 101, label: 'المسائل الحسابية', disabled: false },
        { id: 102, label: 'المسائل الهندسية', disabled: false },
        { id: 103, label: 'المسائل الجبرية', disabled: false },
        { id: 104, label: 'التحليل والإحصاء', disabled: true },
      ],
    },
    {
      name: 'القسم اللفظي',
      children: [
        { id: 201, label: 'الخطأ السياقي', disabled: false },
        { id: 202, label: 'إكمال الجمل', disabled: false },
        { id: 203, label: 'المسائل الجبرية', disabled: false },
        { id: 204, label: 'التحليل والإحصاء', disabled: false },
        { id: 205, label: 'الخطأ السياقي', disabled: false },
        { id: 206, label: 'إكمال الجمل', disabled: false },
      ],
    },
  ];


export const mockCategoryInfo: stepCategoryInfo = {
  "categoryId": 101,
  "categoryName": "تجريب المسائل الهندسية",
  "numberQuestion": 188,
  "numberQuestionComplte": 140,
  "time": 1412,
  "isWrong": true
}
