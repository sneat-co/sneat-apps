// import {
// 	DwellingType,
// 	FamilyMemberRelationOption,
// 	assertCreateCommuneButtonIsVisible,
// 	// assertDwellingType,
// 	// assertNumberOfChildren,
// 	// assertRelationshipStatus,
// 	clickStartFamilySpaceButton,
// 	selectCommuneType,
// 	selectFamilyLivingSituation,
// 	selectFamilyMemberRelationType,
// 	selectNumberOfChildren,
// } from '../common/commune.spec';
//
// describe('Commune Setup', () => {
// 	beforeEach(() => {
// 		// cy.initializeTestEnvironment();
// 		cy.deleteAllAuthUsers();
// 		cy.visit('/');
// 	});
//
// 	it('should create a new team', () => {
// 		cy.intercept('POST', 'v0/teams/create_team', (req) => {
// 			req.body.title = 'something-title';
// 			req.continue();
// 		}).as('createNewTeam');
//
// 		clickStartFamilySpaceButton();
// 		selectCommuneType('Family');
// 		selectFamilyMemberRelationType(FamilyMemberRelationOption.Married);
// 		selectNumberOfChildren(3);
// 		selectFamilyLivingSituation(DwellingType.Owners);
//
// 		// TODO(help-wanted): Fix broken assertions
// 		// assertRelationshipStatus(FamilyMemberRelationOption.Married);
// 		// assertNumberOfChildren(3);
// 		// assertDwellingType(DwellingType.Owners);
//
// 		assertCreateCommuneButtonIsVisible();
// 	});
// });
