import { runSignUpTest } from '../common/auth.spec';
import {
	assertNewTeamButtonIsVisible,
	assertSpacesDropdownIsVisible,
	clickNewTeamButton,
} from '../common/teams.spec';

describe('Team Setup', () => {
	beforeEach(() => {
		cy.deleteAllAuthUsers();
		cy.visit('/');
	});

	it('should create a new team', () => {
		cy.intercept('POST', 'v0/teams/create_team', (req) => {
			req.body.title = 'something-title';
			req.continue();
		}).as('createNewTeam');

		runSignUpTest();
		assertNewTeamButtonIsVisible();

		clickNewTeamButton();
		cy.wait('@createNewTeam');

		assertSpacesDropdownIsVisible();
	});
});
