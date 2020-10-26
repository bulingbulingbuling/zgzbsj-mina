module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    '@megalo/standard'
  ],
  rules: {
    'no-extra-semi': 0,
    'semi': 0,
    'space-before-function-paren': 0,
    'no-return-await': 0,
    'camelcase': 0,
    'vue/no-use-v-if-with-v-for': 0
  },
}
