# Business Requirements Specification

**Issue Key**: ASDLC-524  
**Summary**: [Events Page] Display "All Day" Indicator Instead of Time on Event Detail Page  
**Date**: 2026-09-27  
**Complexity**: S (Small)

---

## 1. Executive Summary

When a user views an event marked as "All Day" on the Event Detail Page, the time row currently displays a misleading time value (e.g., 12:00 AM). This must be corrected so that all-day events clearly communicate their nature by showing an "All Day" indicator — styled as a capsule or badge — in place of the time value. This eliminates user confusion and accurately represents the event's time properties.

---

## 2. Problem Statement

**Current State**: The Event Detail Page always shows a time value in the time row (e.g., "12:00 AM"), even when the event is designated as an all-day event. This time value is not meaningful for all-day events and misleads users into thinking a specific time applies.

**Desired State**: When an event is an all-day event, the time row must display an "All Day" indicator (styled as a capsule/pill-shaped label/badge) instead of any time value.

**Business Impact**:
- Users are currently misled by an inaccurate time display on all-day events, reducing trust in event information accuracy.
- Correcting this improves the reliability and clarity of event information for all event consumers.

**Urgency**: This is a data accuracy issue. Displaying incorrect or meaningless time values on all-day events degrades user trust. The fix is small in scope, and delaying it continues to surface misleading information to every user who views an all-day event detail.

---

## 3. Personas & User Stories

### Persona 1: Event Attendee
- **Role**: A person who views event details to understand when and how to participate.
- **Pain Point**: Sees "12:00 AM" on an all-day event and is confused about whether there is a specific meeting time.
- **Goal**: Quickly understand whether an event has a set time or spans the full day.

**User Story**:  
> As an event attendee, when I open the detail page for an all-day event, I want to see a clear "All Day" label instead of a time value, so that I immediately understand the event has no specific start or end time.

### Persona 2: Event Organizer
- **Role**: A person who creates events and needs attendees to receive accurate scheduling information.
- **Pain Point**: Organizes an all-day event but attendees contact them asking about the "12:00 AM" time shown.
- **Goal**: Ensure the event display accurately reflects the event type they configured.

**User Story**:  
> As an event organizer, when attendees view my all-day event, I want the time row to display "All Day" rather than a time, so that my event is communicated accurately without requiring clarification.

---

## 4. Business Rules

**BR-001**: When an event is marked as an all-day event, the time row on the Event Detail Page must display an "All Day" indicator and must not display any time value (e.g., hours, minutes, AM/PM).

**BR-002**: The "All Day" indicator must be visually distinguished from regular time values. It must be rendered as a capsule or pill-shaped label/badge, not as plain text.

**BR-003**: For events that are NOT marked as all-day, the time row must continue to display the event's start and end times exactly as it does today. No change in behavior for timed events.

**BR-004**: The determination of whether an event is all-day must rely entirely on the event's existing all-day designation as provided by the system — no user interaction on the Event Detail Page is required to make this determination.

**BR-005**: The "All Day" indicator must be accessible — it must be perceivable as a label by assistive technologies, not merely as a decorative visual element.

---

## 5. Acceptance Criteria

```gherkin
Feature: All Day Indicator on Event Detail Page

  Background:
    Given the user has access to the Events section of the application

  Scenario: All-day event displays "All Day" indicator in the time row
    Given an event exists that is marked as an all-day event
    When the user opens the Event Detail Page for that event
    Then the time row displays an "All Day" indicator styled as a capsule or pill-shaped badge
    And the time row does not display any time value (e.g., "12:00 AM", hours, minutes, or AM/PM notation)

  Scenario: Timed event continues to display start and end times
    Given an event exists that is NOT marked as an all-day event and has a specific start and end time
    When the user opens the Event Detail Page for that event
    Then the time row displays the event's start and end times
    And no "All Day" indicator is shown

  Scenario: All Day indicator is visually distinct
    Given an event marked as all-day is displayed on the Event Detail Page
    When the user views the time row
    Then the "All Day" text is rendered inside a capsule or pill-shaped visual container
    And the indicator is visually distinguishable from plain text time values

  Scenario: All Day indicator is accessible to assistive technologies
    Given an event marked as all-day is displayed on the Event Detail Page
    When the user navigates to the time row using assistive technology
    Then the "All Day" label is announced or perceivable as a text label
    And it is not treated as a decorative or non-descriptive element

  Scenario: Switching from timed event to all-day event on the detail page
    Given a user is viewing the Event Detail Page for an event
    When the event's all-day status is changed to all-day (if editing is supported on this page)
    Then the time row immediately reflects the "All Day" indicator in place of any time value
```

---

## 6. Non-Functional Requirements

**Performance**:
- The "All Day" indicator must appear at the same time as all other event details load. It must not introduce any additional data-fetching delay.

**Security**:
- No new data access or permissions are required. The all-day status is already part of the existing event data the system provides to this page.

**Scalability**:
- The change applies uniformly to all events in the system with all-day designation. No volume constraints beyond existing system capacity.

**Reliability**:
- If the all-day status of an event cannot be determined (e.g., due to a data error), the system must default to displaying whatever time information is available rather than showing a blank time row. An "All Day" indicator must only appear when the all-day designation is explicitly confirmed.

**Observability**:
- No new logging or monitoring requirements specific to this change. Existing event detail page error logging applies.

**Maintainability**:
- The "All Day" indicator must be implemented in a way that is reusable if similar event status indicators are needed elsewhere in the product (e.g., recurring, multi-day events). The design of the capsule/badge must be consistent with other badge or label patterns already present in the product's visual design.

---

## 7. Edge Cases & Special Scenarios

**EC-001 — All-day event with no time data at all**: If the event has no start or end time stored (not just 12:00 AM as a placeholder), the "All Day" indicator must still be displayed as long as the event is designated as all-day.

**EC-002 — All-day event spanning multiple days**: If an event is marked as all-day and spans more than one calendar day, the time row must still show "All Day" — not a date range with times. Date range display (if any) is handled by the date row, not the time row.

**EC-003 — Event with ambiguous all-day status**: If the event data does not clearly indicate whether an event is all-day (e.g., the flag is absent or null), the system must not display the "All Day" indicator. It must fall back to displaying available time data or leave the time row empty, whichever is the current fallback behavior.

**EC-004 — Localization/internationalization**: The "All Day" label must support localization. If the application is displayed in a language other than English, the label must appear in the appropriate translated string rather than the hardcoded English text.

**EC-005 — Dark mode / theme variants**: The "All Day" capsule/badge must be visually correct (legible, contrast-compliant) in all supported display themes, including dark mode if the application supports it.

---

## 8. Out of Scope

The following are explicitly NOT part of this requirement:

- Changing how all-day events appear on the Events List Page, Calendar View, or any page other than the Event Detail Page.
- Adding the ability for users to toggle the all-day status from the Event Detail Page (this is a display-only change).
- Changing how start and end dates are displayed for all-day events — only the time row is affected.
- Any modification to how events are created or edited in event creation flows.
- Adding new event status indicators (e.g., "Recurring", "Multi-day") beyond the "All Day" indicator described here.
- Backend or data-layer changes to how the all-day designation is stored or computed.

---

## 9. Success Metrics

1. **Zero time values displayed for all-day events**: After implementation, 0% of all-day event detail pages show a time value (e.g., "12:00 AM") in the time row.
2. **100% of all-day events show the indicator**: All events with the all-day designation display the capsule/badge "All Day" indicator in the time row.
3. **No regression for timed events**: 100% of timed (non-all-day) events continue to display correct time values in the time row.
4. **Accessibility compliance**: The "All Day" indicator passes screen reader and accessibility audits with a perceivable, labeled role.
5. **Visual consistency**: The capsule/badge style is consistent with existing label/badge patterns in the product's design system, confirmed by design review.

---

## 10. References

- **Related Issue**: ASDLC-524 (original and clone)
- **Affected Surface**: Event Detail Page — time row display logic
- **Repository**: https://github.com/gouveiahenrique/onprem-api.git
- **Design Guidance**: The "All Day" indicator is suggested as a capsule or pill-shaped label/badge, consistent with how similar status indicators appear in mobile and web event UI patterns.
