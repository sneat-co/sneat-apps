---
captured_by: user
status: queued
---

# Add reusable space-core-pages (space shell without extension-lib deps) so mini-apps can reuse it and sneat-app super-app can extend it

Concrete blocker hit while decoupling listus into its own repo/mini-app (listus.app). The space shell that hosts space-scoped pages lives in @sneat/space-pages (libs/space/pages), which is (a) unpublished and (b) hard-coupled to EVERY extension: its space-routing.module imports contactusRoutes, spacePagesRoutes (@sneat/ext-debtus-internal), AssetusRoutingModule, budgetusRoutes, docusRoutes, listusRoutes, calendariumRoutes (schedulus), trackusSpaceRoutes. Publishing space-pages would cascade to ~9 unpublished libs and ship ALL extensions inside a single mini-app — the opposite of decoupling.

Proposal: extract a dedicated 'space-core-pages' lib containing only the reusable space shell — the space host/layout (SpacePageComponent), space-menu, and space-context resolution (SpaceComponentBaseParams wiring under space/:spaceType/:spaceID) — with ZERO dependency on extension libs. Mini-apps (listus.app, etc.) compose it with just their own extension routes; the sneat-app super-app extends it by adding all extension routes. This makes the space framework genuinely reusable. Today's workaround in listus-app is a hand-rolled thin space shell using published @sneat/space-services + space-components.
