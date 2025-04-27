// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  // @ts-ignore
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
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
  }
);
