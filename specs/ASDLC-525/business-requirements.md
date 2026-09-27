# Business Requirements Specification

**Issue Key**: ASDLC-525  
**Title**: Display "All Day" Indicator Instead of Time on Event Detail Page  
**Date**: 2026-09-27  
**Complexity**: S (Small)

---

## 1. Executive Summary

When an event is configured as an all-day event, the Event Detail Page incorrectly displays a time value (e.g., 12:00 AM) in the time row. This is misleading because all-day events have no meaningful start or end time. The system must instead display a clearly labeled "All Day" indicator — formatted as a capsule/pill-shaped badge — so users immediately understand the event spans the full day.

---

## 2. Problem Statement

**Current State**: The Event Detail Page always renders a clock-style time value in the time row, even when the event is flagged as all-day. The displayed value (e.g., 12:00 AM) is a placeholder artifact with no real meaning for all-day events, creating confusion for users.

**Desired State**: When an event is an all-day event, the time row must display an "All Day" indicator (styled as a capsule/pill badge) in place of any time value. When an event is a timed event, behavior remains unchanged and the actual start and end times continue to display as before.

**Business Impact**: Users who manage calendars and events rely on the Event Detail Page to confirm event details at a glance. Seeing a spurious "12:00 AM" time on an all-day event undermines trust in the data shown and forces users to second-guess whether the event was configured correctly. Fixing this improves clarity, reduces support confusion, and aligns the display with user expectations for any standard calendar experience.

**Urgency**: The current display is actively misleading. There is no valid business scenario in which an all-day event should display a clock time, so this is a correctness fix with immediate user-facing impact.

---

## 3. Personas & User Stories

### Persona 1: Event Viewer
A user who opens the Event Detail Page to review the details of a specific event — confirming date, time, location, and other relevant fields before acting on or sharing that information.

**User Story**:  
> As an event viewer, when I open the detail page for an all-day event, I want the time row to clearly say "All Day" so that I know no specific time applies and I am not confused by a meaningless clock value.

### Persona 2: Event Organizer / Administrator
A user who creates and manages events. They rely on the detail view to confirm that the event settings they chose are reflected accurately in the displayed output.

**User Story**:  
> As an event organizer, when I mark an event as all-day and then review it on the detail page, I want to see "All Day" displayed in the time row so I can confirm the all-day setting was saved and is being communicated correctly.

---

## 4. Business Rules

**BR-001**: When an event is flagged as an all-day event, the time row on the Event Detail Page must display an "All Day" indicator in place of any time value. No start time or end time value must appear for all-day events.

**BR-002**: When an event is NOT an all-day event (i.e., it has explicit start and end times), the time row must display the actual start and end times. The existing behavior for timed events must remain unchanged.

**BR-003**: The "All Day" indicator must be visually distinct from plain text — it must be rendered as a capsule/pill-shaped badge or label, clearly communicating that this is a special event attribute, not a piece of time data.

**BR-004**: The all-day flag is determined by the event data provided by the system. The display layer must read this flag and branch its rendering accordingly; it must not infer all-day status from the presence of a midnight time value.

**BR-005**: The "All Day" label text must be human-readable and unambiguous. The label must read "All Day" (capitalized, two words). Abbreviations such as "AD" or "allday" are not acceptable.

---

## 5. Acceptance Criteria

```gherkin
Feature: Display All Day Indicator on Event Detail Page

  Scenario: All-day event shows "All Day" badge in time row
    Given a user views the Event Detail Page for an event marked as all-day
    When the time row is rendered
    Then the time row displays an "All Day" capsule/pill-shaped badge
    And no clock time value (e.g., "12:00 AM") is visible in the time row

  Scenario: Timed event continues to show actual start and end times
    Given a user views the Event Detail Page for an event that has explicit start and end times
    And the event is NOT marked as all-day
    When the time row is rendered
    Then the time row displays the event's actual start time
    And the time row displays the event's actual end time
    And no "All Day" badge is shown

  Scenario: "All Day" indicator is visually presented as a capsule/pill badge
    Given a user views the Event Detail Page for an all-day event
    When the time row is rendered
    Then the "All Day" indicator appears styled as a capsule or pill-shaped label
    And the label reads exactly "All Day"

  Scenario: All-day flag is authoritative — midnight time does not trigger the indicator
    Given an event that is NOT flagged as all-day
    But whose start time happens to be 12:00 AM
    When the user views the Event Detail Page
    Then the time row displays the start time (12:00 AM) as a normal time value
    And the "All Day" badge is NOT shown

  Scenario: All-day event does not show any time value alongside the badge
    Given a user views the Event Detail Page for an all-day event
    When the time row is rendered
    Then the time row contains only the "All Day" badge
    And no additional time text or clock value appears in the same row
```

---

## 6. Non-Functional Requirements

**Performance**: The rendering change must not introduce any additional data fetches or processing delays. The all-day determination must be made from data already present on the Event Detail Page.

**Accessibility**: The "All Day" badge must be accessible to assistive technologies. Screen readers must be able to read "All Day" as the value of the time row when the event is an all-day event.

**Visual Consistency**: The capsule/pill badge style must be consistent with any existing badge or tag components used elsewhere in the application to ensure a coherent visual experience.

**Maintainability**: The branching logic (all-day vs. timed) must be isolated to the time row display so that changes to either case in the future are straightforward and localized.

**Observability**: No specific logging or monitoring is required for this display change, as it is a pure presentation fix with no side effects on data or state.

---

## 7. Edge Cases & Special Scenarios

**EC-001 — Event data missing the all-day flag**: If the event record does not include an all-day flag (e.g., the field is absent or null), the system must treat it as a timed event and display times as usual. The "All Day" badge must not appear when the flag is absent or null.

**EC-002 — All-day event with no time fields at all**: If an all-day event record contains no start or end time fields whatsoever, the time row must still display the "All Day" badge and must not display empty or broken time values.

**EC-003 — All-day event data coming from an external calendar source**: The all-day determination relies solely on the all-day flag provided in the event data. If an external source marks an event as all-day, the same display rule applies — the badge must appear.

**EC-004 — Time row layout with badge vs. time values**: The badge must not break the layout of the time row. Whether the row previously displayed one time value or a range (start–end), the badge must replace that content cleanly without overflow or clipping.

---

## 8. Out of Scope

- Changes to how all-day events are **created** or **edited** — this specification covers display only.
- Changes to **list views**, **calendar grid views**, or any view other than the Event Detail Page.
- Changes to **event types** other than the all-day flag (e.g., recurring events, multi-day events that are not flagged as all-day).
- Any **back-end or data model** changes — the all-day flag is assumed to already exist in the event data.
- **Localization or internationalization** of the "All Day" label — this is out of scope for this iteration.
- Any changes to the **styling or behavior of timed events** beyond preserving existing behavior.
- Introducing **new badge components** for other event attributes — only the all-day indicator is in scope.

---

## 9. Success Metrics

- **Correctness**: 100% of all-day events display the "All Day" badge in the time row; 0% display a clock time value.
- **No Regression**: 100% of timed events continue to display their correct start and end times with no "All Day" badge.
- **Visual Compliance**: The badge renders as a capsule/pill shape and reads "All Day" in all supported environments/browsers.
- **Accessibility**: The "All Day" text is readable by screen readers when the badge is focused or traversed.

---

## 10. References

- **Issue**: ASDLC-525 — Display "All Day" Indicator Instead of Time on Event Detail Page  
- **Repository**: https://github.com/gouveiahenrique/onprem-api  
- **Related Context**: Standard calendar UX convention — all-day events suppress time display in favor of a clear "All Day" label (e.g., Google Calendar, Apple Calendar, Outlook).
