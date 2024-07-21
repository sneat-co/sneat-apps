export const assertNewSpaceButtonIsVisible = () => {
	// Sign In button should be done and the Family spaces should be available
	return getNewSpaceButton().should('be.visible');
};

export const assertSpacesDropdownIsVisible = () =>
	getSpacesDropdown().should('be.visible');
export const clickNewSpaceButton = () => getNewSpaceButton().click();
export const getNewSpaceButton = () =>
	cy.get('sneat-teams-menu ion-item ion-label:contains("Family ")');

export const getSpacesDropdown = () => {
	return cy
		.get('sneat-team-menu ion-list ion-item ion-select')
		.shadow()
		.find('.label-text:contains(Space)')
		.should('exist');
};
