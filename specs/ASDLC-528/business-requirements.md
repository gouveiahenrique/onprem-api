# Business Requirements Specification

**Issue Key**: ASDLC-528  
**Summary**: [Events Page] Display "All Day" Indicator Instead of Time on Event Detail Page  
**Date**: 2026-09-27  
**Status**: Draft  
**Complexity**: S (Small)

---

## 1. Executive Summary

When an event is marked as an all-day event, the Event Detail Page currently displays a misleading time value (12:00 AM) in the time row. This specification defines the requirement to replace that misleading time display with a clearly labeled "All Day" indicator so users understand that the event spans the entire day and has no specific start or end time.

---

## 2. Problem Statement

### Current State

When a user views the detail page of an all-day event, the time row shows "12:00 AM". This value is a placeholder artifact rather than a meaningful time and incorrectly implies the event begins and ends at a specific hour.

### Desired State

When a user views the detail page of an all-day event, the time row must display an "All Day" indicator — presented as a capsule or badge label — so the user immediately understands that the event covers the entire day without a defined start or end time.

### Business Impact

- **Users** are confused or misled when scheduling or reviewing all-day events, leading to incorrect expectations about event timing.
- Displaying an accurate "All Day" indicator removes ambiguity and improves the reliability of the Events feature as a communication and scheduling tool.

### Urgency

The current behavior is actively misleading. Any user who relies on the Events Detail Page for scheduling accuracy receives incorrect information every time they view an all-day event.

---

## 3. Personas & User Stories

### Persona 1: Event Attendee

**Profile**: A user who receives or views events in the application to understand when and how to participate.  
**Pain Point**: Seeing "12:00 AM" on an all-day event creates confusion about whether they need to be available at midnight or throughout the day.  
**Goal**: Instantly know that an event lasts the full day without needing to interpret placeholder times.

**User Story**:  
> As an event attendee, I want the Event Detail Page to clearly indicate when an event is all-day, so that I am not confused by a placeholder time value and can correctly plan my availability.

### Persona 2: Event Organizer

**Profile**: A user who creates or manages events and expects the system to accurately represent the events they define.  
**Pain Point**: Setting an event as "All Day" and then seeing "12:00 AM" displayed on the detail page undermines confidence in the system's accuracy.  
**Goal**: See that the system faithfully represents all-day events with an appropriate label.

**User Story**:  
> As an event organizer, I want the Event Detail Page to display an "All Day" indicator when I have marked an event as all-day, so that attendees receive accurate information and I can trust the system to reflect my intent.

---

## 4. Business Rules

**BR-001**: When an event is marked as an all-day event, the time row on the Event Detail Page must not display any time value (including placeholder values such as "12:00 AM").

**BR-002**: When an event is marked as an all-day event, the time row on the Event Detail Page must display an "All Day" indicator in place of the time value.

**BR-003**: The "All Day" indicator must be visually distinct from regular time values (for example, presented as a capsule or badge label), so users recognize it as a categorical label rather than a clock time.

**BR-004**: When an event is NOT marked as all-day, the time row must continue to display the event's start and end times as currently implemented; no change to timed-event behavior is required.

**BR-005**: The "All Day" vs. timed distinction is determined by a flag already present on the event data. The system must respect this flag as the authoritative source — no client-side time inference or override is permitted.

**BR-006**: The "All Day" indicator text must be human-readable and localization-ready (the label string must be defined in a way that supports future translation, even if translation is not in scope for this iteration).

---

## 5. Acceptance Criteria

```gherkin
Feature: All-Day Event Indicator on Event Detail Page

  Background:
    Given the user is authenticated and has access to the Events section

  Scenario: All-day event shows "All Day" indicator instead of time
    Given an event exists that is marked as an all-day event
    When the user navigates to the Event Detail Page for that event
    Then the time row displays an "All Day" indicator
    And the time row does not display any clock time (e.g., "12:00 AM")

  Scenario: "All Day" indicator is visually styled as a capsule or badge
    Given an event exists that is marked as an all-day event
    When the user views the Event Detail Page for that event
    Then the "All Day" label appears in a visually distinct capsule or badge style
    And the label is clearly readable and identifiable as a categorical indicator

  Scenario: Timed event continues to display start and end times
    Given an event exists that is NOT marked as an all-day event
    And the event has a defined start time and end time
    When the user navigates to the Event Detail Page for that event
    Then the time row displays the event's start and end times
    And no "All Day" indicator is shown

  Scenario: All-day indicator uses the authoritative event flag
    Given an event's all-day status is provided by the backend event data
    When the Event Detail Page renders the time row
    Then the "All Day" vs. timed display is determined solely by the all-day flag from the event data
    And the system does not infer all-day status from time values (e.g., detecting "00:00")

  Scenario: Edge case — all-day event with no title or description
    Given an all-day event exists with no title or description
    When the user navigates to the Event Detail Page for that event
    Then the time row still correctly displays the "All Day" indicator

  Scenario: Edge case — multiple all-day events viewed in sequence
    Given the user views an all-day event and then navigates to a timed event
    When the time row is displayed for each event
    Then each event's time row accurately reflects its own all-day or timed status
    And no stale "All Day" indicator persists when viewing a timed event
```

---

## 6. Non-Functional Requirements

### 6.1 Performance

- The "All Day" indicator must render without any perceptible delay relative to the rest of the Event Detail Page. No additional network requests may be introduced solely to determine all-day status; the flag must already be available in the event data.

### 6.2 Accessibility

- The "All Day" indicator must meet accessibility standards: the label text must be available to screen readers. A purely visual badge with no accessible text is not acceptable.

### 6.3 Localization

- The "All Day" label string must be externalized so it can be translated in future localization efforts. Hard-coded, non-translatable strings are not acceptable.

### 6.4 Consistency

- The visual style of the "All Day" indicator (capsule/badge) must be consistent with any existing badge or pill components used elsewhere in the application, to maintain a coherent design language.

### 6.5 Reliability

- The logic that determines whether to show the "All Day" indicator or a time value must be deterministic: for any given event, the same display must appear on every render. No race conditions or state-dependent flickering between the two states is acceptable.

---

## 7. Edge Cases & Special Scenarios

| Scenario | Expected Behavior |
|---|---|
| All-day event with no associated time data at all | Display "All Day" indicator; do not error or show blank |
| All-day event where the backend provides a time value alongside the all-day flag | The all-day flag takes precedence; display "All Day" indicator, not the time value |
| Timed event where start time equals midnight (00:00) | Display the actual time (00:00 / 12:00 AM), NOT "All Day"; only the all-day flag triggers the indicator |
| User navigates back and forward between event detail pages | Correct indicator for each event displayed; no cross-event state leakage |
| All-day event detail page rendered on a small screen / mobile viewport | "All Day" indicator remains fully visible and readable; must not overflow or be clipped |
| Event data loads asynchronously | Time row must not briefly flash "12:00 AM" before resolving to "All Day"; loading state must be handled gracefully |

---

## 8. Out of Scope

The following items are explicitly excluded from this requirement:

- **Creating or editing all-day events** — No changes to event creation or edit flows are required.
- **Calendar list or grid views** — Only the Event Detail Page time row is in scope; how all-day events appear on calendar grids or event lists is not addressed here.
- **Notification or reminder behavior** — Changes to how notifications are triggered for all-day events are not in scope.
- **Time zone handling** — This requirement does not alter how time zones are applied to events; all-day events continue to be handled as they currently are with respect to time zones.
- **Translation/localization implementation** — The label must be externalized to support future translation, but actual translation into other languages is out of scope for this iteration.
- **Backend data model changes** — The all-day flag is assumed to already exist in the event data; no backend schema changes are in scope.
- **Any other field or row on the Event Detail Page** — Only the time row display for all-day events is affected.

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| All-day events display "All Day" indicator on Event Detail Page | 100% of all-day events |
| Timed events continue to display correct times | 100% of timed events (zero regressions) |
| No accessibility violations introduced | 0 new accessibility failures |
| "12:00 AM" placeholder no longer visible for all-day events | 0 occurrences post-release |

---

## 10. Open Questions

| # | Question | Owner | Impact if Unresolved |
|---|---|---|---|
| OQ-001 | Is the all-day flag provided directly by the backend as a dedicated boolean field, or must the display layer infer it from another signal (e.g., absence of time, a specific time value)? | Tech Lead / Backend | Determines BR-005 implementation approach; must be resolved before development begins |
| OQ-002 | Should the "All Day" indicator replace both start and end time display, or only the start time row? | Product Owner | Affects scope of change to the time row layout |

---

## 11. References

- **Issue**: ASDLC-528 — [Events Page] Display (All Day) Indicator Instead of Time on Event Detail Page  
- **Repository**: https://github.com/gouveiahenrique/onprem-api.git  
- **Related Area**: Events Page — Event Detail Page, time row component
