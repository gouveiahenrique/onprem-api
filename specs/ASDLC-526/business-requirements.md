# Business Requirements Specification

**Issue Key**: ASDLC-526
**Summary**: [Events Page] Display "All Day" Indicator Instead of Time on Event Detail Page
**Date**: 2026-09-27
**Status**: Draft

---

## 1. Executive Summary

When an event is designated as an all-day event, the Event Detail Page incorrectly displays a time value (e.g., "12:00 AM") in the time row, which is misleading and inaccurate. This specification defines the requirement to replace that misleading time display with a clearly communicated "All Day" indicator — presented as a visually distinct capsule/badge label — so that users immediately understand the event occupies the entire day with no specific start or end time.

---

## 2. Problem Statement

**Current State**: On the Event Detail Page, the time row always renders a clock-based time value. For all-day events, this manifests as "12:00 AM," which is a default placeholder value, not a meaningful time. Users reading this time value may incorrectly infer that the event starts or ends at midnight, or that they must be present at a specific time.

**Desired State**: When an event is marked as all-day, the time row must display an "All Day" label in place of any time value. This label must be visually distinct — styled as a capsule or badge — so that it is immediately recognizable as a category descriptor, not a clock-based time.

**Business Impact**:
- Users who rely on the Event Detail Page to plan attendance are currently misled about all-day events.
- Incorrect time display reduces trust in the events product and may cause scheduling confusion.
- Correcting this display improves the accuracy and reliability of event information presented to all users.

**Urgency**: The displayed information is factually wrong for a defined category of events (all-day events). This constitutes a content accuracy defect that affects every user who views an all-day event's detail page.

---

## 3. Personas & User Stories

### Persona 1: Event Attendee
**Role**: A user browsing events to plan their schedule.
**Goal**: Quickly understand whether an event requires presence at a specific time or spans the whole day.
**Pain Point**: Sees "12:00 AM" on an all-day event and is confused about whether attendance at midnight is required.

**User Story**: As an event attendee, when I open the detail page for an all-day event, I want to see a clear "All Day" indicator in the time row so that I immediately know no specific arrival time is required.

### Persona 2: Event Organizer
**Role**: A user who creates and publishes events, including all-day events.
**Goal**: Ensure that the event information they entered is presented accurately to attendees.
**Pain Point**: Marked an event as all-day, but attendees report seeing "12:00 AM" as the event time, undermining the accuracy of their posting.

**User Story**: As an event organizer, when I mark an event as all-day and it is viewed by attendees, I want the detail page to reflect the all-day nature of my event so that my event information is communicated accurately.

### Persona 3: Platform Administrator
**Role**: A user responsible for the accuracy and quality of content on the events platform.
**Goal**: Ensure event details are correct and do not mislead end users.
**Pain Point**: The platform surfaces inaccurate time information for a defined class of events, potentially eroding user confidence in the platform.

**User Story**: As a platform administrator, I want all-day events to display an "All Day" indicator on their detail pages so that the platform maintains accurate and trustworthy event information.

---

## 4. Business Rules

**BR-001**: An event that is designated as "all-day" must not display any clock-based start or end time in the time row of the Event Detail Page.

**BR-002**: When an event is designated as "all-day," the time row of the Event Detail Page must display the text "All Day" in place of any time value.

**BR-003**: The "All Day" indicator must be rendered as a visually distinct label (capsule or pill shape) to differentiate it from plain text and clock-based time values.

**BR-004**: The determination of whether an event is all-day is derived from the event's own data — an event is either all-day or it is not; there is no partial or ambiguous state.

**BR-005**: For events that are not designated as all-day, the time row must continue to display the event's start and/or end time exactly as it does today — this change must not alter the display behavior for timed events.

**BR-006**: The "All Day" indicator must be accessible to users of assistive technologies; its meaning must not rely solely on visual styling.

**BR-007**: The "All Day" indicator text must use consistent, unambiguous wording. The exact label is "All Day" (two words, title case). Abbreviations, alternate phrasings, and lowercase variants are not permitted.

---

## 5. Acceptance Criteria

```gherkin
Feature: Event Detail Page — All Day Indicator

  Background:
    Given the user is viewing the Event Detail Page for an event

  # --- Happy Path ---

  Scenario: All-day event displays "All Day" indicator in the time row
    Given the event is designated as an all-day event
    When the Event Detail Page loads
    Then the time row displays an "All Day" capsule/badge label
    And no clock-based time value (e.g., "12:00 AM") is visible in the time row

  Scenario: "All Day" label is visually distinct from plain text
    Given the event is designated as an all-day event
    When the Event Detail Page loads
    Then the "All Day" indicator is rendered in a capsule or pill shape
    And the indicator is visually distinguishable from surrounding text content

  # --- Non-All-Day Events (No Regression) ---

  Scenario: Timed event continues to display its start and end time
    Given the event is NOT designated as an all-day event
    And the event has a defined start time and end time
    When the Event Detail Page loads
    Then the time row displays the event's start time and end time
    And no "All Day" indicator is displayed in the time row

  # --- Accessibility ---

  Scenario: "All Day" indicator is accessible to assistive technology users
    Given the event is designated as an all-day event
    When the Event Detail Page loads
    Then the "All Day" indicator conveys its meaning in a way that assistive technologies (e.g., screen readers) can interpret
    And the indicator does not rely solely on visual styling to communicate its meaning

  # --- Edge Cases ---

  Scenario: All-day event with no additional time metadata still shows "All Day"
    Given the event is designated as an all-day event
    And the event has no explicit start time or end time stored
    When the Event Detail Page loads
    Then the time row displays the "All Day" indicator
    And no time value or empty time placeholder is shown

  Scenario: All-day event spanning multiple days shows "All Day" once per time row
    Given the event is designated as an all-day event
    And the event spans more than one calendar day
    When the Event Detail Page loads
    Then the time row displays the "All Day" indicator
    And the indicator does not repeat or produce duplicate labels within the same time row

  Scenario: Newly created all-day event immediately displays correct indicator
    Given a user has just created a new event and designated it as all-day
    When another user opens the Event Detail Page for that event
    Then the time row displays the "All Day" indicator
    And no clock-based time value is shown
```

---

## 6. Non-Functional Requirements

**Performance**:
- The "All Day" indicator must render within the same page load time as the existing time row. No additional data fetching or processing delay must be introduced by this change.

**Security**:
- No user-supplied data is introduced into the time row by this change. The indicator is a fixed system label and must not be user-configurable or injectable.

**Reliability**:
- The indicator must render correctly regardless of the device, screen size, or locale of the user. It must not disappear, truncate to an unreadable state, or produce an error state under normal operating conditions.

**Accessibility**:
- The "All Day" indicator must meet WCAG 2.1 AA contrast requirements so it is readable by users with visual impairments.
- The indicator must be perceivable by screen readers and other assistive technologies without additional user action.

**Internationalisation**:
- The scope of this requirement is limited to the English text "All Day." Any localization or translation of this label into other languages is explicitly out of scope for this issue (see Section 8).

**Maintainability**:
- The logic that determines whether to display the "All Day" indicator versus a clock-based time must be clearly separated from other display logic so that future changes to either path do not require modifying both.

**Observability**:
- No new logging, monitoring, or alerting is required for this display-layer change. Existing error logging must continue to capture any rendering failures on the Event Detail Page.

---

## 7. Edge Cases & Special Scenarios

| Scenario | Expected Behavior |
|---|---|
| All-day event with a stored midnight time (e.g., 12:00 AM as default) | Display "All Day" indicator; suppress the midnight time value entirely |
| All-day event spanning multiple days | Display "All Day" indicator once; do not show a time range |
| All-day event with no time data stored at all | Display "All Day" indicator; do not show an empty time field or placeholder |
| Timed event where start time equals midnight (12:00 AM legitimately) | Display "12:00 AM" as normal; do not show "All Day" indicator (not an all-day event) |
| Event whose all-day status is updated after initial creation | The next load of the Event Detail Page must reflect the current all-day status correctly |
| User navigates back to a previously viewed all-day event | The "All Day" indicator must be displayed consistently on every visit |
| All-day event viewed on a small or narrow screen | The "All Day" capsule must remain fully visible and readable; it must not be clipped or hidden |
| All-day event viewed in dark mode or high-contrast mode | The "All Day" indicator must remain visually distinct and meet contrast requirements |

---

## 8. Out of Scope

The following items are explicitly excluded from this requirement:

- **Localization / translation**: Translating the "All Day" label into languages other than English is not part of this issue.
- **Event creation or editing flows**: This requirement applies only to the Event Detail Page display. How all-day status is set, edited, or stored is not changed.
- **Calendar or list views**: Changes to how all-day events appear in calendar grid views, event list views, or any surface other than the Event Detail Page are not included.
- **Notification or reminder content**: How all-day events are described in push notifications, email reminders, or other communication channels is not changed.
- **Time zone handling**: Logic governing how event times are interpreted or converted across time zones is not affected by this change.
- **Recurring events**: Special handling for recurring all-day events beyond what applies to single all-day events is not in scope.
- **Backend data model changes**: No changes to how all-day event data is stored or retrieved are required or permitted by this issue.
- **Other detail page fields**: Only the time row is changed. Date, location, description, attendee, and organizer fields are unaffected.
- **Timed event display changes**: The display behavior of the time row for non-all-day events must remain exactly as it is today.

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| All-day events display "All Day" indicator (not a clock time) on Event Detail Page | 100% of all-day events |
| Timed events continue to display their clock-based time on Event Detail Page | 100% of timed events (no regression) |
| "All Day" indicator meets WCAG 2.1 AA contrast ratio | Pass on all supported themes (light, dark, high-contrast) |
| No user-reported confusion about all-day event times after release | Zero new reports of "12:00 AM" appearing on all-day events post-release |
| Event Detail Page load time unchanged from baseline | No measurable increase in render time attributable to this change |

---

## 10. References

- **Issue**: ASDLC-526 — [Events Page] Display "All Day" Indicator Instead of Time on Event Detail Page
- **Repository**: https://github.com/gouveiahenrique/onprem-api.git
- **Related Surface**: Event Detail Page — time row field
- **Affected Event Type**: All-day events only
- **WCAG Reference**: Web Content Accessibility Guidelines 2.1, Success Criterion 1.4.3 (Contrast — Minimum, Level AA)
