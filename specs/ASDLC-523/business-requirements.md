# Business Requirements Specification
## ASDLC-523: Display "All Day" Indicator Instead of Time on Event Detail Page

**Issue Key**: ASDLC-523  
**Date**: 2026-09-27  
**Status**: Draft  
**Complexity**: S (Small)

---

## 1. Executive Summary

When a calendar event is designated as "All Day," the Event Detail Page currently displays a misleading time value (e.g., 12:00 AM) in the time row. This creates confusion for users because all-day events have no specific start or end time. The system must replace the time value with a clearly identifiable "All Day" indicator — visually styled as a capsule/badge — to accurately communicate the nature of the event to users.

---

## 2. Problem Statement

**Current State**: On the Event Detail Page, the time row displays a clock-based time value (e.g., 12:00 AM) regardless of whether the event is a standard timed event or an all-day event. When an event is marked as All Day, this time value is a technical artifact with no real meaning, creating a misleading user experience.

**Desired State**: When an event is marked as All Day, the time row on the Event Detail Page must display an "All Day" indicator — styled as a visually distinct capsule/pill-shaped badge — in place of any time value. For timed (non-all-day) events, the existing time display behavior must remain unchanged.

**Business Impact**:
- **User confusion eliminated**: Users viewing all-day events will no longer see a meaningless time (12:00 AM), reducing ambiguity about event timing.
- **Accuracy and trust**: Displaying accurate event metadata builds user trust in the calendar feature.
- **Clarity of communication**: The visual capsule/badge format clearly distinguishes the all-day state from time-specific events at a glance.

**Urgency**: This is a data accuracy issue. Users are actively misled by the current display, which may cause scheduling mistakes or erode confidence in the calendar feature.

---

## 3. Personas & User Stories

### Primary Persona: Calendar Event Viewer
**Description**: Any user who opens an event on the Event Detail Page to review its details.  
**Goal**: Quickly understand when an event occurs and whether it spans the full day or a specific time window.  
**Pain Point**: Currently sees "12:00 AM" for all-day events, which implies a specific start time that does not exist.

**User Story**:
> As a calendar user viewing an all-day event, I want the event's time row to show "All Day" instead of a clock time, so that I immediately understand the event spans the entire day without a specific start or end time.

### Secondary Persona: Event Creator / Administrator
**Description**: A user who creates or edits calendar events and marks certain events as "All Day."  
**Goal**: Have the events they create displayed accurately to other viewers.  
**Pain Point**: The system does not honor the All Day designation in the visual display, undermining the intent of the setting.

---

## 4. Business Rules

**BR-001**: When an event is designated as All Day, the time row on the Event Detail Page must display an "All Day" indicator in place of any start or end time value.

**BR-002**: When an event is not designated as All Day (i.e., it is a timed event), the time row must continue to display the event's actual start and end times, exactly as it does today. No change in behavior for timed events.

**BR-003**: The "All Day" indicator must be visually styled as a capsule/pill-shaped badge to distinguish it from plain text and from the time format used by timed events.

**BR-004**: The "All Day" indicator must use the exact text "All Day" (with standard casing) as the label. No abbreviations or alternative phrasing.

**BR-005**: The All Day designation is determined by the event's data as provided by the backend system. The display layer must read and reflect this designation — it must not infer or compute All Day status from the time values themselves.

**BR-006**: The "All Day" badge must be accessible: the label "All Day" must be readable by assistive technologies (e.g., screen readers) and must not rely solely on color or shape to convey its meaning.

---

## 5. Acceptance Criteria

```gherkin
Feature: All Day Indicator on Event Detail Page

  Scenario: Viewing an All Day event displays the All Day badge
    Given a calendar event that is marked as All Day
    When a user opens the Event Detail Page for that event
    Then the time row displays an "All Day" badge
    And the badge is styled as a capsule/pill shape
    And no clock-based time value (e.g., 12:00 AM) is shown in the time row

  Scenario: Viewing a timed event displays the actual time
    Given a calendar event that is NOT marked as All Day
    And the event has a specific start time and end time
    When a user opens the Event Detail Page for that event
    Then the time row displays the event's actual start and end times
    And no "All Day" badge is shown

  Scenario: All Day badge text is accessible to assistive technologies
    Given a calendar event that is marked as All Day
    When a user opens the Event Detail Page for that event
    Then the "All Day" badge exposes the text "All Day" to screen readers
    And the badge does not rely solely on color or shape to convey its meaning

  Scenario: All Day designation is driven by event data, not time inference
    Given a calendar event that is marked as All Day
    And the event's stored time value happens to be 12:00 AM
    When a user opens the Event Detail Page for that event
    Then the time row displays the "All Day" badge
    And does not display 12:00 AM

  Scenario: Switching between All Day and timed event details
    Given a user is viewing an All Day event and sees the "All Day" badge
    When the user navigates to a different event that is a timed event
    Then the time row for the timed event shows the actual start and end times
    And no "All Day" badge appears for the timed event
```

---

## 6. Non-Functional Requirements

**Performance**:
- The conditional display of the "All Day" badge versus a time value must not introduce any perceptible delay in page rendering. The Event Detail Page load time must remain equivalent to the current baseline.

**Security**:
- No changes to authentication or authorization are required for this feature. Event access controls remain unchanged.

**Reliability**:
- If the All Day designation is absent or indeterminate from the event data, the system must fall back to displaying the available time value rather than crashing or showing a blank time row.

**Accessibility**:
- The "All Day" badge must meet the project's minimum accessibility standard for text contrast and screen reader support.

**Maintainability**:
- The distinction between All Day and timed event display must be driven by a single, clearly identifiable condition in the display logic, so future changes to the indicator's style or label can be made in one place.

**Observability**:
- No additional logging or monitoring is required for this display change beyond what already exists for the Event Detail Page.

---

## 7. Edge Cases & Special Scenarios

**Edge Case EC-001 — All Day event with no time data at all**:  
If an All Day event has no time value stored at all (null/absent), the time row must still display the "All Day" badge. The absence of a time value must not cause the time row to be hidden or to show an error.

**Edge Case EC-002 — All Day event with a non-midnight time stored**:  
If an All Day event's underlying data contains a time value that is not 12:00 AM (e.g., due to a data migration or legacy entry), the All Day designation must take precedence. The "All Day" badge must still be displayed; the stored time value must not be shown.

**Edge Case EC-003 — Timed event with a start time of 12:00 AM**:  
If a timed (non-all-day) event genuinely starts at 12:00 AM, the time row must display "12:00 AM" as the actual time. The system must not confuse this with an All Day event.

**Edge Case EC-004 — Event data loads slowly or fails**:  
If the event data (including the All Day designation) fails to load, the Event Detail Page must handle this gracefully. The time row must not display misleading information. The fallback must follow existing error-handling behavior for the page.

**Edge Case EC-005 — Localization/Internationalization**:  
If the application is used in locales where "All Day" may need translation, the badge text must be sourced from the localization system rather than hard-coded as a string. If no localization system is in place, the English label "All Day" is the required default, and internationalization is out of scope for this issue.

---

## 8. Out of Scope

The following are explicitly NOT part of this requirement:

- **Editing the All Day designation**: This requirement covers display only. Changing, toggling, or setting the All Day flag on an event is not in scope.
- **Event List / Calendar Grid views**: The "All Day" badge change applies to the Event Detail Page only. Any other views (e.g., monthly calendar grid, event list) are not in scope unless separately specified.
- **Changes to event creation or editing flows**: No changes to how events are created or edited are required.
- **Backend or data changes**: The All Day designation is already captured in event data. No changes to data storage, APIs, or backend logic are in scope.
- **Notification or reminder behavior**: How notifications handle all-day events is not in scope.
- **Localization/translation of the "All Day" label** (unless a localization system is already in place — see EC-005): The English label is sufficient for this issue.
- **Design system changes**: This feature requires a visually styled badge, but changes to the shared design system library (if one exists) are not in scope unless the badge component does not yet exist.

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| All-day events display "All Day" badge on Event Detail Page | 100% of all-day events |
| Timed events continue to show their actual times | 100% of timed events |
| Zero regression in Event Detail Page load time | No measurable increase |
| Accessibility: "All Day" text readable by screen readers | 100% compliance |
| User confusion reports related to "12:00 AM" on all-day events | Reduced to zero post-release |

---

## 10. References

- **Issue**: ASDLC-523 — [Events Page] Display (All Day) Indicator Instead of Time on Event Detail Page
- **Repository**: https://github.com/gouveiahenrique/onprem-api
- **Related Context**: Event Detail Page; calendar all-day event handling
