# FAQ re development of Sneat.app

## Enum vs Union types
Enums are more structured and easier to use in TS code, but are not easy to use in templates.
This where `EnumAsUnionOfKeys<typeof SomeEnum>` comes to help.
