## Package.json clarifications

In this file we will clarify the usage of some properties in the package.json file.
It's needed as package.json can't have comments.

## Fix for circular dependencies alert in dynamic imports

https://github.com/pahen/madge/issues/157#issuecomment-1710043905

### package.json

```json
{
  "madge": {
    "detectiveOptions": {
      "ts": {
        "skipAsyncImports": true
      }
    }
  }
}
```
