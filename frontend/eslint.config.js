import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint' // Добавь этот импорт

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    // Расширяем рекомендуемыми правилами для JS и TS
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'], // Применяем к TS файлам
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // Подключаем парсер, который понимает 'interface'
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off', // Отключаем базовый JS-правило
    },
  },
)
