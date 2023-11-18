import {
	DwellingType,
	FamilyMemberRelationOption,
	assertCreateCommuneButtonIsVisible,
	assertDwellingType,
	assertNumberOfChildren,
	assertRelationshipStatus,
	clickStartFamilySpaceButton,
	selectCommuneType,
	selectFamilyLivingSituation,
	selectFamilyMemberRelationType,
	selectNumberOfChildren,
} from '../common/commune';

describe('Commune Setup', () => {
	beforeEach(() => {
		cy.deleteAllAuthUsers();
		cy.initializeFirebaseEmulators().initializeTestEnvironment();
		cy.visit('/');
	});

	it('should create a new team', () => {
		cy.intercept('POST', 'v0/teams/create_team', (req) => {
			req.body.title = 'something-title';
			req.continue();
		}).as('createNewTeam');

		clickStartFamilySpaceButton();
		selectCommuneType('Family');
		selectFamilyMemberRelationType(FamilyMemberRelationOption.Married);
		selectNumberOfChildren(3);
		selectFamilyLivingSituation(DwellingType.Owners);

		assertRelationshipStatus(FamilyMemberRelationOption.Married);
		assertNumberOfChildren(3);
		assertDwellingType(DwellingType.Owners);
		assertCreateCommuneButtonIsVisible();
	});
});
