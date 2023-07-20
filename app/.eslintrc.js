module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@angular-eslint', '@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@angular-eslint/recommended',
	],
	overrides: [
		{
		  files: ['*.ts'],
		  parser: '@typescript-eslint/parser',
		  parserOptions: {
			project: 'tsconfig.json',
			sourceType: 'module',
		  },
		  plugins: ['@typescript-eslint', '@angular-eslint'],
		  extends: [
			'eslint:recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:@typescript-eslint/recommended-requiring-type-checking',
			'plugin:@angular-eslint/recommended',
		  ],
		},
	  ],
};
