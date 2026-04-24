# Almi Job Finder Worldwide Expansion Plan

## What the spreadsheet gives us

- 200 countries covered
- 596 source rows
- strong global repeated sources:
  - LinkedIn Jobs
  - Indeed
  - Jooble
- many country-specific local boards

This means the sheet is best used as a **worldwide source directory and rollout map**, not as a simple static list.

## Best product direction

Build Job Finder as a 3-layer system:

1. Live provider API layer
- real provider-backed search results
- current and future APIs like:
  - RemoteOK
  - Remotive
  - Adzuna
  - Jooble
  - more regional APIs later

2. Worldwide source intelligence layer
- use the spreadsheet as a structured source catalog
- for each country, store:
  - top recommended job websites
  - source category
  - source quality
  - local-vs-global coverage
  - whether API exists
  - whether manual/company posting should be emphasized

3. Direct employer vacancy layer
- companies can create accounts
- post vacancies directly into Almi Job Finder
- this gives us:
  - real local inventory
  - stronger worldwide coverage
  - better quality control
  - monetization later

## Why this is better

No single provider gives true worldwide strength.

To make Job Finder genuinely useful across Iceland, Denmark, Pakistan, MENA, Africa, and beyond, we need:

- multiple live providers
- source-aware country logic
- direct company postings

That creates a better app than just relying on one API.

## Recommended product architecture

### A. Job seeker side

- search jobs by:
  - title
  - keyword
  - country
  - region
  - city
  - remote
- rank by:
  - title relevance
  - location relevance
  - resume fit
  - source trust
- show:
  - provider/source
  - location confidence
  - match quality
  - live/local/remote classification

### B. Source discovery side

New panel on country searches:

- "Top job websites for this country"
- if live inventory is thin, show:
  - local job portals from the spreadsheet
  - trusted external source links

Example:
- Search: Nurse / Iceland
- If live API results are thin:
  - show Jooble/Indeed/LinkedIn + Iceland-specific sites if available
  - label them as trusted external sources

This makes the app useful even when API coverage is incomplete.

### C. Employer / company panel

New company-facing area:

- company signup / login
- company profile
- create vacancy
- manage vacancies
- mark roles active/closed
- choose:
  - country
  - city
  - remote status
  - salary
  - job type
  - application URL or internal apply flow

This gives Almiworld-owned real inventory.

## Best next features

### 0. Guided role and skill search

Add a job-seeker guidance layer before search runs:

- desired job dropdown with common role paths
- skill dropdown with role-based suggestions
- skill suggestions pulled from live openings when available
- stronger CV-to-role comparison using chosen role + skills

Why this matters:

- speeds up first search for real users
- reduces weak wording like `nurs` or `cheff`
- helps users choose the same role language companies advertise
- improves fit scoring because the search intent is cleaner

### 1. Worldwide source directory in the app

Add database-backed country source records:

- region
- country
- website name
- url
- category
- notes
- source priority
- hasApi
- isAggregator
- isEmployerBoard
- isTrusted

Use cases:
- internal coverage planning
- user-facing "trusted sources for this country"
- future admin management

### 2. Employer vacancy posting

Add:

- Company
- CompanyUser
- Vacancy
- VacancyLocation

This is the strongest long-term coverage upgrade.

### 3. Search quality tiers

For each result set show:

- local live matches
- remote live matches
- employer-posted matches
- trusted external websites for this country

This makes search honest and useful.

### 4. Country-aware fallback strategy

Instead of fake jobs:

- first try live providers
- if live results are thin:
  - show employer-posted jobs
- if still thin:
  - show trusted country job websites

This is honest and much more useful than mock jobs.

## Suggested database additions

### Source directory

- JobSourceDirectory
  - id
  - region
  - country
  - website
  - url
  - category
  - notes
  - sourcePriority
  - hasApi
  - isAggregator
  - isEmployerBoard
  - isTrusted
  - active

### Company side

- Company
  - id
  - name
  - slug
  - website
  - logoUrl
  - description
  - country
  - city
  - verified
  - createdAt

- CompanyUser
  - id
  - companyId
  - userId
  - role

- Vacancy
  - id
  - companyId
  - title
  - description
  - country
  - state
  - city
  - remoteMode
  - employmentType
  - salaryMin
  - salaryMax
  - applyUrl
  - status
  - createdAt
  - updatedAt

## Best rollout order

### Phase 1
- import spreadsheet into database
- add admin/source directory model
- add "trusted job websites for this country" panel

### Phase 2
- add employer/company panel
- direct vacancy posting
- show employer-posted jobs in search

### Phase 3
- add more live providers
- country-aware source weighting
- source quality scoring

## What I recommend right now

Best next move for Job Finder:

1. Import your spreadsheet into a real database table
2. Use it to power country-specific source recommendations
3. Expand the guided role/skill picker so it reflects live employer demand
4. Build a company vacancy panel
5. Continue adding more real providers

That gives us:

- better worldwide usefulness
- honest search behavior
- stronger local coverage
- future traffic and monetization potential

## Long-term traffic opportunity

This can become much bigger than a plain search app if we also add:

- country landing pages
  - jobs in Pakistan
  - jobs in Iceland
  - jobs in Denmark
- category landing pages
  - nursing jobs
  - sales jobs
  - remote jobs
- company hiring pages
- trusted source pages by country

That creates search-engine traffic and makes Almiworld a real worldwide jobs property.
