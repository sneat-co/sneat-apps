// @ts-expect-error TODO: @nx/jest is not found
import { getJestProjectsAsync } from '@nx/jest';
export default async () => ({
	projects: await getJestProjectsAsync(),
});
//# sourceMappingURL=jest.config.js.map
