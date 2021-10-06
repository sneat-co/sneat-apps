const { getJestProjects } = require('@nrwl/jest');

module.exports = {
	projects: [
		...getJestProjects(),
		'<rootDir>/libs/datatug/services/store',
		'<rootDir>/libs/team',
		'<rootDir>/libs/teams/teams-models',
		'<rootDir>/libs/team/team-models',
	],
};
