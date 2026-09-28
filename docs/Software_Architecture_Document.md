NumPy — Software Architecture Document
1. Purpose

This document defines the architecture of NumPy.

The architecture is designed for:

Mobile-first usage

Low operational complexity

Strong authorization

Easy development

Serverless deployment

Future extensibility

2. Architecture Overview
                         Internet
                            |
                            v
                    +---------------+
                    |    Vercel     |
                    | React / PWA   |
                    +-------+-------+
                            |
                  +---------+---------+
                  |                   |
                  v                   v
           Supabase Auth       Supabase Data API
                                      |
                                      v
                              PostgreSQL + RLS
                                      |
                         +------------+------------+
                         |                         |
                         v                         v
                  Database Logic             Supabase Storage
                         |
                         v
                 Supabase Edge Functions
                         |
                         v
                External Integrations

3. Architectural Layers
3.1 Presentation Layer

Implemented using React.

Responsibilities:

Screens

Components

Navigation

Forms

Charts

Animations

User feedback

The presentation layer shall not make authorization decisions.

3.2 Application Layer

Responsibilities:

Use cases

Client-side validation

Query management

Application state

UI orchestration

Example:

Log Water
    |
    v
Validate Input
    |
    v
Create Water Record
    |
    v
Refresh Daily Summary

3.3 Data Layer

The data layer communicates with Supabase.

Responsibilities:

Database queries

Mutations

Authentication

Realtime subscriptions where required

Error mapping

Database access shall be isolated from visual components.

3.4 Authorization Layer

Authorization shall primarily be implemented through PostgreSQL RLS.

Example access model:

Primary User
    |
    +-- Read own records
    +-- Insert own records
    +-- Update own records
    +-- Delete own records

Companion
    |
    +-- Read explicitly shared records

3.5 Serverless Logic Layer

Supabase Edge Functions shall handle operations requiring trusted server execution.

Examples:

Notification delivery

External API requests

Secret-based integrations

Scheduled processing

Administrative operations

4. Data Flow
4.1 Primary User Logging Water
User
 |
 v
Water UI
 |
 v
Client Validation
 |
 v
Supabase Client
 |
 v
Data API
 |
 v
PostgreSQL
 |
 v
RLS
 |
 v
water_logs
 |
 v
Updated UI

4.2 Companion Viewing Data
Companion
 |
 v
Dashboard
 |
 v
Supabase Client
 |
 v
Data API
 |
 v
Authentication
 |
 v
RLS
 |
 v
Relationship Authorization
 |
 v
Allowed Records
 |
 v
Dashboard

5. Security Model

Security shall use multiple layers.

Layer 1 — Authentication

Supabase Auth identifies the user.

Layer 2 — Database Authorization

RLS verifies record access.

Layer 3 — Application Authorization

The frontend hides unavailable features for usability.

Layer 4 — Server Validation

Edge Functions validate privileged requests.

Layer 5 — Secret Management

Secrets exist only in trusted server environments.

The frontend must never contain service-role or secret credentials.

6. Database Design

Recommended core tables:

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


Each activity table should contain, where applicable:

id
user_id
recorded_at
created_at
updated_at

7. Relationship Authorization

A relationship shall be represented explicitly.

relationships

id
primary_user_id
companion_user_id
status
created_at
updated_at


Possible statuses:

pending
active
revoked


The companion's ability to read activity data shall depend on an active relationship.

8. Daily Summary

Daily summaries should normally be derived from activity records rather than stored as duplicated values.

Example:

Water Total
    = SUM(water_logs.amount)

Calorie Total
    = SUM(meals.estimated_calories)

Step Total
    = SUM(step_logs.steps)


A database view or function may be introduced later if performance requires it.

9. Notification Architecture
Notification Schedule
        |
        v
Scheduler / Trigger
        |
        v
Edge Function
        |
        +---- Preference Check
        |
        +---- Schedule Check
        |
        +---- Duplicate Check
        |
        +---- Message Generation
        |
        v
Notification Provider
        |
        v
User Device


The notification provider should be replaceable.

10. Notification Message Generation

Notification templates may contain variables.

Example:

Hey {{name}}, your lunch is waiting. 🍱


Supported variables may include:

{{name}}
{{water_remaining}}
{{steps_remaining}}
{{meal_name}}
{{goal}}


Messages should remain short and friendly.

11. PWA Architecture

Required PWA components:

manifest.webmanifest
service worker
application icons
theme metadata
standalone display configuration


Installation flow:

Open URL
   |
   v
Detect Platform
   |
   v
Already Installed?
   |
   +---- Yes ----> Open Application
   |
   +---- No
          |
          +---- Browser supports installation
          |          |
          |          v
          |      Installation UI
          |
          +---- iOS Safari
          |          |
          |          v
          |      Manual Instructions
          |
          +---- Unsupported
                     |
                     v
                Continue in Browser

12. Onboarding Architecture

Onboarding state shall be persisted per user.

Example:

onboarding_states

user_id
welcome_completed
profile_completed
tracking_preferences_completed
notification_setup_completed
installation_help_seen
tour_completed


The user shall be able to restart the product tour.

13. Offline Strategy

The initial release should prioritize reliable online operation.

Future offline functionality may include:

Local caching.

Offline activity creation.

Pending write queue.

Synchronization after reconnect.

Duplicate prevention.

Offline support must not compromise data integrity.

14. Observability

The system should record:

Application errors

Edge Function errors

Important authorization failures

Notification failures

Critical audit events

Logs must not unnecessarily contain personal activity data.

15. Backup and Recovery

Production database backups should be enabled according to the selected Supabase plan.

Database migrations must remain in source control.

The repository must contain the information necessary to recreate the application.

16. Architectural Decisions
ADR-001 — React

React is selected because the application is highly interactive and component-oriented.

ADR-002 — TypeScript

TypeScript is selected to improve type safety and maintainability.

ADR-003 — Supabase

Supabase is selected to avoid maintaining a dedicated backend service while retaining PostgreSQL, authentication, authorization, APIs, and server-side functions.

ADR-004 — PostgreSQL

PostgreSQL is selected as the primary data store because activity data is relational and benefits from strong constraints and querying.

ADR-005 — RLS

RLS is mandatory because activity data is personal and relationship-based access is required.

ADR-006 — Edge Functions

Edge Functions are used whenever logic requires trusted server execution or secrets.

ADR-007 — PWA

A PWA is selected to provide an app-like experience without requiring dedicated native Android or iOS applications.

17. Future Architecture Extensions

The architecture should allow future additions such as:

Health platform integrations

Wearable integrations

Nutrition APIs

Push notification providers

AI-assisted meal estimation

Additional companion relationships

Data export

Advanced analytics