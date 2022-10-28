module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    // 'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    '@vue/standard',
  ],
  rules: {
    'generator-star-spacing': 'off', // allow async-await
    'space-before-function-paren': 'off', // 关闭函数括号前的空格验证
    'arrow-parens': 'off', // 不强制使用圆括号括住箭头函数参数
    quotes: ['error', 'single'], // 强制使用单引号
    semi: ['error', 'never'], // 强制结尾不使用分号
    'comma-dangle': ['error', 'always-multiline'], // 使用拖尾逗号
    // 'comma-dangle': 'off', // 暂时关闭拖尾逗号告警
    'prefer-const': 'off', // 关闭建议使用 const 的规则
    // 'no-prototype-builtins': 'off',
    // 'dot-notation': 'off',
    // 'quote-props': 'off',
    // 'array-bracket-spacing': 'off',
    // 'object-curly-newline': 'off',
    // 'multiline-ternary': 'off',
    // 'no-empty': 'off',
    // 'no-unreachable-loop': 'off',
    // 'no-async-promise-executor': 'off',
    // 'no-console': 'off',
    // 'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    // 'vue/component-definition-name-casing': 'off',
    // 'vue/html-self-closing': 'off',
    // 'vue/no-mutating-props': 'off',
  },
  globals: {
    WOW: true,
  },
  overrides: [{
    files: ['*.vue'],
    rules: {
      indent: 'off',
    },
  }],
}
