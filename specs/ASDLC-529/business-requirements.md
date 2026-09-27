# Business Requirements: Display (All Day) Indicator Instead of Time on Event Detail Page

**Issue Key**: ASDLC-529  
**Summary**: [Events Page] Display (All Day) Indicator Instead of Time on Event Detail Page  
**Date**: 2026-09-27  
**Status**: Draft  
**Complexity**: S (Small)

---

## 1. Executive Summary

When a calendar event spans an entire day with no defined start or end time, the Event Detail Page currently displays a misleading or empty time value. This requirement defines how the system must instead display a clear **(All Day)** indicator so that users immediately understand the nature of the event without confusion.

---

## 2. Problem Statement

### Current State

When a user views an event on the Event Detail Page, the system displays a time field for the event. For events that are designated as "all day" events (i.e., they do not have a specific start or end time within the day), the time field either shows a placeholder, a midnight time, or is left blank. This creates confusion about whether the event has no time set, whether it failed to load a time, or whether it is intentionally an all-day event.

### Desired State

For events that are designated as all-day events, the time display area on the Event Detail Page must show the text **(All Day)** in place of any time value. For events with a specific time, the existing time display behavior remains unchanged.

### Business Impact

- **Users** avoid confusion and misinterpretation when reviewing event details, reducing support requests and scheduling errors.
- **Product** presents a professional, calendar-standard user experience consistent with widely understood calendar conventions.
- **Operations** benefits from fewer erroneous meeting bookings caused by ambiguous time displays.

### Urgency

This is a usability defect that affects every all-day event displayed to users. The longer it remains unaddressed, the greater the risk of user error and eroded trust in the Events system.

---

## 3. Personas & User Stories

### Persona 1: Event Viewer (General User)

A user who browses or is invited to events and consults the Event Detail Page to understand when and how long an event runs.

- **Need**: Know at a glance whether an event occupies the full day or a specific time slot.
- **Pain Point**: Currently cannot distinguish an all-day event from a timed event with a missing or malformed time.
- **Goal**: Confidently read event details without second-guessing the time field.

**User Story**:  
*As an event viewer, I want to see "(All Day)" displayed in the time area of an all-day event so that I immediately know the event has no specific time and lasts the full day.*

### Persona 2: Event Organizer

A user who creates and manages events, including all-day events such as holidays, deadlines, or multi-day conferences.

- **Need**: Assurance that the all-day events they create are displayed correctly to attendees.
- **Pain Point**: Currently unsure whether invitees will understand the event spans the whole day.
- **Goal**: The system accurately communicates their intent to all attendees.

**User Story**:  
*As an event organizer, I want all-day events I schedule to clearly display "(All Day)" to viewers so that attendees correctly understand the event timing without confusion.*

---

## 4. Business Rules

**BR-001**: An event is classified as an "all day" event when its data designates it as spanning the full day without a specific start time and end time.

**BR-002**: When an event is classified as all-day (BR-001), the time display field on the Event Detail Page must show the text **(All Day)** and must not show any time value (e.g., no clock time, no "00:00", no blank).

**BR-003**: When an event is NOT classified as all-day, the time display field on the Event Detail Page must continue to show the event's specific start time (and end time, if applicable) using the existing display format. BR-002 does not apply.

**BR-004**: The **(All Day)** label must be visible and legible under all standard display conditions (default theme, light mode, dark mode if supported).

**BR-005**: The all-day classification of an event is determined by the event data provided by the system — the display layer must not infer or calculate whether an event is all-day; it must read the designation directly from the event record.

**BR-006**: The **(All Day)** indicator must be presented consistently across all entry points to the Event Detail Page (e.g., navigating from the Events list, from a calendar view, or from a direct link).

---

## 5. Acceptance Criteria

```gherkin
Feature: Display All Day Indicator on Event Detail Page

  Scenario: All-day event shows "(All Day)" instead of a time
    Given a user is viewing the Event Detail Page
    And the event is designated as an all-day event
    When the time field is rendered
    Then the time field displays the text "(All Day)"
    And no clock time (e.g., "00:00", "12:00 AM") is shown in the time field
    And no blank or placeholder text is shown in the time field

  Scenario: Timed event continues to show its specific time
    Given a user is viewing the Event Detail Page
    And the event has a specific start time and is NOT designated as an all-day event
    When the time field is rendered
    Then the time field displays the event's specific start time
    And the text "(All Day)" is NOT shown

  Scenario: All-day event with an end date spanning multiple days shows "(All Day)"
    Given a user is viewing the Event Detail Page
    And the event spans multiple consecutive days and is designated as an all-day event
    When the time field is rendered
    Then the time field displays the text "(All Day)"
    And the date range (start date to end date) remains visible
    And no clock time is shown in the time field

  Scenario: (All Day) indicator is visible in both themes
    Given a user is viewing the Event Detail Page for an all-day event
    When the page is displayed in the default display theme
    Then the "(All Day)" text is clearly visible and legible

  Scenario: User navigates to Event Detail Page from Events list
    Given a user views a list of events
    And an event in the list is designated as all-day
    When the user opens that event's detail page
    Then the time field displays "(All Day)"

  Scenario: User navigates to Event Detail Page from a calendar view
    Given a user is on a calendar view showing events
    And an all-day event is visible on the calendar
    When the user opens that event's detail page
    Then the time field displays "(All Day)"

  Scenario: Event data does not have an all-day designation
    Given an event record where the all-day designation is absent or undefined
    When the Event Detail Page is rendered
    Then the system treats the event as a timed event
    And applies the timed event display rules (BR-003)
    And does NOT display "(All Day)"
```

---

## 6. Non-Functional Requirements

### Performance
- The **(All Day)** indicator must render within the same time as any other field on the Event Detail Page — no additional latency is introduced by this change.

### Security
- No changes to authentication or authorization are required for this feature. Display of event details continues to be governed by existing access control rules.

### Reliability
- The display logic must handle the case where the all-day designation field is absent or null without crashing. In such cases, the system defaults to timed-event display behavior (BR-003).

### Observability
- No additional logging or monitoring is required beyond what already exists for the Event Detail Page. If structured event-load errors are already logged, they continue unchanged.

### Accessibility
- The "(All Day)" text must meet existing accessibility standards applied to the Event Detail Page (e.g., readable by screen readers, sufficient contrast ratio).

### Maintainability
- The display rule for "(All Day)" must be expressed in one place so that future changes to the label or logic require a single update.

---

## 7. Edge Cases & Special Scenarios

| Scenario | Expected Behavior |
|---|---|
| All-day event with no end date | Display "(All Day)" for the single day; no end time shown |
| Multi-day all-day event | Display "(All Day)" alongside the date range (e.g., "Oct 1 – Oct 3, (All Day)") |
| All-day designation field is null or missing | Treat as timed event; do not show "(All Day)"; show time if present, or gracefully show a dash/empty per existing convention |
| All-day designation field is present but false | Treat as timed event per BR-003 |
| Event with both a time AND all-day designation set to true | All-day designation takes precedence; display "(All Day)", suppress the clock time |
| Event with all-day designation but no date information | Display "(All Day)" for the time field; date field falls back to existing empty-date display behavior |

---

## 8. Out of Scope

The following items are explicitly NOT included in this requirement:

- **Creating or editing all-day events**: This requirement covers display only. No changes to event creation or editing flows are included.
- **Calendar grid / list view indicators**: The "(All Day)" label applies only to the Event Detail Page. Changes to how all-day events appear in calendar list views, calendar grids, or event cards are not covered.
- **Push notifications or email notifications**: How all-day events are described in notifications is not in scope.
- **Time zone handling for all-day events**: Time zone display logic for all-day events is out of scope. All-day events are inherently date-based and time-zone-agnostic; no new time zone behavior is introduced.
- **Changes to the backend event data model**: The all-day designation is assumed to already be available in the event data provided by the system. No backend data model changes are included.
- **Dark mode or theme variants** (beyond confirming legibility in default theme): Full theming audit of the indicator is out of scope unless a dark mode is already supported and tested.
- **Localization/translation of the "(All Day)" label**: Internationalization of this label is deferred to a separate localization initiative.

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| All-day events on the Event Detail Page display "(All Day)" instead of a time | 100% of all-day events |
| Timed events continue to display their time correctly (no regression) | 100% of timed events |
| No user-reported confusion about event timing for all-day events after release | Zero new support tickets of this type within 30 days of release |
| "(All Day)" label renders without errors or blank display on page load | 100% render success rate |

---

## 10. References

- **Issue**: ASDLC-529 — [Events Page] Display (All Day) Indicator Instead of Time on Event Detail Page
- **Repository**: https://github.com/gouveiahenrique/onprem-api.git
- **Related domain standard**: Calendar and scheduling conventions (e.g., RFC 5545 iCalendar `DTSTART;VALUE=DATE` for all-day events as the widely accepted industry model for all-day event designation)

---

## Open Questions

The following items could not be determined from the issue description alone and must be resolved with the product owner or technical team before implementation:

1. **Who sets the all-day designation?** — Is the all-day flag set by the event creator at creation time, inferred from the absence of a start time, or determined some other way? Clarifying this ensures correct upstream behavior.
2. **What is the exact current display behavior?** — Does the Event Detail Page currently show "00:00 – 00:00", a blank, a dash, or something else for all-day events? The answer may affect regression testing scope.
3. **Is there an existing label or string resource for "(All Day)"?** — If a localization system is in use, there may already be a string key for this label that must be referenced rather than hardcoded.
4. **Multi-day events: date range display format** — What is the exact expected format when an all-day event spans multiple days (e.g., "Oct 1 – Oct 3 (All Day)" vs. "All Day · Oct 1 – Oct 3")? A design mockup or existing pattern should be referenced.
