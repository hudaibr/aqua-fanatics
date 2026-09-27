import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    // `components/ui` and `hooks/use-toast` are vendored shadcn/ui primitives
    // kept for upcoming UI work. They predate the React Compiler lint rules and
    // would otherwise be rewritten by hand on every dependency bump, so the
    // compiler-specific rules are relaxed for them only. Application code in
    // `app/`, `components/market/` and `hooks/*` stays under the strict rules.
    files: ['components/ui/**/*.{ts,tsx}', 'hooks/use-toast.ts'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]);
