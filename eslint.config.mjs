// @ts-ignore
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  [
    {
      rules: {
        //strict prop
        'no-restricted-syntax': [
          'error',
          {
            selector:
              "MemberExpression[object.property.name='state'][property.name='userCurrentSub']",
            message:
              'Do not use userCurrentSub from $store.state. Use useSubscriptionsStore().',
          },
          {
            selector:
              "CallExpression[callee.property.name='commit'] Literal[value='SET_GLOBAL_TYPE_USER']",
            message: "Usage of 'SET_GLOBAL_TYPE_USER' commit is forbidden.",
          },
          {
            selector:
              "CallExpression[callee.property.name='commit'] Literal[value='SET_GLOBAL_TYPE']",
            message: "Usage of 'SET_GLOBAL_TYPE' commit is forbidden.",
          },
          {
            selector:
              "CallExpression[callee.property.name='dispatch'] Literal[value='getUserCurrentSub']",
            message: 'Usage forbidden',
          },
          {
            selector: 'CallExpression[callee.name="$t"]', // Blocks $t()
            message:
              'Do not use $t() directly. Use the `useI18n()` composable instead.',
          },
          {
            selector: 'MemberExpression[property.name="$t"]', // Blocks this.$t() or obj.$t()
            message: 'Do not use $t(). Use the `useI18n()` composable instead.',
          },
        ],
        'no-restricted-properties': [
          'error',
          {
            object: '$store.state',
            property: 'userServicesState',
            message:
              'Do not use $store.state.userServicesState. Use useSubscriptionsStore.',
          },
          {
            object: 'state',
            property: 'globalType',
            message: '',
          },
          {
            object: 'state',
            property: 'globalTypeUser',
            message: '',
          },
          {
            object: 'state',
            property: 'layoutStatic',
            message: '',
          },
          {
            object: 'process',
            property: 'env',
            message:
              'Do not use process.env directly. Use a config utility/module instead.',
          },
          {
            object: 'this',
            property: '$t',
            message: 'Use useI18n() instead of this.$t().',
          },
        ],
        //end strict prop
        'no-useless-catch': 'off',
        'no-restricted-imports': [
          'error',
          {
            paths: ['lodash-es'],
          },
        ],
        '@typescript-eslint/unified-signatures': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-use-before-define': 'off', // disable base rule if using TS version
        '@typescript-eslint/no-unused-vars': [
          'off',
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        'vue/component-name-in-template-casing': [
          'error',
          'kebab-case',
          {
            registeredComponentsOnly: false,
          },
        ],
        'vue/require-default-prop': 'off',
        'vue/v-on-event-hyphenation': ['error', 'never'],
        'vue/attribute-hyphenation': [
          'error',
          'never',
          {
            ignore: [
              'hydrate-after',
              'hydrate-on-interaction',
              'hydrate-on-visible',
            ],
          },
        ],
        'vue/html-self-closing': [
          'error',
          {
            html: {
              void: 'always',
              normal: 'never',
              component: 'always',
            },
            svg: 'always',
            math: 'always',
          },
        ],
      },
    },
    // Override for lodash.utils.ts
    {
      files: ['./main/utils/lodash.utils.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ]
);
