# Coding standards for the project

Defines coding styles and best practices for TypeScript & HTML code in this project.

## Public exports of libraries

When adding new lines to a 'public_api.ts' files add them as comments for manual human review .

## Comments

### Commenting interface and class members:

- If the comment is 80 characters or fewer, put a short inline comment on the same line using `//`.
- If the comment exceeds 80 characters, place a preceding TSDoc block immediately above the member using `/** ... */`.
- For methods, include `@param` and `@returns` where applicable. For properties, consider `@defaultValue`, `@remarks`, and `@deprecated` when relevant.
- Keep comments concise, specific, and helpful.

Examples:

```TypeScript
interface Example {
  /**
   Describes the purpose in detail. Use TSDoc for long comments that exceed 80 characters.
   @remarks Provide any additional context or constraints here.
   */
  longCommentedMember: string;

  shortCommentedMember: number; // Short inline comment (<= 80 chars)

  /**
   Adds two numbers.
   @param a First addend.
   @param b Second addend.
   @returns Sum of a and b.
   */
  add(a: number, b: number): number;
}
```
