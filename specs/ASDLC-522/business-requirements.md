# Business Requirements: Display "All Day" Indicator on Event Detail Page

**Issue Key**: ASDLC-522  
**Summary**: [Events Page] Display (All Day) Indicator Instead of Time on Event Detail Page  
**Date**: 2026-09-27  
**Status**: Draft  
**Complexity**: S (Small)

---

## 1. Executive Summary

When a calendar event is designated as an All Day event, the Event Detail Page currently misleads users by displaying a specific time value (e.g., "12:00 AM") in the time row. Users must instead see a clearly labeled "All Day" indicator — displayed as a visually distinct capsule or badge — in place of any time value, so that the display accurately reflects the nature of the event.

---

## 2. Problem Statement

### Current State

The Event Detail Page renders a time row for every event. When the event is marked as All Day, the system has no specific start or end time applicable, yet the time row still displays a placeholder time of 12:00 AM. This is factually incorrect and confusing to users.

### Desired State

When an event is designated as All Day, the time row on the Event Detail Page must display an "All Day" indicator (styled as a capsule or pill-shaped badge) instead of any time value. Events with explicit start and end times continue to display those times normally.

### Business Impact

- **Users** are misled into thinking an All Day event starts at 12:00 AM, potentially causing scheduling confusion.
- **Trust** in the calendar feature is undermined when users see obviously incorrect data.
- **Clarity** is restored by surfacing the actual nature of the event directly on its detail page.

### Urgency

The current behavior is a display defect — an event property (All Day) is being misrepresented. There is no cost-justified reason to delay correction.

---

## 3. Personas & User Stories

### Primary Persona: Event Viewer

A user who navigates to the Event Detail Page to understand the schedule, location, and timing of a calendar event.

**User Story**:  
*As an event viewer, when I open an All Day event, I want to immediately see "All Day" instead of a meaningless time value, so that I understand the event spans the whole day and I do not misread my schedule.*

### Secondary Persona: Event Creator / Editor

A user who created or edited an event and marked it as All Day, expecting the detail view to faithfully reflect that designation.

**User Story**:  
*As an event creator, when I mark an event as All Day and then view its detail page, I want to confirm that the All Day designation is shown correctly, so that I can trust the system preserved my intent.*

---

## 4. Business Rules

**BR-001**: When an event is designated as All Day, the time row on the Event Detail Page must display an "All Day" indicator and must not display any time value.

**BR-002**: When an event is NOT designated as All Day, the time row must display the event's start time and end time in the existing manner; the "All Day" indicator must not appear.

**BR-003**: The "All Day" indicator must be visually distinct from plain text — it must be rendered as a capsule or pill-shaped label to differentiate it from a standard time display.

**BR-004**: The All Day designation is determined by a field supplied by the backend data source for the event. The client must use the value as provided; it must not infer or compute All Day status from the time values.

**BR-005**: The "All Day" indicator must be accessible — it must convey the same meaning to users relying on assistive technologies (e.g., screen readers) as it does visually.

**BR-006**: The "All Day" label text must be presented in a language consistent with the rest of the Event Detail Page (i.e., it must respect any localization applied to the page).

---

## 5. Acceptance Criteria

```gherkin
Feature: All Day Indicator on Event Detail Page

  Background:
    Given the user navigates to the Event Detail Page

  Scenario: All Day event displays the All Day indicator
    Given an event that is designated as All Day
    When the user views the Event Detail Page for that event
    Then the time row displays an "All Day" capsule indicator
    And the time row does not display any time value (e.g., "12:00 AM")

  Scenario: Timed event displays start and end times
    Given an event that has an explicit start time and end time
    And the event is not designated as All Day
    When the user views the Event Detail Page for that event
    Then the time row displays the event's start time and end time
    And the "All Day" capsule indicator is not displayed

  Scenario: All Day indicator is visually distinct
    Given an event that is designated as All Day
    When the user views the Event Detail Page for that event
    Then the "All Day" label is rendered inside a capsule or pill-shaped visual container
    And the capsule is visually distinguishable from plain body text on the page

  Scenario: All Day indicator is accessible
    Given an event that is designated as All Day
    When a user relying on a screen reader navigates to the Event Detail Page
    Then the screen reader announces "All Day" in the time row
    And the screen reader does not announce any time value for that row

  Scenario: All Day indicator respects page localization
    Given the Event Detail Page is displayed in a non-English language
    And an event that is designated as All Day
    When the user views the Event Detail Page for that event
    Then the "All Day" indicator text is displayed in the same language as the rest of the page

  Scenario: Backend provides All Day designation
    Given the backend data for an event explicitly designates it as All Day
    When the client receives that data and renders the Event Detail Page
    Then the client uses the backend-provided All Day value to determine the indicator
    And the client does not infer All Day status from the time value (e.g., midnight)
```

---

## 6. Non-Functional Requirements

### Performance
- The display change must not introduce any additional network requests or data-loading delays; the All Day designation is part of the existing event data payload.

### Security
- No authentication or authorization changes are required for this feature.
- No new user data is collected or exposed.

### Scalability
- The indicator renders based on a single boolean field per event; there are no scalability concerns.

### Reliability
- If the All Day field is absent or null in the event data, the system must treat the event as timed and display time values, not the indicator. The absence of the field must not cause a rendering error.

### Maintainability
- The All Day indicator must be implemented as a reusable label component so it can be applied consistently across other views that may display All Day events in the future.

### Observability
- No specific logging or alerting requirements beyond standard client-side error tracking already in place.

### Accessibility
- The indicator must meet the project's existing accessibility standards (equivalent to WCAG 2.1 AA minimum), including sufficient color contrast for the capsule and a meaningful text label for screen readers.

---

## 7. Edge Cases & Special Scenarios

| Scenario | Expected Behavior |
|---|---|
| All Day field is absent from event data | Treat as timed event; display time values; do not show "All Day" indicator; no error thrown |
| All Day field is null | Same as absent: treat as timed event |
| All Day field is `false` | Treat as timed event; display time values |
| All Day field is `true` but time values are also present in data | Display "All Day" indicator; suppress time values; BR-001 takes precedence |
| Event transitions from All Day to timed (edited) | After the update is reflected in the data, the time row must switch from the indicator to displaying the new time values |
| Event transitions from timed to All Day (edited) | After the update is reflected in the data, the time row must switch from time values to the "All Day" indicator |
| Very long translated "All Day" string (localization) | Capsule must accommodate the translated string without clipping or layout breakage |

---

## 8. Out of Scope

The following items are explicitly NOT included in this requirement:

- Changes to how All Day events are created or edited (only the display on the detail page is in scope).
- Adding the "All Day" indicator to calendar list views, calendar grid views, or any page other than the Event Detail Page.
- Changes to how events are stored in any data source.
- Changes to the backend API contract or data shape — the All Day designation is assumed to already be available in the event data returned to the client.
- Any logic to determine whether an event "should be" All Day based on its time values — the designation comes from the data source only (BR-004).
- Push notifications or reminder behavior related to All Day events.
- Timezone handling for All Day events.

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| All Day events display the indicator instead of a time value | 100% of All Day events on the Event Detail Page |
| Timed events continue to display time values without regression | 100% of timed events unaffected |
| No accessibility violations introduced | Zero new WCAG 2.1 AA violations in the time row area |
| User-reported confusion about "12:00 AM" on All Day events | Reduced to zero post-release |

---

## 10. Open Questions

The following questions were not answered by the issue description. They must be resolved before or during technical implementation:

1. **Field contract**: What is the exact name and data type of the All Day designation field in the event data payload, and is it guaranteed to be present on all event records?
2. **Localization coverage**: Which languages does the application currently support, and is there an existing localization mechanism the "All Day" string must be routed through?
3. **Design token / style guide**: Does the project have an established design system that defines the visual spec for capsule/pill labels (color, border radius, typography, padding)? If so, the All Day indicator must conform to it.
4. **Existing shared label component**: Is there already a reusable badge or pill component in the codebase that should be reused here, or must a new one be created?

---

## 11. References

- **Issue**: ASDLC-522 — [Events Page] Display (All Day) Indicator Instead of Time on Event Detail Page
- **Repository**: https://github.com/gouveiahenrique/onprem-api.git
- **Related**: Event Detail Page feature; calendar event data model
