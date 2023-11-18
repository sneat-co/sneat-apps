export const assertSignInButtonIsVisible = (isVisible: boolean) => {
	getSignInButton(isVisible ? undefined : { timeout: 100 }).should(
		isVisible ? 'exist' : 'not.exist',
	);
};

export const clickSignInButton = () => getSignInButton().click();
export const getSignInButton = (options?: Cypress.Timeoutable) =>
	cy.get(
		'sneat-auth-menu-item ion-item ion-label:contains(Please sign in)',
		options,
	);

export const MOCK_USER_EMAIL = 'testsignin@gmail.com';
export const MOCK_USER_PASS = 'password';
export const runSignUpTest = () => {
	cy.intercept(
		'POST',
		'identitytoolkit.googleapis.com/v1/accounts:sendOobCode?*',
	).as('afterSignUpRequest');
	clickSignInButton();

	// Enter new user information for sign up and submit data
	cy.get('input[type="email"]').type(MOCK_USER_EMAIL);
	cy.get('input[name="first_name"]').type('Test');
	cy.get('input[name="last_name"]').type('Name');
	cy.get('ion-button ion-label:contains(Sign up)').should('exist').click();

	cy.wait('@afterSignUpRequest');
	assertSignInButtonIsVisible(false);
};

export const runSignInTest = () => {
	clickSignInButton();

	// Click on the SIGN IN tab
	cy.get('sneat-email-login-form ion-segment-button:contains(Sign in)').click();

	// Enter username and password and then log in
	cy.get('input[type="email"]').type(MOCK_USER_EMAIL);
	cy.get('input[type="password"]').type(MOCK_USER_PASS);
	cy.get('ion-button ion-label:contains(Sign in)').should('exist').click();

	assertSignInButtonIsVisible(false);
};
