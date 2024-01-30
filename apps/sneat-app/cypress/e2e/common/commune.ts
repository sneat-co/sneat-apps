export const assertStartFamilySpaceButtonIsVisible = () =>
	getStartFamilySpaceButton().should('be.visible');
export const clickStartFamilySpaceButton = () =>
	getStartFamilySpaceButton().click();
export const getStartFamilySpaceButton = () =>
	cy.get(
		'sneat-for-families ion-button ion-label:contains(Start family space)',
	);

export type CommuneType = 'Family' | 'Friends';
export const selectCommuneType = (communeType: CommuneType) =>
	getCommuneTypeRadioButton(communeType).click();
export const getCommuneTypeRadioButton = (communeType: CommuneType) => {
	return cy
		.get('sneat-new-commune-page ion-radio-group ion-radio')
		.eq(communeType === 'Family' ? 0 : 1)
		.shadow()
		.find('label')
		.should('include.text', ` ${communeType}`);
};

const preferNotToSay = 'I prefer not to disclose at this stage';
export enum FamilyMemberRelationOption {
	Married = `I'm married or have a partner`,
	Single = 'I am single',
	Child = 'I am a child in this family',
	PreferNotToSay = preferNotToSay,
}
const familyMemberRelationRadioIndexMap = new Map<
	FamilyMemberRelationOption,
	number
>([
	[FamilyMemberRelationOption.Married, 0],
	[FamilyMemberRelationOption.Single, 1],
	[FamilyMemberRelationOption.Child, 2],
	[FamilyMemberRelationOption.PreferNotToSay, 3],
]);
export const selectFamilyMemberRelationType = (
	relationType: FamilyMemberRelationOption,
) => getFamilyMemberRelationTypeRadioButton(relationType).click();
export const getFamilyMemberRelationTypeRadioButton = (
	relationType: FamilyMemberRelationOption,
) => {
	if (!familyMemberRelationRadioIndexMap.has(relationType)) {
		throw new Error(
			`Family member relation of type ${relationType} doesn't exist.`,
		);
	}

	return (
		cy
			.get(
				'sneat-new-commune-page sneat-radio-group-to-select ion-radio-group ion-radio',
			)
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			.eq(familyMemberRelationRadioIndexMap.get(relationType)!)
			.shadow()
			.find('label')
			.should('include.text', relationType)
	);
};

export const selectNumberOfChildren = (numberOfChildren: number) =>
	getNumberOfChildrenRadioButton(numberOfChildren).click();
export const getNumberOfChildrenRadioButton = (numberOfChildren: number) => {
	if (numberOfChildren > 7) {
		throw new Error(
			`Invalid number of children selected. Please provide anywhere between -1 and 8. -1 = ${preferNotToSay}.`,
		);
	}

	return cy
		.get(
			'sneat-new-commune-page sneat-radio-group-to-select ion-radio-group ion-radio',
		)
		.eq(numberOfChildren === -1 ? 8 : numberOfChildren)
		.shadow()
		.find('label')
		.should(
			'contain.text',
			numberOfChildren === -1 ? preferNotToSay : numberOfChildren,
		);
};

export enum DwellingType {
	Renting = 'We are renting the place we live in',
	Owners = 'We own a property we live in',
	Separated = 'We do not live together (separated)',
	PreferNotToSay = preferNotToSay,
}
const dwellingTypeRadioIndexMap = new Map<DwellingType, number>([
	[DwellingType.Renting, 0],
	[DwellingType.Owners, 1],
	[DwellingType.Separated, 2],
	[DwellingType.PreferNotToSay, 3],
]);
export const selectFamilyLivingSituation = (livingSituation: DwellingType) =>
	getFamilyLivingSituationRadioButton(livingSituation).click();
export const getFamilyLivingSituationRadioButton = (
	livingSituation: DwellingType,
) => {
	if (!dwellingTypeRadioIndexMap.has(livingSituation)) {
		throw new Error(
			`Family living situation of type ${livingSituation} doesn't exist.`,
		);
	}

	return (
		cy
			.get(
				'sneat-new-commune-page sneat-radio-group-to-select ion-radio-group ion-radio',
			)
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			.eq(dwellingTypeRadioIndexMap.get(livingSituation)!)
			.shadow()
			.find('label')
			.should('include.text', livingSituation)
	);
};

enum NewCommuneSummaryItem {
	RelationshipStatus = 'Relationship status',
	NumberOfChildren = 'Number of kids in household',
	Dwelling = 'Dwelling',
}
export const assertRelationshipStatus = (
	familyMemberRelation: FamilyMemberRelationOption,
) =>
	getNewCommuneSummaryItem(NewCommuneSummaryItem.RelationshipStatus).should(
		'include.text',
		familyMemberRelation,
	);

export const assertNumberOfChildren = (numberOfChildren: number) =>
	getNewCommuneSummaryItem(NewCommuneSummaryItem.NumberOfChildren).should(
		'include.text',
		numberOfChildren,
	);

export const assertDwellingType = (dwellingType: DwellingType) =>
	getNewCommuneSummaryItem(NewCommuneSummaryItem.Dwelling).should(
		'include.text',
		dwellingType,
	);

export const getNewCommuneSummaryItem = (
	summaryType: NewCommuneSummaryItem,
) => {
	return cy
		.get(
			`sneat-new-family-wizard sneat-radio-group-to-select ion-item ion-label:contains(${summaryType})`,
		)
		.parent()
		.find('ion-select')
		.shadow()
		.find('.select-text');
};

export const assertCreateCommuneButtonIsVisible = () =>
	clickCreateCommuneButton().should('be.visible');
export const clickCreateCommuneButton = () => getCreateCommuneButton().click();
export const getCreateCommuneButton = () =>
	cy.get('sneat-new-commune-page ion-button:contains("Create commune")');
