# Business Requirements Specification

**Issue Key**: ASDLC-521
**Summary**: [Events Page] Display "All Day" Indicator Instead of Time on Event Detail Page
**Date**: 2026-09-27
**Status**: Draft
**Complexity**: S (Small)

---

## 1. Executive Summary

When a calendar event is marked as an all-day event, the Event Detail Page incorrectly displays a time value (e.g., 12:00 AM) in the time row, which is misleading because no specific start or end time applies to all-day events. The system must instead display a clear "All Day" indicator — presented as a visually distinct capsule/badge label — in place of the time value, so users immediately understand that the event spans the entire day without a specific time slot.

---

## 2. Problem Statement

### Current State
On the Event Detail Page, the time row always displays a time value (e.g., "12:00 AM") regardless of whether the event is an all-day event or a timed event. When a user views an all-day event, the displayed time "12:00 AM" is a misleading artifact — it does not reflect any intentional scheduling and creates confusion.

### Desired State
When a user views an all-day event on the Event Detail Page, the time row must display an "All Day" indicator (a visually distinct capsule/pill-shaped badge) instead of a time value. The time row for non-all-day events must continue to display the event's start and end times as before.

### Business Impact
- **Users** are confused or misled by seeing "12:00 AM" on an event with no scheduled time, potentially causing them to treat the event as a timed appointment.
- **Trust in the product** is reduced when displayed data does not match the event's intent.
- **Clarity** is critical for scheduling and calendar use cases: an incorrect time value on an all-day event represents a direct data accuracy failure.

### Urgency
This is a data accuracy defect on a core events feature. Displaying an incorrect time contradicts the event's own configuration and undermines user confidence.

---

## 3. Personas & User Stories

### Persona 1: Event Viewer (End User)
A user who opens the Event Detail Page to review event information (date, time, location, description) before attending or planning around an event.

**Pain Point**: Sees "12:00 AM" on all-day events and is confused about whether the event starts at midnight or has no specific time.

**Goal**: Quickly understand whether an event has a specific time or spans the whole day, without needing to investigate further.

**User Story**:
> As an event viewer, I want the Event Detail Page to show "All Day" instead of a time value when an event is an all-day event, so I immediately know the event has no specific start or end time.

### Persona 2: Event Organizer
A user who creates all-day events (e.g., holidays, deadlines, company-wide events) and shares them with others.

**Pain Point**: Attendees misread the event as having a start time of 12:00 AM, leading to confusion or questions.

**Goal**: Ensure the event details displayed to others accurately reflect the all-day nature of the event as configured.

**User Story**:
> As an event organizer, I want all-day events to display "All Day" so that attendees understand the event's duration exactly as I configured it.

---

## 4. Business Rules

**BR-001**: When an event is configured as an all-day event, the time row on the Event Detail Page must display an "All Day" indicator and must not display any time value (e.g., no start time, no end time, no "12:00 AM").

**BR-002**: When an event is NOT configured as an all-day event (i.e., it is a timed event), the time row must continue to display the event's start time and end time exactly as it does today. No change to timed event behavior is permitted.

**BR-003**: The "All Day" indicator must be rendered as a visually distinct capsule or pill-shaped badge so it is clearly distinguishable from plain text time values.

**BR-004**: The determination of whether an event is all-day is provided by the upstream data source. The system must use this provided flag as-is — no client-side inference or computation of all-day status from time values is permitted.

**BR-005**: The "All Day" indicator text must be exactly "All Day" (two words, title case) to ensure consistency with common calendar conventions.

**BR-006**: The change must apply exclusively to the time row of the Event Detail Page. No other rows, fields, or pages are affected by this change.

---

## 5. Acceptance Criteria

```gherkin
Feature: All Day Indicator on Event Detail Page

  Background:
    Given the user navigates to the Event Detail Page

  # --- Happy Path: All-Day Event ---

  Scenario: All-day event displays "All Day" indicator instead of time
    Given the event is marked as an all-day event
    When the user views the Event Detail Page
    Then the time row displays an "All Day" badge/capsule indicator
    And the time row does not display any time value (e.g., no "12:00 AM", no "AM", no "PM")

  Scenario: "All Day" indicator is visually distinct
    Given the event is marked as an all-day event
    When the user views the time row on the Event Detail Page
    Then the "All Day" text is presented inside a capsule or pill-shaped visual element
    And it is visually differentiated from plain text time values

  # --- Happy Path: Timed Event (No Regression) ---

  Scenario: Timed event continues to display start and end time
    Given the event is NOT marked as an all-day event
    And the event has a defined start time and end time
    When the user views the Event Detail Page
    Then the time row displays the event's start time
    And the time row displays the event's end time
    And no "All Day" indicator is shown

  # --- Edge Cases ---

  Scenario: All-day event that spans multiple days still shows "All Day" indicator
    Given the event is marked as an all-day event
    And the event spans more than one calendar day
    When the user views the Event Detail Page
    Then the time row displays the "All Day" indicator
    And no time value is shown

  Scenario: All-day indicator text uses correct casing
    Given the event is marked as an all-day event
    When the user views the time row
    Then the indicator text reads exactly "All Day" (title case, two words)

  Scenario: Timed event with midnight start time (00:00) does not show "All Day"
    Given the event is NOT marked as an all-day event
    And the event has a start time of 12:00 AM (midnight)
    When the user views the Event Detail Page
    Then the time row displays "12:00 AM" as the start time
    And no "All Day" indicator is shown
```

---

## 6. Non-Functional Requirements

### Clarity & Usability
- The "All Day" indicator must be immediately recognizable as a label/badge, not a time value.
- The visual treatment (capsule/pill shape) must conform to the existing design system's badge or chip conventions used elsewhere in the product.

### Consistency
- The "All Day" label text must be consistent with any other occurrences of all-day event labeling in the product (e.g., calendar list views, event cards).

### Accessibility
- The "All Day" indicator must be accessible to screen readers and must convey the same meaning to assistive technology users as it does visually.
- Contrast ratio of the badge label against its background must meet accessibility standards.

### Performance
- This change must not introduce any additional data fetching or processing. The all-day flag is already provided by the upstream data source.

### Observability
- No additional logging or monitoring is required for this change. It is a pure display-layer correction with no backend state changes.

---

## 7. Edge Cases & Special Scenarios

| Scenario | Expected Behavior |
|---|---|
| All-day event with no other details (no location, no description) | Time row shows "All Day" indicator; other empty rows remain unchanged |
| All-day event spanning multiple days | Time row shows "All Day" indicator only; date fields show the date range as already handled |
| Timed event starting at 12:00 AM (midnight) | Time row shows "12:00 AM" — NOT the "All Day" indicator; the all-day flag is the sole determinant |
| All-day flag is explicitly `false` on a timed event | Time row shows the actual start/end time; no "All Day" indicator |
| All-day flag is missing or unavailable from the data source | This is an open question — see Section 10. Until resolved, treat missing flag as a timed event (show time value, not "All Day") |

---

## 8. Out of Scope

The following are explicitly NOT included in this requirement:

- **Event list / calendar views**: Only the Event Detail Page time row is in scope. All-day display behavior in list views, calendar grids, or event cards is not changed.
- **Creating or editing all-day events**: No changes to event creation or editing flows.
- **Backend / data layer changes**: The all-day flag is already provided by the upstream system. No changes to data storage, APIs, or event models are required.
- **Date row changes**: Only the time row is affected. Date display (start date, end date) is not changed.
- **Other event fields**: Location, description, organizer, attendees, and other fields are not affected.
- **Notification or reminder behavior**: No changes to how all-day events interact with notifications or reminders.
- **Localization / translation**: The "All Day" text translation or localization into other languages is out of scope for this issue unless the product already has a localization framework that handles it automatically.

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| All-day events display "All Day" indicator on Event Detail Page | 100% of all-day events |
| Timed events continue to display correct start/end time | 100% of timed events (zero regression) |
| "12:00 AM" no longer appears on any all-day event's time row | 0 occurrences |
| "All Day" indicator uses capsule/pill visual treatment | 100% of all-day event detail views |
| Accessibility: "All Day" communicates correctly to screen readers | Verified via accessibility audit |

---

## 10. Open Questions

| # | Question | Impact | Owner |
|---|---|---|---|
| OQ-001 | What is the expected behavior when the all-day flag is absent or null from the data source? Should the system default to showing a time value or the "All Day" indicator? | Defines fallback behavior for data edge case | Product Owner |
| OQ-002 | Should the "All Day" indicator text be subject to existing localization/translation pipelines, or is English-only acceptable for this release? | Scope of change for internationalized builds | Product Owner |
| OQ-003 | Is there an existing badge/chip component in the design system that must be reused, or should a new visual style be defined? | Ensures visual consistency | Design |

---

## 11. References

- **Issue**: ASDLC-521 — [Events Page] Display (All Day) Indicator Instead of Time on Event Detail Page
- **Repository**: https://github.com/gouveiahenrique/onprem-api
- **Related Domain**: Calendar / Events — Event Detail Page, time row display logic
