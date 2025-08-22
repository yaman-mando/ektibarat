export const APP_ENVS = {
  prod: 'prod',
  local_prod: 'local_prod',
  dev: 'dev',
  local_dev: 'local_dev',
};
export const currentEnv = APP_ENVS.dev;

export const getEnv = () => {
  const buildEnvOptions = {
    [APP_ENVS.prod]: {
      websiteUrl: 'https://ekhtibarat.com',
      baseUrl: 'https://ekhtibarat.com/root',
      baseImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonFiles: 'https://media.ekhtibarat.com/prod/JsonFilesFolder',
      socialPlansBaseUrl: 'https://api.ekhtibarat.com/social/staticContent',
      paymentKey: 'pk_live_qpFZP5nJDm4CB7rwXjY0zuOf',
      ALGOLIA_API_KEY: '5704291ecfe824310415614e12299ca8',
      ALGOLIA_APPLICATION_ID: '7NEGIC2FM0',
      ALGOLIA_QUESTION_INDEX: 'questions_index',
      defaultSubjectId: 1,
      defaultSubjectIdTahsele: 3,
      vapId:
        'BPcahsjD5j8Su-8rMVNrVXVKZ_hVzn0WHbC64cQ7PG2VZ13QWmWRteLulsb9LRtHNNvsbapraQ5cCLCpnaWLzBY',
      firebaseConfig: {
        apiKey: 'AIzaSyA_26zXV-dLJIFIzay4I7z3aa0mta0_i_Q',
        authDomain: 'ekhtibarat-1703573629722.firebaseapp.com',
        projectId: 'ekhtibarat-1703573629722',
        databaseURL:
          'https://ekhtibarat-1703573629722-default-rtdb.europe-west1.firebasedatabase.app/',
        storageBucket: 'ekhtibarat-1703573629722.appspot.com',
        messagingSenderId: '930044743699',
        appId: '1:930044743699:web:e43ca0fb0a283b5796efe6',
        measurementId: 'G-ZZHKE5C3MW',
        slackWebhookUrl:
          'https://hooks.slack.com/services/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',
      },
      configData: {
        byPassSubscribedUser: false,
      },
    },
    [APP_ENVS.local_prod]: {
      websiteUrl: 'https://ekhtibarat.com',
      baseUrl: 'https://ekhtibarat.com/root',
      baseImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonFiles: 'https://media.ekhtibarat.com/prod/JsonFilesFolder',
      socialPlansBaseUrl: 'https://api.ekhtibarat.com/social/staticContent',
      paymentKey: 'pk_test_fIzOXAqYytpbNFj6Qgmh1TuM',
      ALGOLIA_API_KEY: '5704291ecfe824310415614e12299ca8',
      ALGOLIA_APPLICATION_ID: '7NEGIC2FM0',
      ALGOLIA_QUESTION_INDEX: 'questions_index',
      defaultSubjectId: 1,
      defaultSubjectIdTahsele: 3,
      vapId:
        'BPcahsjD5j8Su-8rMVNrVXVKZ_hVzn0WHbC64cQ7PG2VZ13QWmWRteLulsb9LRtHNNvsbapraQ5cCLCpnaWLzBY',
      firebaseConfig: {
        apiKey: 'AIzaSyA_26zXV-dLJIFIzay4I7z3aa0mta0_i_Q',
        authDomain: 'ekhtibarat-1703573629722.firebaseapp.com',
        projectId: 'ekhtibarat-1703573629722',
        databaseURL:
          'https://ekhtibarat-1703573629722-default-rtdb.europe-west1.firebasedatabase.app/',
        storageBucket: 'ekhtibarat-1703573629722.appspot.com',
        messagingSenderId: '930044743699',
        appId: '1:930044743699:web:e43ca0fb0a283b5796efe6',
        measurementId: 'G-ZZHKE5C3MW',
        slackWebhookUrl:
          'https://hooks.slack.com/services/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',
      },
      /*vapId:
        'BPcahsjD5j8Su-8rMVNrVXVKZ_hVzn0WHbC64cQ7PG2VZ13QWmWRteLulsb9LRtHNNvsbapraQ5cCLCpnaWLzBY',
      firebaseConfig: {
        apiKey: 'AIzaSyA_26zXV-dLJIFIzay4I7z3aa0mta0_i_Q',
        authDomain: 'ekhtibarat-1703573629722.firebaseapp.com',
        projectId: 'ekhtibarat-1703573629722',
        databaseURL:
          'https://ekhtibarat-1703573629722-default-rtdb.europe-west1.firebasedatabase.app/',
        storageBucket: 'ekhtibarat-1703573629722.appspot.com',
        messagingSenderId: '930044743699',
        appId: '1:930044743699:web:e43ca0fb0a283b5796efe6',
        measurementId: 'G-ZZHKE5C3MW',
      },*/
      configData: {
        byPassSubscribedUser: false,
      },
    },
    [APP_ENVS.dev]: {
      websiteUrl: 'http://37.27.63.239:8030',
      baseUrl: 'http://37.27.63.239:8030/root',
      baseImageUrl: 'https://media.ekhtibarat.com/dev',
      jsonImageUrl: 'https://media.ekhtibarat.com/prod',
      jsonFiles: 'https://media.ekhtibarat.com/dev/JsonFilesFolder',
      socialPlansBaseUrl: 'https://devapi.ekhtibarat.com/social/staticContent',
      paymentKey: 'pk_test_fIzOXAqYytpbNFj6Qgmh1TuM',
      ALGOLIA_API_KEY: '29de583c1e969e38148a2500632c1d9e',
      ALGOLIA_APPLICATION_ID: '0GVYPCEO46',
      ALGOLIA_QUESTION_INDEX: 'questions_index',
      defaultSubjectId: 1,
      defaultSubjectIdTahsele: 3,
      vapId:
        'BEvf10GX-bJCQoFE_Uq-6YRaB2IkojY33u8DNWyhvno6vc4LDFRHj8QVq7k-wS6e3oKtKi1sKus1gW1x8LGrovU',
      firebaseConfig: {
        apiKey: 'AIzaSyBRLQQmksNfHrhE9V7V6goX4tuqK-qiZ0M',
        authDomain: 'ekhtibarat-dev.firebaseapp.com',
        projectId: 'ekhtibarat-dev',
        databaseURL: 'https://ekhtibarat-dev-default-rtdb.firebaseio.com',
        storageBucket: 'ekhtibarat-dev.appspot.com',
        messagingSenderId: '637123427639',
        appId: '1:637123427639:web:25823d1ddb1bb10701eeb2',
        measurementId: 'G-BJLKK55FNQ',
        slackWebhookUrl: '',
      },
      configData: {
        byPassSubscribedUser: false,
      },
    },
  };
  buildEnvOptions[APP_ENVS.local_dev] = buildEnvOptions[APP_ENVS.dev];
  return buildEnvOptions[currentEnv];
};
