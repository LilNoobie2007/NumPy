NumPy — Product Requirements Document
1. Document Information
Field	Value
Product	NumPy
Document	Product Requirements Document
Version	1.0
Status	Initial
Platform	Progressive Web Application
Primary User	Primary User
Secondary User	Companion
Frontend	React + TypeScript
Backend Platform	Supabase
Database	PostgreSQL
Hosting	Vercel
2. Product Overview

NumPy is a personal daily activity tracking Progressive Web Application (PWA).

The application allows a primary user to record daily activities such as:

Meals

Estimated calorie intake

Water consumption

Steps

Weight

Sleep

Exercise

Mood

A companion user can view authorized activity information through a separate dashboard.

The application is designed to be simple, friendly, personal, and easy to use. The primary user should be able to record most activities within a few seconds without requiring technical knowledge.

3. Product Goals
3.1 Primary Goals

Make daily activity logging simple.

Minimize manual typing.

Provide useful daily and historical summaries.

Allow an authorized companion to monitor shared activity data.

Provide friendly and configurable reminders.

Work as an installable PWA.

Provide strong access control for personal data.

Provide a clean mobile-first experience.

3.2 Secondary Goals

Support historical charts.

Support configurable daily goals.

Support personalized notification messages.

Support onboarding and guided tours.

Support offline-friendly behavior where practical.

Provide a foundation for future health/activity integrations.

4. Product Principles
Simple

The primary user should not need to understand the technical implementation.

Fast

Most daily activities should require one to three interactions.

Personal

The application may use friendly, affectionate, and playful messages.

Non-Judgmental

Missing a goal should not be represented as failure.

Private

Activity information must only be accessible to authorized users.

Transparent

Estimated values, especially calorie values, must be clearly identified as estimates.

5. User Types
5.1 Primary User

The primary user records personal activities.

Examples:

Breakfast

Lunch

Dinner

Snacks

Water

Steps

Weight

Sleep

Exercise

Mood

5.2 Companion User

The companion can view authorized activity information.

The companion may:

View today's status.

View historical activity.

View charts.

View meal records.

View water consumption.

View steps.

View weight history.

Configure approved reminders.

Send personalized messages.

The companion should not automatically receive permission to modify the primary user's activity records.

6. Functional Requirements
FR-001 Authentication

The system shall support authenticated users.

The system shall distinguish between primary and companion users.

The system shall maintain authenticated sessions.

FR-002 User Profile

The system shall maintain a profile for each user.

Profile information may include:

Display name

Avatar

Time zone

Preferred units

Notification preferences

Onboarding state

FR-003 Relationship Management

The system shall support a relationship between a primary user and a companion.

A relationship shall contain:

Primary user

Companion user

Relationship status

Creation date

Permission level

Authorization shall not rely on hard-coded email addresses.

FR-004 Meal Logging

The primary user shall be able to log meals.

A meal record shall support:

Meal type

Food item

Quantity

Unit

Estimated calories

Date

Time

Notes

Supported meal types shall include:

Breakfast

Lunch

Snack

Dinner

Other

The user shall be able to edit and delete their own meal records.

FR-005 Calorie Calculation

The system shall support estimated calorie calculation.

Calories may be calculated using:

A predefined food database.

User-created foods.

Previously logged foods.

Manually supplied calorie values.

Future external nutrition services.

Calculated calorie values shall be identified as estimates.

FR-006 Water Logging

The user shall be able to record water consumption.

Quick actions should include configurable amounts such as:

250 ml

500 ml

750 ml

Custom

The system shall display:

Consumed / Daily Target

Example:

1.5 L / 2.2 L

FR-007 Step Tracking

The system shall support step records.

The initial version shall support manual entry.

Future versions may support device-based activity integrations.

FR-008 Weight Tracking

The user shall be able to record weight.

The system shall store:

Weight

Unit

Date

Time

Historical weight information shall be available to the companion dashboard.

FR-009 Sleep Tracking

The system shall support:

Sleep start

Sleep end

Duration

Optional quality indicator

Sleep tracking shall remain optional.

FR-010 Exercise Tracking

Exercise records may include:

Activity type

Duration

Intensity

Estimated calories

Notes

FR-011 Mood Tracking

The user shall optionally record mood.

The initial interface may use:

Very good

Good

Neutral

Low

Very low

Mood data shall not be presented as a medical assessment.

FR-012 Daily Dashboard

The primary user shall have a daily dashboard containing:

Meals

Calories

Water

Steps

Weight

Sleep

Exercise

Mood

Only enabled tracking categories should be displayed prominently.

FR-013 Companion Dashboard

The companion shall have a separate dashboard.

The dashboard shall provide:

Current-day overview

Meal status

Water status

Step status

Weight

Sleep

Activity history

Charts

Trends

FR-014 Charts

The system shall provide charts for:

Water

Steps

Calories

Weight

Sleep

Exercise

Supported periods:

7 days

30 days

90 days

Custom

FR-015 Notifications

The system shall support configurable reminders.

Examples:

Breakfast reminder

Lunch reminder

Dinner reminder

Water reminder

Activity reminder

Evening summary

Messages shall support multiple templates.

Example:

"NumPy, your lunch appointment has arrived. 🍱"

Notifications should be configurable and dismissible.

FR-016 Personalized Messages

The companion shall be able to create approved personalized reminder messages.

Messages may be:

Scheduled

One-time

Repeated

Enabled

Disabled

FR-017 PWA Installation

The application shall support installation as a Progressive Web Application.

The system shall provide installation guidance appropriate to the user's browser.

For iOS, the application shall provide instructions for adding the application to the Home Screen when an automatic installation prompt is unavailable.

FR-018 Onboarding

The application shall provide a first-use onboarding experience.

The onboarding shall explain:

What NumPy is.

What information can be tracked.

How to log an activity.

How notifications work.

How to install the PWA.

How to use the dashboard.

FR-019 Product Tour

The application shall provide an optional guided tour.

The tour shall highlight:

Home screen

Daily progress

Water logging

Meal logging

Activity logging

History

Settings

The user shall be able to:

Skip the tour.

Continue the tour.

Restart the tour later.

FR-020 Settings

The primary user shall be able to configure:

Name

Units

Daily water target

Step target

Notification preferences

Enabled tracking categories

Notification tone

Privacy settings

7. Non-Functional Requirements
NFR-001 Performance

The initial mobile screen should load quickly on normal mobile connections.

The application shall avoid unnecessary network requests.

NFR-002 Security

Personal activity data shall be protected using authentication and database authorization.

Supabase Row Level Security (RLS) shall be enabled for exposed tables.

NFR-003 Privacy

The application shall collect only data required by its features.

The system shall not expose the primary user's data through public endpoints.

NFR-004 Availability

The application shall use managed cloud infrastructure.

NFR-005 Maintainability

The application shall use TypeScript.

Business logic shall be separated from presentation components.

NFR-006 Accessibility

The application shall support:

Readable text

Sufficient color contrast

Keyboard navigation where applicable

Screen-reader-friendly labels

Large mobile touch targets

NFR-007 Responsiveness

The application shall support:

Mobile phones

Tablets

Desktop browsers

The primary experience shall be mobile-first.

8. MVP Scope

The first release shall contain:

Authentication

User profiles

Primary/companion relationship

Meal logging

Calorie estimates

Water tracking

Step tracking

Weight tracking

Daily dashboard

Companion dashboard

Basic charts

Notifications

PWA installation

Onboarding

Product tour

RLS

Audit logging for sensitive operations

9. Future Scope

Potential future features include:

Health platform integrations

Automatic step synchronization

Nutrition database integration

Wearable integrations

AI-assisted meal estimation

Photo-based meal logging

Advanced analytics

Multiple companions

Export to CSV

Data deletion/export tools

Advanced notification scheduling

10. Success Criteria

The MVP shall be considered successful when:

The primary user can log common daily activities quickly.

The companion can view authorized activity data.

Personal data cannot be accessed without authorization.

The PWA can be installed on supported devices.

Notifications work when permission is granted.

The onboarding experience can be completed without assistance.

The application is usable on mobile and desktop.

Critical security and business logic is covered by tests.