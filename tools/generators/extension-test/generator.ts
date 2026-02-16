import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';
import * as path from 'path';

export interface ExtensionTestGeneratorSchema {
  type: 'service' | 'component' | 'sanity';
  name?: string;
  extension: string;
  subLib: 'shared' | 'internal' | 'core' | 'components' | 'pages';
  path?: string;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export async function extensionTestGenerator(
  tree: Tree,
  options: ExtensionTestGeneratorSchema,
) {
  const { type, extension, subLib } = options;

  // Determine the target directory
  let targetDir: string;
  let fileName: string;
  let templateVars: Record<string, string>;

  if (type === 'sanity') {
    // Sanity test goes in the root of the sub-library
    targetDir = joinPathFragments(
      'libs',
      'extensions',
      extension,
      subLib,
      'src',
      'lib',
    );
    fileName = 'sanity.spec.ts';
    templateVars = {
      extensionName: extension,
      subLib: subLib,
    };
  } else {
    // Service or component test
    if (!options.name) {
      throw new Error(`Name is required for ${type} test generation`);
    }

    const name = options.name;
    const pascalName = toPascalCase(name);
    const kebabName = toKebabCase(name);

    // Build the path
    const relativePath = options.path || '';
    targetDir = joinPathFragments(
      'libs',
      'extensions',
      extension,
      subLib,
      'src',
      'lib',
      relativePath,
    );

    if (type === 'service') {
      fileName = `${kebabName}.spec.ts`;
      templateVars = {
        ServiceName: pascalName,
        'service-name': kebabName,
      };
    } else {
      // component
      fileName = `${kebabName}.component.spec.ts`;
      templateVars = {
        ComponentName: pascalName,
        'component-name': kebabName,
      };
    }
  }

  // Read the appropriate template
  const templatePath = path.join(__dirname, '../../../templates');
  const templateFile = `extension-${type}.spec.ts.template`;
  const templateContent = tree.read(
    joinPathFragments(templatePath, templateFile),
    'utf-8',
  );

  if (!templateContent) {
    throw new Error(`Template file not found: ${templateFile}`);
  }

  // Replace placeholders
  let fileContent = templateContent;
  for (const [key, value] of Object.entries(templateVars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    fileContent = fileContent.replace(regex, value);
  }

  // Write the test file
  const filePath = joinPathFragments(targetDir, fileName);
  tree.write(filePath, fileContent);

  await formatFiles(tree);
// console.log(`✅ Generated ${type} test: ${filePath}`);

  return () => {
// console.log(`
📝 Test file created successfully!

Location: ${filePath}

Next steps:
1. Review the generated test file
2. Add specific test cases for your implementation
3. Run tests: pnpm nx test ${extension}-${subLib}
`);
  };
}

export default extensionTestGenerator;
