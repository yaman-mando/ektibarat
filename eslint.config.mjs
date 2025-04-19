// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // '@typescript-eslint/no-use-before-define': [
      //   'error',
      //   { functions: true, classes: true, variables: true },
      // ],
      'no-use-before-define': 'off', // disable base rule if using TS version
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ThisExpression',
          message:
            '`this` is not allowed in `<script setup>` or Composition API. Use direct refs/imports instead.',
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
    },
  }
);
