# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) documenting significant technical decisions made in the Traffic CRM project.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences. ADRs help teams:

- Understand why decisions were made
- Avoid revisiting settled debates
- Onboard new team members faster
- Track technical debt explicitly

## Format

Each ADR follows this structure:

1. **Status** - Proposed, Accepted, Deprecated, Superseded
2. **Context** - The issue motivating this decision
3. **Decision** - The change we're proposing or have agreed to
4. **Alternatives Considered** - Other options we evaluated
5. **Consequences** - The resulting context after applying the decision
6. **References** - Related documentation, issues, or commits

## Active ADRs

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](./0001-pin-fastify-static-on-v4.md) | Pin @fastify/static to v6 for Fastify v4 Compatibility | Accepted | 2025-10-24 |

## Creating a New ADR

1. **Copy the template** (or use ADR 0001 as a reference)
2. **Number sequentially** - Next available number is `0002`
3. **Use kebab-case** - `NNNN-short-descriptive-title.md`
4. **Fill all sections** - Context, Decision, Alternatives, Consequences
5. **Link related docs** - Issues, PRs, technical analyses
6. **Update this index** - Add your ADR to the table above

### Template

```markdown
# ADR NNNN: [Title]

## Status

**[Proposed | Accepted | Deprecated | Superseded]** (YYYY-MM-DD)

## Context

[What is the issue that we're seeing that is motivating this decision or change?]

## Decision

[What is the change that we're proposing and/or doing?]

## Alternatives Considered

### 1. [Alternative Name]

**Pros**: [Benefits]  
**Cons**: [Drawbacks]  
**Verdict**: [Rejected | Deferred] - [Why]

## Consequences

### Positive

- ✅ [Benefit 1]
- ✅ [Benefit 2]

### Negative

- ⚠️ [Trade-off 1]
- ⚠️ [Trade-off 2]

## Implementation

**Commit**: [hash] - [message]

[Code snippets or commands if relevant]

## References

- [Link to related docs]
- [Link to GitHub issues]

## Review Date

**[When to revisit this decision]**

---

**Last Updated**: YYYY-MM-DD  
**Supersedes**: [ADR NNNN] or None  
**Superseded By**: [ADR NNNN] or None (active)
```

## Superseding an ADR

When a decision is replaced:

1. **Mark the old ADR** - Update status to "Superseded by ADR NNNN"
2. **Create the new ADR** - Reference "Supersedes ADR NNNN"
3. **Update this index** - Reflect both changes

## Best Practices

- **Write ADRs early** - Capture decisions while context is fresh
- **Keep them concise** - Focus on the decision, not implementation details
- **Link generously** - Connect to issues, PRs, and related docs
- **Review periodically** - Set review dates for time-sensitive decisions
- **Use plain language** - Future readers may not have your context

## Resources

- [ADR GitHub Organization](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR Tools](https://github.com/npryce/adr-tools)

---

**Last Updated**: October 24, 2025  
**Maintained By**: Engineering Team

