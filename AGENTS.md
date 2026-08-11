# handai-campus-bus agent guide

## Product goal
Build a fast, calm timetable search web app for Osaka University inter-campus buses between Toyonaka, Minoh, and Suita. The primary action is finding the best bus for a requested departure or arrival time, including round-trip searches.

## Source of truth
- Official 2026 timetable: `src/data/2026/timetable.json`
- Official 2026 service calendar: `src/data/2026/calendar.json`
- Search/domain logic: `src/domain/`
- Product composition: `src/components/` and `src/app/`

Do not silently change timetable values. Any data change must cite the official Osaka University source in the PR description and update tests.

## Design direction
The initial UI is derived from the attached Haru UI reference: restrained surfaces, thin borders, compact controls, neutral typography, and limited accent color. Keep new UI consistent with `src/app/product.css`; avoid decorative gradients, excessive cards, or oversized headings.

## Quality gate
Run:

```bash
npm run check
```

At minimum preserve:
- 79 official trips (40 outbound / 39 return)
- service-day exclusions and Japanese holidays for the 2026 academic timetable
- departure, arrive-by, direct-priority, and round-trip behavior
- accessible labels and keyboard operation
