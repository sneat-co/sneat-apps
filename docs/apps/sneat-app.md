# sneat-app — Super App

> **https://sneat.app** · `apps/sneat-app`

The umbrella "super app" that bundles the full functionality of all mini-apps.
It is the canonical home for every feature; mini-apps are thin wrappers that deep-link into this app's modules.

## Summary

_"Your family's best friend — say goodbye to stress and hello to more time and money for what really matters!"_

## Features

| Module | Description |
|---|---|
| **Schedule / Calendar** | Family events, reminders, and deadlines |
| **Lists** | ToDo, ToBuy, ToWatch, and custom lists (→ [listus-app](listus-app.md)) |
| **Contacts** | Shared family address book |
| **Assets** | Log book, maintenance tracking, renewal reminders |
| **Budgeting** | Expense planning integrated with assets & contracts |
| **Debts** | Track who owes whom (→ [debtus-app](debtus-app.md)) |
| **Members** | Family / household member profiles |

## Location

```
apps/sneat-app/
```

## Shared Libraries

Uses `@sneat/*` libraries from [`libs/`](../../libs/).
