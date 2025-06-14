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
          //prevent usage: '$route' as watcher
          {
            selector: 'Property[key.type="Literal"][key.value=/^\\$route/]',
            message: 'do not use',
          },
          //end
          //start rule: prevent watcher for start with ('$store)
          {
            // Catches: '$store.state.x', '$store.getters.x', etc.
            selector: 'Property[key.type="Literal"][key.value=/^\\$store/]',
            message:
              'Do not directly watch $store paths. Use a computed property or Vuex helpers (mapState/mapGetters) instead.',
          },
          {
            // Catches: `$store.state.${dynamicPath}` (template literals)
            selector: 'TemplateLiteral[quasis.0.value.raw^="$store."]',
            message:
              'Do not directly watch dynamic $store paths. Use a computed property instead.',
          },
          //end
          {
            selector:
              'ExportDefaultDeclaration > ObjectExpression > Property[key.name="setup"][value.async=true]',
            message:
              'Do not use async setup(). Use regular setup() and composables instead.',
          },
          {
            selector:
              "MemberExpression[object.property.name='state'][property.name='userCurrentSub']",
            message:
              'Do not use userCurrentSub from $store.state. Use useSubscriptionsStore().',
          },
          //start
          {
            selector:
              "CallExpression[callee.property.name='dispatch'] Literal[value='getFile1Static']",
            message: 'Usage forbidden',
          },
          {
            selector:
              "MemberExpression[object.property.name='state'][property.name='file1PanelStatic']",
            message: 'Do not use ',
          },
          //end
          {
            selector:
              "MemberExpression[object.property.name='state'][property.name='globalTypeUser']",
            message: 'Do not use globalTypeUser from $store.state.',
          },
          {
            selector:
              "MemberExpression[object.property.name='state'][property.name='userServicesState']",
            message:
              'Do not use userServicesState from $store.state. Use useSubscriptionsStore().',
          },
          {
            selector:
              "CallExpression[callee.property.name='commit'] Literal[value='SET_GLOBAL_TYPE_USER']",
            message: "Usage of 'SET_GLOBAL_TYPE_USER' commit is forbidden.",
          },
          //start block modal
          {
            selector:
              "CallExpression[callee.property.name='commit'] Literal[value='SET_SHOW_BLOCK_MODAL']",
            message: "Usage of 'SET_SHOW_BLOCK_MODAL' commit is forbidden.",
          },
          {
            selector:
              "MemberExpression[object.property.name='state'][property.name='showBlockModal']",
            message: 'forbidden use globalStore',
          },
          //end block modal
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
