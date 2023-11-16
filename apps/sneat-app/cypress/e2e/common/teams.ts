export const assertNewTeamButtonIsVisible = () => {
	// Sign In button should be done and the Family spaces should be available
	return getNewTeamButton().should('be.visible');
};

export const assertSpacesDropdownIsVisible = () =>
	getSpacesDropdown().should('be.visible');
export const clickNewTeamButton = () => getNewTeamButton().click();
export const getNewTeamButton = () =>
	cy.get('sneat-teams-menu ion-item ion-label:contains("Family ")');

export const getSpacesDropdown = () => {
	return cy
		.get('sneat-team-menu ion-list ion-item ion-select')
		.shadow()
		.find('.label-text:contains(Space)')
		.should('exist');
};
