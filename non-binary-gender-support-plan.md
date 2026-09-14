# Add Non-binary Gender Support

## Summary

Extend importing and leaderboard functionality to support non-binary riders using the `NB` code and the display label `Non-binary`, while preserving existing `M`/`W` behavior.

## Implementation Changes

- Update the riders schema constraint to allow `NB`.
- Update `bumps_import_db.py` to import the `NB` series alongside `M` and `W`, using the upstream `B{year}_NB` series identifier.
- Extend all ranking/materialized views to:
  - Generate `Non-binary` category labels.
  - Partition rankings by `NB`.
  - Include non-binary overall and age-group leaders.
- Add `Overall Non-binary` and all age-group `Non-binary` categories to shared frontend constants.
- Replace binary gender inference in leaderboard and race-result APIs with explicit category-to-code mapping so non-binary selections do not fall back to women.
- Add non-binary categories to:
  - Season leaderboard filters.
  - Race leaderboard filters.
  - Homepage category links.
  - Podium/category leader displays.
- Keep event course-record cards limited to Men’s and Women’s records; the all-leaderboard scope does not add a third course-record card.

## Tests and Verification

- Verify importer trial output for `M`, `W`, and `NB`, including the generated upstream URL and stored gender value.
- Verify database/view output for:
  - Overall non-binary rankings.
  - Each non-binary age category.
  - Correct independent rank and total calculations.
- Verify leaderboard and race-result API requests for `Overall Non-binary` and age-specific non-binary categories.
- Run the existing parser test, ESLint, and a production build.
- Confirm existing male and female category URLs and results remain unchanged.

## Assumptions

- `NB` is the upstream and database gender code.
- The user-facing label is `Non-binary`.
- Existing historical data is not backfilled unless the importer is explicitly run for those years.
- The configured importer year list remains authoritative; adding `NB` means it runs for every configured year.
