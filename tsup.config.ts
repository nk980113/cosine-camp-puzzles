import { defineConfig } from 'tsup';

export default defineConfig((opts) => {
    return {
        entry: ['src-backend/index.ts'],
        format: 'esm',
        target: 'node22',
        minifySyntax: true,
        minifyWhitespace: true,
        watch: opts.watch && 'src-backend/**/*.ts',
        keepNames: !!opts.watch,
    }
});