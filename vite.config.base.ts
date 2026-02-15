import { ViteUserConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { join } from 'path';

export interface BaseViteConfigOptions {
  dirname: string;
  name: string;
  reportsDirectory?: string;
}

export function createBaseViteConfig(
  options: BaseViteConfigOptions,
): ViteUserConfig {
  const { dirname, name, reportsDirectory } = options;

  // Better way to calculate relative path to root based on distance from root
  const rootPath = process.cwd();
  const relativeToRoot = join(
    dirname,
    Array(dirname.replace(rootPath, '').split('/').filter(Boolean).length)
      .fill('..')
      .join('/'),
    'node_modules/.vite',
    dirname.replace(rootPath, ''),
  );
  const coverageDir = join(
    dirname,
    Array(dirname.replace(rootPath, '').split('/').filter(Boolean).length)
      .fill('..')
      .join('/'),
    'coverage',
    dirname.replace(rootPath, ''),
  );

  return {
    root: dirname,
    cacheDir: relativeToRoot,
    resolve: {
      dedupe: [
        '@angular/core',
        '@angular/common',
        '@angular/common/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/cdk',
        '@angular/material',
        '@angular/fire',
        'rxjs',
        'zone.js',
      ],
      alias: [
        //				{
        //					find: '@ionic/core/components',
        //					replacement: '@ionic/core/components/index.js',
        //				},
      ],
    },
    plugins: [
      angular({
        jit: true,
        tsconfig: './tsconfig.spec.json',
      }),
      nxViteTsPaths(),
    ],
    test: {
      name,
      watch: false,
      globals: true,
      environment: 'happy-dom',
      include: ['src/**/*.spec.ts'],
      setupFiles: [join(dirname, 'src/test-setup.ts')],
      reporters: ['default'],
      coverage: {
        reportsDirectory: reportsDirectory || coverageDir,
        provider: 'v8' as const,
        reporter: ['text', 'json', 'json-summary', 'html'],
        all: true,
        include: ['src/**/*.ts'],
        exclude: [
          'src/**/*.spec.ts',
          'src/**/test-setup.ts',
          'src/**/*.stories.ts',
          'src/**/index.ts',
        ],
        thresholds: {
          lines: 15,
          functions: 15,
          branches: 1,
          statements: 15,
        },
      },
      server: {
        deps: {
          inline: [
            '@ionic/angular',
            '@ionic/angular/standalone',
            '@ionic/core',
            'ionicons',
            'rxfire',
            'firebase',
            '@angular/fire',
            '@stencil/core',
            '@sneat/logging',
            '@sneat/core',
            '@ionic/angular/standalone',
            '@ionic/core',
            '@ionic-native/core',
            '@ionic-native/splash-screen',
            '@ionic-native/status-bar',
            /@angular\//,
            /@stencil\//,
            /tslib/,
          ],
        },
      },
    },
  } as ViteUserConfig;
}
