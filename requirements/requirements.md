# UK DMO website prototypes — requirements

Derived from the phase 1 opportunities review (1 October 2026). Each requirement names the idea numbers it comes from. Every section of every page carries an HTML comment with its R-number.

Standards in scope throughout: WCAG 2.2 AA and the Public Sector Bodies Accessibility Regulations 2018, the GOV.UK Service Standard, GOV.UK Design System patterns, GDS guidance on publishing HTML before PDF, Open Standards, and the GOV.UK style guide.

## Global

- **R01** Prototype navigator in place of the DMO header: overview link, numbered links to the five prototypes, Notes switch (off by default, remembered for the session). Previous/next pager in place of the footer.
- **R02** GOV.UK interaction patterns: underlined links, a thick visible focus state, error summary with links to fields, field-level error messages, hints. *(ideas 7, 37, 38)*
- **R03** Each page's H1 names that page; the section appears as a caption above it. *(idea 40)*
- **R04** Data tables have a caption, header cells with scope, and right-aligned tabular figures. *(idea 22)*
- **R05** Dates written as "30 September 2026"; times as "9:30am". *(idea 23)*
- **R06** HTML first: documents are attachments with format and size in the link. *(ideas 21, 41)*
- **R07** Figures that are not real DMO data are labelled "sample".

## 1. Gilt market data

- **R10** Gilts in issue shown as an HTML table on the page. *(idea 1)*
- **R11** Filter by type (conventional, index-linked, green) and maturity (short, medium, long); search by name or ISIN; sort by column. *(idea 1)*
- **R12** As-at stamp and next update shown with the table. *(idea 6)*
- **R13** Close-of-business date chosen with a GOV.UK date input, validated with an error summary. *(idea 7)*
- **R14** Downloads in CSV, ODS, XLSX and PDF with sizes, and a link to the API. *(ideas 2, 3)*
- **R15** A chart of amount in issue by maturity, with the table as its alternative. *(idea 5)*
- **R16** A data catalogue: every dataset with description, topic, update frequency, last updated and formats; filter by topic and search. *(ideas 3, 4)*

## 2. Gilt operations

- **R20** One page per operation: key facts as a summary list, a timeline of stages, and the result in HTML. *(ideas 12, 13)*
- **R21** The operation's documents attached with format and size. *(ideas 21, 41)*
- **R22** Operations calendar as an HTML table, filterable by method and type, with iCal subscription and CSV. *(idea 11)*
- **R23** Email alerts sign-up as a short stepped flow: topics, frequency, email, check answers, confirmation. *(idea 14)*
- **R24** Notification banner for a live consultation or market notice. *(idea 15)*

## 3. Remit at a glance

- **R30** Remit page leads with the 2026-27 total and split, and the date of the latest revision. *(idea 8)*
- **R31** Progress against the remit by type and maturity, as a table with bars. *(idea 9)*
- **R32** History of remit announcements and revisions, with documents attached. *(idea 8)*
- **R33** Homepage: headline figures with as-at dates, next operations strip, live notice banner, links organised by audience task. *(ideas 10, 15, 46, 47)*
- **R34** Green gilt financing linked from the remit and homepage. *(idea 16)*

## 4. Buying gilts as an individual

- **R40** Step-by-step guide to buying gilts, replacing the retail Q&A. *(ideas 24, 25)*
- **R41** Terms explained where they appear (details component). *(idea 29)*
- **R42** Eligibility checker for the Purchase and Sale Service, one question per page, with a result and next steps. *(idea 28)*
- **R43** "What is my gilt worth?" lookup: choose a gilt, enter a nominal holding, see an indicative value with the as-at time. *(idea 30)*
- **R44** Current legal references; no drafting text. *(ideas 26, 27)*

## 5. PWLB rates and borrowing

- **R50** Today's PWLB rates in a table on the page, by loan type and maturity, with the publication time and the change since the last set. *(idea 31)*
- **R51** Repayment cost estimator: amount, term, repayment type and rate type. *(idea 32)*
- **R52** "Apply for a PWLB loan" as a step-by-step page with one stable link to the current form. *(idea 35)*
- **R53** Descriptive link text and consistently formatted phone numbers. *(ideas 33, 34)*

## Quick wins tab

- **RQ00** Two-tab model: the landing page and navigator switch between "Big improvements" (the five concepts) and "Quick wins". Each tab has its own overview, and the pager stays within the current tab. No estimates, prices or effort labels anywhere in the model.

Each quick win is a single, standalone demo showing "Today" (rebuilt from the live site) next to "Proposed", with a Notes panel.

| Quick win | Title | Phase 1 idea |
|---|---|---|
| **RQ01** · QW1 | CSV and open-format downloads | 2 |
| **RQ02** · QW2 | Show when the data is as at | 6 |
| **RQ03** · QW3 | A GOV.UK date input on report pages | 7 |
| **RQ04** · QW4 | The remit figures on the Remit page | 8 |
| **RQ05** · QW5 | Next operations on the homepage | 10 |
| **RQ06** · QW6 | A banner for live consultations | 15 |
| **RQ07** · QW7 | Sensible defaults on Publications | 17 |
| **RQ08** · QW8 | Tidy the publication type list | 18 |
| **RQ09** · QW9 | Say the file type on every link | 21 |
| **RQ10** · QW10 | Mark up the Publications table properly | 22 |
| **RQ11** · QW11 | One date style | 23 |
| **RQ12** · QW12 | Update the money laundering reference | 26 |
| **RQ13** · QW13 | Remove the drafting brackets | 27 |
| **RQ14** · QW14 | Explain terms where they appear | 29 |
| **RQ15** · QW15 | Descriptive link text | 33 |
| **RQ16** · QW16 | Write phone numbers one way | 34 |
| **RQ17** · QW17 | An up-to-date accessibility statement | 36 |
| **RQ18** · QW18 | Underline links | 37 |
| **RQ19** · QW19 | A visible focus state | 38 |
| **RQ20** · QW20 | Plain navigation markup | 39 |
| **RQ21** · QW21 | An H1 that names the page | 40 |
| **RQ22** · QW22 | A clear type scale | 45 |
| **RQ23** · QW23 | Name the homepage | 47 |

Small-effort ideas left out of the quick-wins tab: 28 (eligibility check, shown in full in concept 4) and 44 (loading the fonts once, which has no visible change and is better treated as housekeeping alongside other work).

## Open questions (shown in the prototypes as red notes)

- Q1 Who owns the report engine behind the D-codes, and could it publish HTML tables and an API?
- Q2 Must announcements and results stay PDF-first for market or legal reasons?
- Q3 Which PWLB rate types should the table show by default?
- Q4 Is the Purchase and Sale Service content owned by the DMO or by Computershare?
- Q5 Does the DMO want alerts sent by GOV.UK Notify or by an existing mailing tool?
