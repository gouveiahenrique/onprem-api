# Business Requirements Specification
## ASDLC-527: Display "All Day" Indicator Instead of Time on Event Detail Page

**Issue Key**: ASDLC-527  
**Date**: 2026-09-27  
**Status**: Draft  
**Complexity**: S (Small)

---

## 1. Executive Summary

When a calendar event is marked as an all-day event, the Event Detail Page currently displays a misleading time value (12:00 AM) in the time row. This specification defines the requirement to replace that placeholder time with a clearly labeled "All Day" indicator — presented as a capsule/pill-shaped badge — so that users immediately understand that the event spans the entire day with no specific start or end time.

---

## 2. Problem Statement

### Current State
On the Event Detail Page, the time row always displays a formatted clock time (e.g., "12:00 AM") regardless of whether the event is an all-day event. When the event has no specific time, this display of "12:00 AM" is technically incorrect and misleads users into thinking the event starts at midnight.

### Desired State
When an event is flagged as an all-day event, the time row on the Event Detail Page must display an "All Day" capsule/pill-shaped label instead of any time value. This label communicates unambiguously that the event occupies the full day without a designated start or end time.

### Business Impact
- **User trust**: Showing "12:00 AM" for all-day events creates confusion and erodes user confidence in the accuracy of event information.
- **User experience**: Users planning around events need to know at a glance whether an event is time-specific or spans all day. Incorrect time information forces users to second-guess their schedule.
- **Who benefits**: All users who create or view all-day events on the Event Detail Page.

### Urgency
This is a data accuracy and UX correctness defect. Until resolved, every all-day event displays inaccurate information. There is no meaningful cost to the business from delaying beyond continued user confusion, but the fix is small and well-defined.

---

## 3. Personas & User Stories

### Persona A: Event Viewer
A person browsing event details to understand when an event occurs and how to plan around it.

**Pain point**: Sees "12:00 AM" on an all-day event and is uncertain whether the event literally starts at midnight or whether this is a display error.

**Goal**: Immediately understand, without ambiguity, that an event spans the entire day.

**User Story**:
> As an event viewer, I want to see a clear "All Day" label on the time row when an event is an all-day event, so that I am not confused by a misleading time value.

### Persona B: Event Organizer
A person who created an event as all-day and uses the detail page to verify how it appears to attendees.

**Pain point**: The event was saved as all-day, but the detail page shows "12:00 AM," making them unsure the all-day flag was saved correctly.

**Goal**: Confirm their all-day event is displayed accurately, instilling confidence that attendees will interpret the event correctly.

**User Story**:
> As an event organizer, I want the Event Detail Page to show "All Day" in the time row when I have marked the event as an all-day event, so that I can be confident the event is communicated correctly to viewers.

---

## 4. Business Rules

**BR-001**: When an event is marked as an all-day event, the time row on the Event Detail Page must display an "All Day" label and must not display any clock time value.

**BR-002**: The "All Day" label must be visually distinct from a plain text clock time. It must be rendered as a capsule/pill-shaped badge or indicator.

**BR-003**: When an event is NOT marked as an all-day event, the time row must continue to display the event's start and end times as it currently does. This change must not affect timed events.

**BR-004**: The determination of whether an event is all-day is made by the event's own all-day flag/property as provided by the data source. The display layer must not derive or infer all-day status from the time value itself (e.g., must not check whether time equals "12:00 AM").

**BR-005**: The "All Day" label must use accessible, legible text. It must be distinguishable for users with color vision deficiencies (i.e., the distinction between a timed event's time row and an all-day event's time row must not rely on color alone).

**BR-006**: The time row must always remain visible on the Event Detail Page regardless of event type. For all-day events, the row simply changes its content from a time value to the "All Day" badge; the row itself is not hidden.

---

## 5. Acceptance Criteria

```gherkin
Feature: All Day Indicator on Event Detail Page

  Background:
    Given the user is on the Event Detail Page for a specific event

  Scenario: All-day event displays "All Day" badge instead of time
    Given the event is marked as an all-day event
    When the user views the time row on the Event Detail Page
    Then the time row displays an "All Day" badge
    And the "All Day" badge is styled as a capsule/pill shape
    And no clock time value (e.g., "12:00 AM") is displayed in the time row

  Scenario: Timed event continues to display its clock time
    Given the event is NOT marked as an all-day event
    And the event has a defined start time and end time
    When the user views the time row on the Event Detail Page
    Then the time row displays the event's start and end times
    And no "All Day" badge is displayed

  Scenario: Time row remains present for all-day events
    Given the event is marked as an all-day event
    When the user views the Event Detail Page
    Then the time row is visible on the page
    And the time row contains the "All Day" badge

  Scenario: "All Day" badge is visually distinct
    Given the event is marked as an all-day event
    When the user views the time row on the Event Detail Page
    Then the "All Day" badge is rendered with a capsule/pill shape visible to the user
    And the badge is distinguishable without relying solely on color

  Scenario: All-day flag drives the display, not the time value
    Given an event whose stored time value happens to be "12:00 AM"
    And the event is NOT flagged as an all-day event
    When the user views the time row on the Event Detail Page
    Then the time row displays "12:00 AM" as the event time
    And no "All Day" badge is shown
```

---

## 6. Non-Functional Requirements

### Usability
- The "All Day" badge must be immediately recognizable and legible at normal viewing distances and default font sizes.
- The visual treatment of the badge must be consistent with any other badge/label patterns used elsewhere in the application.

### Accessibility
- The "All Day" label must have sufficient color contrast ratio to meet WCAG 2.1 AA standards.
- The label must be accessible to screen readers (i.e., the text "All Day" or an equivalent accessible label must be programmatically determinable).
- The distinction between all-day and timed events must not rely on color alone (BR-005).

### Performance
- This change is presentational; it must not introduce any additional network calls or data fetching. The all-day flag must already be present in the event data supplied to the Event Detail Page.

### Reliability
- The "All Day" badge must render correctly every time an all-day event is viewed. There must be no fallback to displaying a time value when the all-day flag is set.

### Maintainability
- The label text "All Day" must be easy to locate and update in the future (e.g., for localization), and must not be duplicated in multiple scattered locations.

### Observability
- No additional logging or monitoring is required for this change, as it is a purely presentational correction.

---

## 7. Edge Cases & Special Scenarios

### EC-001: Event with all-day flag set but also with a time value in the data
- **Scenario**: The underlying event data includes both an all-day flag and a stored time (e.g., "12:00 AM").
- **Expected behavior**: The all-day flag takes precedence. The time row displays the "All Day" badge. The stored time value is not shown.

### EC-002: Event where all-day flag is absent or undefined
- **Scenario**: The event data does not include the all-day flag at all (missing field, null, or undefined).
- **Expected behavior**: Treat the event as NOT all-day. Display the event's time value as usual. Do not display the "All Day" badge.

### EC-003: Multi-day all-day event spanning several calendar days
- **Scenario**: An event spans more than one full day and is marked as all-day.
- **Expected behavior**: The time row still displays the "All Day" badge. No specific time is shown. (Date range display, if any, is separate from the time row and is out of scope for this requirement.)

### EC-004: All-day event viewed by different user roles
- **Scenario**: An event organizer, attendee, or anonymous viewer all open the same all-day event.
- **Expected behavior**: All roles see the "All Day" badge in the time row. The display does not change based on the viewer's role.

### EC-005: "All Day" label text length and truncation
- **Scenario**: The time row layout does not provide enough horizontal space for the "All Day" badge.
- **Expected behavior**: The badge must not be truncated or hidden. The time row must accommodate the badge width without clipping the text.

---

## 8. Out of Scope

The following are explicitly NOT part of this requirement:

- **Creating or editing all-day events**: Changes to how events are created or marked as all-day are not in scope. Only the display on the Event Detail Page is affected.
- **Event list/calendar views**: Changes to how all-day events appear in calendar grid views, agenda views, or event list screens are not in scope.
- **Date range display for multi-day events**: How start and end dates are shown for multi-day events is a separate concern and not addressed here.
- **Localization or translation of the "All Day" text**: Internationalization of the label is not required by this ticket, though the implementation must not make future localization difficult.
- **Notifications or reminders for all-day events**: Any notification behavior changes are not in scope.
- **Backend data changes**: No changes to how events are stored or how the all-day flag is computed are required. This is a display-only change.
- **Other event detail fields**: Only the time row is affected. No other fields on the Event Detail Page are changed.

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| All-day events display "All Day" badge in time row | 100% of all-day events |
| Timed events continue to display their clock time | 100% of timed events (zero regression) |
| "12:00 AM" no longer appears for any all-day event | Zero occurrences |
| Badge meets WCAG 2.1 AA color contrast ratio | Contrast ratio ≥ 4.5:1 |
| No additional network requests introduced | Zero new requests per page load |
| Verified on all supported screen sizes | Pass on all breakpoints |

---

## 10. References

- **Issue**: ASDLC-527 — [Events Page] Display (All Day) Indicator Instead of Time on Event Detail Page
- **Repository**: https://github.com/gouveiahenrique/onprem-api.git
- **Related UX concept**: Capsule/pill-shaped badge — a rounded rectangular label commonly used to display categorical status information
- **Accessibility standard**: WCAG 2.1 AA (Web Content Accessibility Guidelines, Level AA)
