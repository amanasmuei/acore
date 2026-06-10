# MAINTENANCE MODE (2026-06-10)

`@aman_asmuei/acore` (this repo) is the standalone consumer CLI — interactive
setup wizard, archetypes, identity editing for end users. It is **still
published** and works, but is **not part of the aman substrate runtime** and
has no active development planned.

The substrate (aman-substrate monorepo: MCP server, harness, `aman` CLI)
accesses identity exclusively through the `@aman_asmuei/acore-core` library
(now at `aman-substrate/packages/identity/`). Changes to the identity file
format belong there, not here.

Keep this repo for: the wizard/archetype flows, and anyone consuming the CLI
directly from npm.
