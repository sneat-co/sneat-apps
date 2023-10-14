/* eslint-disable */
export default {
	displayName: 'extensions-assetus-components',
	preset: '../../../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	globals: {},
	coverageDirectory: '../../../../coverage/libs/extensions/assetus/components',
	transform: {
		'^.+\\.(ts|mjs|js|html)$': [
			'jest-preset-angular',
			{
				tsconfig: '<rootDir>/tsconfig.spec.json',
				stringifyContentPathRegex: '\\.(html|svg)$',
			},
		],
	},
	transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
	snapshotSerializers: [
		'jest-preset-angular/build/serializers/no-ng-attributes',
		'jest-preset-angular/build/serializers/ng-snapshot',
		'jest-preset-angular/build/serializers/html-comment',
	],
};
