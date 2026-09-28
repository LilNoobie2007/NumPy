NumPy — Software Requirements Specification
1. Purpose

This document defines the functional and non-functional software requirements for NumPy.

The purpose of this document is to provide a common reference for development, testing, deployment, and future maintenance.

2. Scope

NumPy is a Progressive Web Application for personal daily activity tracking.

The system consists of:

A primary-user mobile experience.

A companion dashboard.

Authentication.

Activity tracking.

Goal tracking.

Notifications.

Onboarding.

PWA installation.

Database-backed authorization.

3. System Actors
Actor	Description
Primary User	Records personal activity
Companion	Views authorized activity
System	Performs calculations and automated processing
Administrator	Optional technical maintenance role
4. Core Use Cases
UC-001 — Log Water
Preconditions

User is authenticated.

Water tracking is enabled.

Flow

User opens NumPy.

User selects Water.

User selects an amount.

System validates the amount.

System stores the record.

System updates the daily total.

UI displays updated progress.

Alternative Flow

If the request fails because of network connectivity, the application shall display an appropriate error or queue the record if offline support is enabled.

UC-002 — Log Meal
Preconditions

User is authenticated.

Meal tracking is enabled.

Flow

User selects Meal.

User selects meal type.

User searches for or selects a food.

User selects quantity.

System calculates an estimated calorie value.

User confirms the meal.

System stores the record.

Daily calorie totals are updated.

UC-003 — View Daily Progress

User opens the home screen.

System retrieves today's records.

System calculates daily totals.

System compares totals against configured goals.

UI displays progress.

UC-004 — View Companion Dashboard

Companion signs in.

System identifies authorized relationships.

Database authorization verifies access.

Dashboard retrieves permitted records.

Charts and summaries are generated.

UC-005 — Configure Reminder

Companion opens reminder settings.

Companion selects a reminder.

Companion configures the schedule and message.

System validates permissions.

System stores the configuration.

Notification processing uses the configuration.

UC-006 — Complete Onboarding

User signs in for the first time.

System checks onboarding state.

Onboarding is displayed.

User completes or skips individual steps.

System records onboarding progress.

User enters the main application.

UC-007 — Install PWA

User opens NumPy.

System detects browser/platform capabilities.

System determines whether the application is already installed.

If installation is supported, installation guidance is displayed.

If iOS Safari is being used, manual installation instructions are displayed.

User completes installation where supported.

UC-008 — Revoke Companion Access

Primary user opens privacy or relationship settings.

Primary user selects the companion relationship.

User confirms revocation.

Relationship status becomes revoked.

Companion access is immediately restricted by database policies.

5. Functional Requirements
Authentication

The system shall authenticate users.

The system shall maintain user sessions.

The system shall support secure sign-out.

Protected data shall require authentication.

Profiles

The system shall maintain one profile per authenticated user.

Profiles shall support display names and preferences.

Profiles shall support time zones.

Relationships

The system shall support primary/companion relationships.

Relationships shall have an explicit status.

Access shall depend on the relationship status.

Revoked relationships shall not provide access.

Meals

Users shall be able to create meals.

Users shall be able to edit their own meals.

Users shall be able to delete their own meals.

Meals shall support meal types.

Meals shall support estimated calories.

Water

Users shall be able to record water.

Users shall be able to use quick-add values.

Users shall be able to configure a daily target.

Daily totals shall be calculated automatically.

Steps

Users shall be able to record steps.

Step goals shall be configurable.

Historical step data shall be available.

Weight

Users shall be able to record weight.

Weight units shall be configurable.

Historical records shall be available.

Sleep

Users shall be able to record sleep.

Sleep duration shall be calculated where start and end times exist.

Exercise

Users shall be able to record exercise.

Exercise records shall support duration and activity type.

Mood

Users shall optionally record mood.

Mood shall not be interpreted as medical information.

Dashboard

The primary dashboard shall summarize today's activity.

The companion dashboard shall summarize authorized activity.

Charts shall support historical periods.

Notifications

Notifications shall respect user preferences.

Notification schedules shall be configurable.

Duplicate notifications shall be avoided.

Notification messages shall support templates.

Onboarding

New users shall receive onboarding.

Users shall be able to skip onboarding.

Users shall be able to replay the product tour.

6. Business Rules
BR-001

A user may modify their own activity records.

BR-002

A companion may only access records explicitly shared with them.

BR-003

Authorization shall be enforced at the database layer.

BR-004

Frontend checks shall not be treated as security controls.

BR-005

Calorie calculations shall be treated as estimates.

BR-006

Notifications shall not be sent when the corresponding notification preference is disabled.

BR-007

A user shall be able to revoke companion access.

BR-008

Server-side credentials shall never be included in browser code.

BR-009

The application shall not expose database errors directly to users.

BR-010

The system shall store timestamps in a consistent format and convert them to the user's configured time zone for display.

7. Data Requirements

The system shall maintain the following conceptual entities:

User

Profile

Relationship

Meal

Food

Water Log

Step Log

Weight Log

Sleep Log

Exercise Log

Mood Log

Daily Goal

Notification

Notification Template

Notification Schedule

Onboarding State

Audit Event

8. Validation Requirements
Water

Amount must be greater than zero.

Amount must be within a reasonable configured maximum.

Weight

Value must be positive.

Unit must be valid.

Steps

Value must be a non-negative integer.

Meal

Meal type must be valid.

Quantity must be positive.

Estimated calories must be non-negative.

Notifications

Schedule must contain a valid time.

Message must be within the supported length.

User preference must allow the notification.

9. Error Handling

The system shall handle:

Network failure

Authentication failure

Expired sessions

Invalid input

Permission denial

Database errors

Notification permission denial

Unsupported browser capabilities

User-facing errors shall use simple language.

Example:

"We could not save that right now. Please try again."

The application shall not expose SQL errors, stack traces, tokens, or internal implementation details.

10. Security Requirements

The system shall:

Require authentication for private data.

Use RLS for database authorization.

Restrict companion access through explicit relationships.

Prevent service-role credentials from reaching the browser.

Validate privileged operations server-side.

Protect notification endpoints.

Prevent unauthorized modification of records.

Record important security-related events where appropriate.

11. Performance Requirements

The application should:

Load the primary mobile experience quickly.

Avoid unnecessary database requests.

Cache suitable server state.

Paginate historical records when necessary.

Avoid loading large datasets when a summary is sufficient.

12. Accessibility Requirements

The application shall provide:

Accessible labels.

Keyboard navigation where applicable.

Adequate color contrast.

Touch-friendly controls.

Semantic HTML.

Clear focus states.

Non-color-only status indicators.

13. Acceptance Criteria

A feature shall be considered complete when:

The expected use case works.

Invalid input is handled.

Authorization has been tested.

Mobile behavior has been verified.

Loading states exist.

Error states exist.

Relevant tests pass.

Database migrations are reproducible.

Documentation is updated where necessary.