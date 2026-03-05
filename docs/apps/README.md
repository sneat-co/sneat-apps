# Apps in This Repository

All apps share libraries from [@sneat/*](../../libs/) (`sneat-libs` packages).

Mini-apps are standalone apps whose home page is the starting page of the corresponding module inside **sneat-app**.

---

## [sneat-app](sneat-app.md) — Super App

> **https://sneat.app** · `apps/sneat-app`

The umbrella "super app" that includes the full functionality of all mini-apps below.
Your family's best friend — saves time & money by keeping everything in one place.

**Features:**
- 📅 To-do / task management with reminders
- 📊 Family budgeting & expense planning
- ✂ Contract & subscription tracking (renew or switch to save money)
- 📇 Shared family contacts
- 🗓 Schedule / calendar
- 🏠 Asset management (log book, renewal reminders)
- 📝 Lists: ToDo, ToBuy, ToWatch, etc.

---

## [listus-app](listus-app.md) — Lists

> **https://listus.app** · `apps/listus-app`

A focused mini-app for managing to-do and shopping lists.

Its home page maps to the **Lists** module inside sneat-app.

---

## [debtus-app](debtus-app.md) — Debts & Debtors

> **https://debtus.app** · `apps/debtus-app`

A focused mini-app for tracking debts and debtors — who owes you, and whom you owe.

Its home page maps to the **Debts** module inside sneat-app.

---

## Mini-App Creation Plan

See **[PLAN-mini-apps.md](PLAN-mini-apps.md)** for the plan to create `listus-app` and `debtus-app`, including which code needs to be extracted to `sneat-libs` first.

## Shared Libraries

All apps consume shared Angular libraries published under the `@sneat/*` namespace from [`sneat-libs`](../sneat-libs.md).
