export default {
  customSyntax: 'postcss-scss',
  extends: ['stylelint-config-standard-scss'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // Safari 15 is a declared build target; range media syntax requires newer Safari.
    'media-feature-range-notation': 'prefix',
    // Existing component contracts use BEM element/modifier classes.
    'selector-class-pattern': '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$',
    // Vue scoped styles support these pseudo classes.
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],
  },
}
