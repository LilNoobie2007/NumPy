NumPy — AI Agent Development Guidelines
1. Purpose

This document defines rules for AI coding agents working on the NumPy project.

The objective is to ensure that AI-generated changes remain:

Secure

Consistent

Maintainable

Testable

Aligned with the product requirements

2. General Rules

AI agents must:

Read the relevant documentation before making architectural changes.

Inspect the existing code before modifying it.

Prefer small and focused changes.

Preserve existing behavior unless the task explicitly changes it.

Use TypeScript.

Follow existing project conventions.

Avoid unnecessary dependencies.

Add tests for important logic.

Update documentation when behavior changes.

3. Source of Truth

When requirements conflict, use the following priority:

Explicit user/developer requirement.

Security requirements.

SRS.

PRD.

TRD.

Software Architecture Document.

Existing implementation.

If a change would conflict with an architectural decision, explain the conflict before making a major change.

4. Security Rules

Agents must never:

Expose Supabase service-role keys.

Expose private API keys in frontend code.

Implement authorization only in React.

Disable RLS to make a feature work.

Add unrestricted database policies.

Trust user-provided role values.

Store passwords manually.

Log sensitive personal information unnecessarily.

Put server secrets in VITE_* environment variables.

The browser is an untrusted environment.

5. Authorization Rules

Authorization shall be enforced at the database or trusted server layer.

Do not rely on:

if (user.role === "companion") {
    showDashboard();
}


as the actual security mechanism.

The correct approach is:

User
  |
  v
Authentication
  |
  v
Database Request
  |
  v
RLS
  |
  v
Authorized Records


Frontend checks may be used only for user experience.

6. Database Rules

Every new exposed table must:

Have an explicit ownership/access model.

Enable RLS.

Have appropriate grants.

Have appropriate policies.

Have indexes for common queries.

Have a migration.

Have security tests where applicable.

Never create a table and leave its access policy undefined.

7. React Rules

Components should remain focused.

Avoid:

Large Component
    |
    +-- Database queries
    +-- Authorization
    +-- Business calculations
    +-- Notifications
    +-- UI


Prefer:

Page
 |
 +-- Feature Component
 |      |
 |      +-- Feature Hook
 |              |
 |              +-- Data Service
 |
 +-- UI Components

8. Business Logic Rules

Business logic should not be duplicated.

Prefer reusable functions such as:

calculateDailyWaterTotal()
calculateDailyCalories()
calculateDailyProgress()
calculateSleepDuration()
calculateGoalCompletion()

9. Database Query Rules

Avoid complex database queries directly inside presentational components.

Prefer:

Component
   |
   v
Feature Hook
   |
   v
Data Service
   |
   v
Supabase

10. UI Rules

The primary user experience should be:

Simple

Friendly

Mobile-first

Clear

Low-friction

Accessible

Non-technical

Do not introduce unnecessary configuration into the primary dashboard.

11. Notification Rules

Notifications should:

Be short.

Be friendly.

Avoid shame.

Avoid fear.

Avoid medical claims.

Support personalization.

Respect user preferences.

Avoid excessive frequency.

Preferred:

"A little more water, NumPy? 💧"

Avoid:

"You failed to reach your water goal."

12. Health Data Rules

NumPy is an activity tracking application.

It is not a medical diagnostic system.

Agents must not add medical diagnosis or treatment functionality without explicit product requirements and appropriate review.

Calorie values must be treated as estimates unless a verified source provides a more precise value.

13. Privacy Rules

Agents should collect only information required by the feature.

Avoid unnecessary:

Personal information

Location data

Device information

Identifiers

Tracking

Do not add analytics or third-party tracking without explicit approval.

14. Testing Rules

Critical functionality must have tests.

Security-sensitive changes must include authorization tests.

At minimum, verify:

Primary user → own records → allowed

Primary user → another user's records → denied

Companion → shared records → allowed

Companion → unrelated records → denied

Revoked companion → previously shared records → denied

15. Migration Rules

Database changes must be implemented through migrations.

Do not manually modify production schema without a corresponding migration.

Migration files must be:

Ordered.

Reproducible.

Reviewed.

Safe to apply.

16. Git Rules

Use clear commit messages.

Examples:

feat: add water logging
feat: add companion dashboard
fix: prevent duplicate water records
fix: handle expired session
security: restrict companion activity access
test: add relationship RLS tests
refactor: separate meal data service


Avoid unrelated changes in the same commit.

17. Agent Workflow

Before implementation:

Read requirements
      |
      v
Inspect existing code
      |
      v
Identify affected feature
      |
      v
Check security implications
      |
      v
Implement
      |
      v
Test
      |
      v
Review
      |
      v
Update documentation

18. When Requirements Are Ambiguous

Agents should:

Use existing project conventions.

Prefer the smallest reasonable implementation.

Avoid introducing irreversible architecture.

Ask for clarification when ambiguity affects security, data integrity, or major architecture.

Do not invent product behavior silently.

19. When Modifying Security

Security changes require additional caution.

Before changing:

RLS policies

Auth configuration

Roles

Relationship permissions

Edge Function authorization

The agent should inspect all affected tables and flows.

20. Definition of Done

A task is complete when:

Code works.

TypeScript passes.

Tests pass.

Security has been verified.

RLS behavior is correct.

Mobile UI has been considered.

Error states exist.

No secrets are exposed.

Documentation is updated where required.