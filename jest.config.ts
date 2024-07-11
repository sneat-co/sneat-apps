// @ts-expect-error TODO: @nx/jest is not found
import { getJestProjects } from '@nx/jest';

export default {
	projects: getJestProjects(),
};
