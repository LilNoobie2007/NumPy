NumPy — Technical Requirements Document
1. Purpose

This document defines the technical implementation requirements for NumPy.

2. Technology Stack
Frontend

React

TypeScript

Vite

React Router

Tailwind CSS

Recharts or equivalent

PWA tooling

Backend Platform

Supabase Auth

Supabase PostgreSQL

Supabase Data API

Supabase Edge Functions

Supabase Storage where required

Hosting

Vercel

Version Control

Git

3. Architecture Principle

NumPy is a serverless web application.

React is responsible for:

Presentation

Navigation

User interactions

Client-side state

Form handling

Client-side validation

User experience

Supabase is responsible for:

Authentication

PostgreSQL

Database authorization

Data persistence

Database operations

Server-side functions

Secure integrations

The application shall not maintain a traditional custom backend server unless future requirements justify one.

4. Frontend Structure

Recommended structure:

src/
├── app/
│   ├── router/
│   ├── providers/
│   └── configuration/
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── charts/
│   └── layout/
│
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── meals/
│   ├── water/
│   ├── steps/
│   ├── weight/
│   ├── sleep/
│   ├── exercise/
│   ├── mood/
│   ├── notifications/
│   └── dashboard/
│
├── lib/
│   ├── supabase/
│   ├── validation/
│   ├── calculations/
│   └── utilities/
│
├── hooks/
├── types/
├── pages/
└── styles/

5. Supabase Structure
supabase/
├── migrations/
├── functions/
│   ├── send-notification/
│   ├── calculate-summary/
│   └── manage-reminders/
├── seed/
└── tests/

6. Database Design

The conceptual database shall contain:

profiles
relationships
meals
foods
water_logs
step_logs
weight_logs
sleep_logs
exercise_logs
mood_logs
daily_goals
notification_preferences
notification_templates
notification_schedules
onboarding_states
audit_events

7. Common Record Fields

Activity records should use a consistent structure where applicable:

id
user_id
recorded_at
created_at
updated_at


Additional fields shall be defined according to the feature.

8. Relationship Model

The relationship table should contain:

id
primary_user_id
companion_user_id
status
created_at
updated_at


Supported statuses:

pending
active
revoked


The system shall never determine relationship permissions using frontend-only logic.

9. Security Architecture

The browser shall authenticate using Supabase Auth.

Database access shall pass through PostgreSQL authorization policies.

Conceptually:

Browser
   |
   v
Supabase Auth
   |
   v
Supabase Data API
   |
   v
PostgreSQL
   |
   v
RLS Policies


The system shall use least-privilege access.

Service-role or secret keys must never be included in the frontend bundle.

10. Data Access Layer

React components shall not directly contain complex database queries.

Preferred architecture:

Component
    |
    v
Feature Hook
    |
    v
Data Service
    |
    v
Supabase Client
    |
    v
PostgreSQL

11. Application Logic

Business logic shall be separated from visual components.

Examples:

calculateDailyWaterTotal()
calculateDailyCalories()
calculateDailyProgress()
calculateSleepDuration()
calculateGoalCompletion()

12. State Management

Local UI state should be used for:

Modal visibility

Form state

Temporary selections

Tour state

UI preferences

Server state should be managed through a suitable query/cache solution.

The application should avoid maintaining duplicate copies of database state.

13. Validation

Validation shall occur at multiple levels.

Client

Used for immediate user feedback.

Database

Used to enforce data integrity.

Server

Used for privileged operations and external integrations.

Client-side validation shall never be considered an authorization mechanism.

14. API Strategy

Normal operations:

React
  |
  v
Supabase JS Client
  |
  v
Supabase Data API
  |
  v
PostgreSQL + RLS


Privileged operations:

React
  |
  v
Supabase Edge Function
  |
  v
Validated Request
  |
  v
Database / External API

15. Edge Functions

Edge Functions should be used for operations that require trusted server execution.

Examples:

Sending notifications.

Calling external APIs with secrets.

Processing scheduled reminders.

Server-side calorie API integration.

Administrative operations.

16. PWA Requirements

The PWA shall provide:

Web App Manifest

Application icons

Theme colors

Service worker

Standalone display configuration

Installable metadata

Offline fallback where practical

The application shall detect installation capabilities.

17. PWA Installation Flow
Open NumPy
     |
     v
Detect Browser
     |
     v
Already Installed?
   /       \
 Yes       No
 |          |
Open       Detect installation support
            |
       +----+----+
       |         |
   Supported   Unsupported
       |         |
   Install UI   Instructions


For iOS Safari, the application shall provide manual Home Screen installation instructions when required.

18. Notification Architecture
Notification Schedule
        |
        v
Scheduler / Trigger
        |
        v
Edge Function
        |
        +---- Check User Preferences
        |
        +---- Check Schedule
        |
        +---- Check Duplicate State
        |
        +---- Generate Message
        |
        v
Notification Provider
        |
        v
User Device


Notifications shall respect:

User preferences.

Notification permissions.

Schedule.

Time zone.

Duplicate prevention.

19. Notification Templates

Notification templates should support variables.

Example:

"Hey {{name}}, your lunch is waiting. 🍱"


Possible variables:

{{name}}
{{water_remaining}}
{{steps_remaining}}
{{meal_name}}
{{goal}}


Templates shall be validated before being activated.

20. Daily Summary

Daily summaries should normally be derived from activity records.

Example:

water_total =
    SUM(water_logs.amount)

calorie_total =
    SUM(meals.estimated_calories)

step_total =
    SUM(step_logs.steps)


A database view or function may be introduced if required for performance.

21. Offline Strategy

The initial version should prioritize reliable online operation.

Future offline support may include:

Local caching.

Offline activity creation.

Pending write queue.

Synchronization after reconnect.

Duplicate prevention.

Offline support should not compromise data integrity.

22. Testing
Unit Tests

Required for:

Calculations

Validation

Goal calculations

Date handling

Formatting utilities

Integration Tests

Required for:

Authentication

Database operations

RLS

Relationships

Edge Functions

End-to-End Tests

Required for:

Login

Onboarding

Water logging

Meal logging

Dashboard

Companion access

Revoking access

PWA behavior where testable

23. Environment Variables

Frontend:

VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=


Server-only secrets must not use the VITE_ prefix and must only be available to trusted server environments.

The service-role key must never be exposed to browser code.

24. Deployment

Frontend:

Git Repository
      |
      v
Vercel
      |
      v
Production PWA


Database:

Supabase Migrations
      |
      v
Production PostgreSQL


Functions:

Supabase Edge Functions
      |
      v
Production Functions

25. Code Quality

The project shall use:

TypeScript strict mode.

ESLint.

Prettier.

Automated tests.

Consistent naming.

Small reusable components.

Feature-based organization.

26. Dependency Policy

New dependencies should only be introduced when they provide meaningful value.

Before adding a dependency, consider:

Bundle size.

Maintenance status.

Security.

TypeScript support.

Browser compatibility.

Whether the functionality can reasonably be implemented internally.

27. Technical Definition of Done

A technical change is complete when:

Code compiles.

Linting passes.

Tests pass.

Relevant RLS policies are tested.

No secrets are exposed.

Mobile behavior has been checked.

Error handling exists.

Documentation has been updated where necessary.