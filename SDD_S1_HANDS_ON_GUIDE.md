# Session 1 — Hands-On Guide

> **Use this as a follow-along during Session 1**, and as a self-paced
> walkthrough before Session 2. Every command is shown verbatim.
> Where prompts are required, the prompt is shown in a `quoted block`.
>
> The walkthrough uses one concrete example tuple end-to-end:
>
> **`(M02 Leave × P1 Employee (self-service) × N5 p95 ≤ 500 ms × Next.js + Prisma + Postgres)`**
>
> Replace it with **your** assigned tuple as you go (see
> `ASSIGNMENT_AXES.md`).

---

## Conventions used in this guide

- Lines starting with `>` are shell commands you type.
- Lines starting with `📝` are prompts you give to Copilot / a SpecKit
  slash command — copy them verbatim or adapt for your tuple.
- ✅ checkpoints tell you what "done" looks like before moving on.
- ⏱ timings are session-1 budgets; deep dives in S2–S4 will go slower.

---

## Step 1 — Create a Project Folder ⏱ 2 min

Create a clean folder on disk that will hold *all* SDD artifacts and
the eventual code. Keep it short and ASCII-only.

```powershell
> cd D:\
> mkdir sdd-myspace-<yourname>
> cd sdd-myspace-<yourname>
> git init
> git commit --allow-empty -m "chore: empty init"
```

Folder convention:

```
sdd-myspace-<yourname>/
├── .specify/            # created by SpecKit in Step 3
├── specs/               # spec.md, plan.md, tasks.md per feature
│   └── 001-leave/       # one folder per feature
├── memory/              # constitution + project memory (SpecKit)
├── src/                 # your code (whichever stack you chose)
└── README.md
```

✅ **Checkpoint:** `git status` shows a clean repo on `main` /
`master` with one empty commit.

---

## Step 2 — Pre-Requisites for SpecKit ⏱ 5 min (one-time)

SpecKit needs four things on your machine. Verify each before going
further; the rest of the session assumes they all work.

### 2.1 Tooling versions

```powershell
> python --version          # >= 3.11
> git --version             # any modern git
> node --version            # >= 18  (only if your stack uses Node)
```

### 2.2 `uv` — Python project manager used by SpecKit

```powershell
> winget install --id=astral-sh.uv -e         # Windows
# OR
> pipx install uv                              # cross-platform
> uv --version
```

### 2.3 GitHub Copilot CLI + your AI agent of choice

```powershell
> npm install -g @githubnext/github-copilot-cli
> gh copilot --version
> gh auth status                # must show: Logged in to github.com
```

> SpecKit also works with Claude Code, Cursor, Gemini, Codex, etc. Use
> whichever your org has licensed. The slash commands shown below are
> the same regardless of the agent.

### 2.4 SpecKit CLI (`specify`)

```powershell
> uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
> specify --version
> specify check          # prints a green ✅ for each prerequisite it finds
```

✅ **Checkpoint:** `specify check` is all green. If anything is red,
fix it now — do not move on with a broken pre-req.

---

## Step 3 — Init the SpecKit Repository (Greenfield) ⏱ 3 min

Initialize SpecKit **inside the folder you created in Step 1** (the
"greenfield" flow). The `--here` flag avoids creating a nested
folder.

```powershell
> specify init --here --ai copilot
```

- `--ai copilot` wires the slash-command files for GitHub Copilot.
  Substitute `claude`, `cursor`, `gemini`, etc., if that's your
  surface.
- For a brand-new project from scratch (no existing folder), use
  `specify init <project-name>` instead — it scaffolds the folder for
  you.

What appears on disk:

```
.specify/                 # tool config + slash command templates
memory/
└── constitution.md       # empty template waiting for you in Step 4
specs/                    # empty; will fill in Step 5
.github/prompts/          # if --ai copilot: slash commands available
```

Open the folder in VS Code:

```powershell
> code .
```

Inside Copilot Chat (or the CLI), confirm SpecKit slash commands are
discoverable. Type `/` and you should see at least:

```
/speckit.constitution
/speckit.specify
/speckit.clarify
/speckit.plan
/speckit.tasks
/speckit.analyze
/speckit.checklist
/speckit.implement
```

✅ **Checkpoint:** `.specify/`, `memory/`, and `specs/` exist; slash
commands are listed in Copilot Chat.

---

## Step 4 — Create the Constitution ⏱ 5 min

The constitution is the **architectural memory** of your project — the
short list of non-negotiable rules every later phase honors.

Open `memory/constitution.md` and run:

📝 **Prompt:**

```
/speckit.constitution
Create a tight constitution for the MySpace portal project.
Five rules, no more. Cover only cross-cutting, non-negotiable concerns.
Include exactly:
  1. Identity & auth — single source of truth, no local accounts.
  2. Time — all timestamps stored and compared in UTC.
  3. PII — never logged in plain text; redact before any log call.
  4. Secrets — never in code; environment variables only.
  5. Observability — every write operation must emit a structured log
     event with actor, action, entity id.
Keep each rule to one paragraph + one short ✅ example.
```

What you should see: `memory/constitution.md` populated with five
rules, each having a rationale and an example.

✅ **Checkpoint:** Read the file aloud. If any rule feels
*implementation-specific* (e.g., "use Redis for caching"), delete it —
that belongs in the plan, not the constitution.

> **Tip — Brownfield instead of greenfield?** Replace the prompt with:
> *"Read the existing codebase under `src/` and write a constitution
> that captures the rules already in force."* — the agent will infer
> rules from prior decisions.

---

## Step 5 — Analyze Requirements & Prepare the Spec ⏱ 10 min

Create a feature folder under `specs/` and run `/speckit.specify`.

```powershell
> mkdir specs\001-leave
```

📝 **Prompt** (replace the tuple with yours):

```
/speckit.specify
Feature: Leave balance + apply-leave widget for MySpace portal.

Context:
  Module: M02 Leave Management.
  Persona: P1 Employee (self-service).
  NFR constraint: N5 — performance p95 <= 500 ms for the primary read.
  Stack will be chosen in the plan phase; this spec must remain
  stack-agnostic.

Outcomes I want:
  - Employees see their current leave balance per leave type at a
    glance on the MySpace dashboard.
  - Employees can apply for leave from the same widget with a 3-field
    form (type, from-date, to-date).
  - Employees see the status of their last 5 leave requests.

Required sections in spec.md:
  - Context (4 sentences max).
  - User stories prioritized P1/P2/P3.
  - Functional requirements (atomic, testable, no compound ANDs).
  - Non-functional requirements — include the p95 NFR with a measurable
    threshold and a dataset assumption.
  - Acceptance criteria in Given-When-Then form: ≥ 1 happy path and
    ≥ 2 edge cases per P1 story.
  - Open questions section.
  - Out of scope section.

Do not write database schemas, API routes, or framework choices.
Speak in user/behavior terms only.
```

✅ **Checkpoint:** Open `specs/001-leave/spec.md` and verify:

- [ ] At least one story is marked P1; ACs are in Given-When-Then.
- [ ] The N5 performance NFR carries a **number** and a **dataset
      assumption** (e.g., "p95 ≤ 500 ms with ≤ 10k leave records").
- [ ] No code, table names, or framework choices appear.
- [ ] An *Open Questions* section exists, even if short.

---

## Step 6 — Clarify Until Zero Open Questions ⏱ 7 min

Run `/speckit.clarify` and iterate **until the Open Questions section
returns 0 entries** (or every remaining question is explicitly marked
*"deferred to a later spec"*).

📝 **First pass:**

```
/speckit.clarify
Resolve each item in the Open Questions section of
specs/001-leave/spec.md. For each:
  - Propose a concrete answer.
  - State the rationale in one sentence.
  - If a new requirement would be introduced, do NOT add it here —
    instead, add a TODO entry in Out of Scope saying "consider for
    next spec".
Update spec.md in place. Re-list Open Questions at the bottom.
If any new ambiguity surfaces from your answers, add it to Open
Questions for another pass.
```

Re-run the command (a second, third pass if needed). Each pass should
shrink Open Questions. Acceptable terminating states:

1. **Open Questions = empty.** Best outcome.
2. **Open Questions = "deferred"** entries only, each explicitly
   labeled so reviewers can see the deferral was deliberate.

⚠ **Rule:** Clarify resolves ambiguity. It does **not** add scope. If
the agent slips a new user story into the spec, reject it and re-run
with an instruction to remove it.

✅ **Checkpoint:** Open `spec.md`; the Open Questions section is
empty or fully deferred. Commit:

```powershell
> git add specs\001-leave\spec.md memory\constitution.md
> git commit -m "spec: leave widget — specify + clarify complete"
```

---

## Step 7 — Prepare the Plan Based on the Spec ⏱ 8 min

Now — and only now — your stack enters the conversation.

📝 **Prompt:**

```
/speckit.plan
Produce specs/001-leave/plan.md for the Leave widget spec.
Constraints:
  - Stack: Next.js 14 + Prisma + Postgres.   (replace with yours)
  - Honor every rule in memory/constitution.md.
  - For every NFR in spec.md, include a concrete design response.
  - Call out at least 2 failure modes and the trade-off chosen for each.
  - Include a minimum data-model slice (only what P1 needs).
  - End with a Tuple-Fit note (1–2 sentences) linking design choices
    to the assigned persona and NFR.
```

✅ **Checkpoint:** Open `plan.md`; confirm:

- [ ] Stack is declared on line 1.
- [ ] Each spec NFR has a matching design response (table or section).
- [ ] Each constitution rule is acknowledged in the plan (or
      explicitly noted as not-applicable, with reason).
- [ ] At least 2 named failure modes with chosen trade-offs.

---

## Step 8 — Analyze the Plan ⏱ 5 min

`/speckit.analyze` is your cheap insurance: it reads spec + plan
together and flags drift.

📝 **Prompt:**

```
/speckit.analyze
Compare specs/001-leave/spec.md and specs/001-leave/plan.md.
Report:
  - FRs in spec with no plan response.
  - Plan choices that contradict the constitution.
  - NFRs in spec with no design response in plan.
  - Tuple-Fit gaps (persona or NFR not visibly driving a choice).
Output a fix list, not just a critique.
```

When the agent returns findings, **fix the plan** (edit `plan.md`
yourself or ask the agent to patch specific sections — never let it
silently rewrite the spec). Re-run analyze.

✅ **Checkpoint:** `analyze` reports zero findings or only minor
warnings. Commit:

```powershell
> git add specs\001-leave\plan.md
> git commit -m "plan: leave widget — analyze-clean"
```

---

## Step 9 — Prepare the Task List ⏱ 7 min

📝 **Prompt:**

```
/speckit.tasks
Produce specs/001-leave/tasks.md from spec.md and plan.md.
Requirements:
  - Group tasks into phases with explicit entry/exit conditions.
  - Mark [P] for parallel-safe tasks within a phase.
  - Mark [T] for test tasks; every P1 story must have ≥ 1 [T] task.
  - Each task is atomic enough that a single commit could complete it.
  - Include a "Coverage Map" table at the bottom mapping each FR in
    spec.md to the task IDs that satisfy it.
  - Add an explicit perf-test task for the p95 NFR with a realistic
    dataset size.
```

✅ **Checkpoint:** Open `tasks.md`; confirm:

- [ ] Phases visible; tasks numbered (1.1, 1.2, 2.1, …).
- [ ] Coverage Map present and every spec FR appears in it.
- [ ] At least one `[T]` test task per P1 story.
- [ ] Perf-test task exists for the N5 NFR.

---

## Step 10 — Run Checklists on the Tasks ⏱ 5 min

The checklist is your **domain quality gate**. It is shaped by your
assigned NFR.

📝 **Prompt:**

```
/speckit.checklist
Run the following gates against specs/001-leave/{spec,plan,tasks}.md:

  1. Performance gate (because NFR is N5 p95 <= 500 ms):
       - Is there a perf test task with a dataset size assumption?
       - Does the plan describe a caching/indexing strategy?
       - Are slow paths (N+1 queries, unbounded lists) called out?

  2. Constitution compliance gate:
       - Auth, UTC, PII, secrets, observability — each addressed.

  3. Test coverage gate:
       - Every P1 story has a [T] test task.

Fail loudly if any gate is not green. Do not edit anything; just report.
```

If a gate fails: **add tasks to `tasks.md` until it passes**. Do not
proceed to Implement with a red gate.

✅ **Checkpoint:** All three gates green. Commit:

```powershell
> git add specs\001-leave\tasks.md
> git commit -m "tasks: leave widget — checklist passed"
```

---

## Step 11 — Proceed with Implementation ⏱ 10 min (S1 preview only)

> In S1 we demonstrate `/speckit.implement` on the **first task only**
> to give a feel. The full hands-on implementation happens in S4.

📝 **Prompt:**

```
/speckit.implement --task 1.1
Honor the human-in-the-loop rule:
  - If you discover a contradiction with spec.md or plan.md, STOP and
    ask before modifying either file.
  - Tests first: write the failing test, then the implementation,
    then re-run the test until it passes.
  - After completion, tick task 1.1 in tasks.md.
  - Commit with message:  feat(leave): <task title>  [task 1.1]
```

Verify on the file system:

```powershell
> git log --oneline -3
> npm test            # or dotnet test / pytest / your stack's equivalent
```

✅ **Checkpoint:**

- [ ] A test file was created **before** the implementation file
      (commit history shows it).
- [ ] The test passes locally.
- [ ] `tasks.md` shows task 1.1 marked done (`[x]`).
- [ ] `spec.md` and `plan.md` are **unchanged** since Step 10 (verify
      with `git diff HEAD~1 -- specs/001-leave/spec.md plan.md`). If
      they did change, the agent broke the rule — revert and re-run.

---

## Step 12 — Additional Items: QA ⏱ 5 min

Before declaring even the first slice "done", run the QA layer.
SpecKit covers structural quality; you still own behavioral and
business quality.

### 12.1 Cheap automated review

```
code-review
Review my staged and committed changes since Step 11. Report:
  - Logic errors / potential bugs.
  - Security issues (especially PII handling per constitution rule 3).
  - Deviations from spec.md acceptance criteria.
Classify each finding: severity (high / med / low) and recommended
action (act / defer / dismiss).
```

Capture the top 5 findings in a `review_report.md` (template at
`deck/templates/05_review_report.md`).

### 12.2 Cross-artifact re-analyze

After any implementation work, re-run analyze to catch silent drift:

```
/speckit.analyze
Re-check spec.md, plan.md, tasks.md, and the current source tree.
Flag any place where code diverges from spec/plan.
```

### 12.3 Manual checks AI won't do for you

| Check | Why a human still owns it |
|-------|---------------------------|
| Business logic walkthrough with realistic data | "Does this actually make sense for an Employee on a Monday morning?" |
| Role / permission test for your assigned persona | Restricted features must be invisible to wrong roles, not just hidden in JS. |
| Integration boundary behavior | Timeouts, retries, unexpected payload formats from downstream systems. |
| NFR-specific spot check | For N5: run a primary read against a seeded 10k-record dataset and confirm p95 ≤ 500 ms with a stopwatch. |
| Existing-records compatibility | Records created before this feature still load and behave. |

### 12.4 Definition of "done for S1 hands-on"

- [ ] `memory/constitution.md` populated and committed.
- [ ] `specs/001-leave/spec.md` — spec + clarify pass complete.
- [ ] `specs/001-leave/plan.md` — analyze-clean.
- [ ] `specs/001-leave/tasks.md` — checklist-passed.
- [ ] Task 1.1 implemented with a passing test.
- [ ] `review_report.md` started (top 5 findings captured).
- [ ] All files committed; repo pushable to remote.

---

## Troubleshooting Quick Reference

| Symptom | Fix |
|---------|-----|
| `specify check` fails on `uv` | Reinstall `uv`; reopen the shell so PATH updates. |
| Slash commands not visible in Copilot Chat | Ensure `.github/prompts/` exists from `specify init --ai copilot`; restart VS Code. |
| Agent edits `spec.md` during Implement | Revert (`git checkout -- spec.md`), re-run with explicit human-in-the-loop reminder in the prompt. |
| `analyze` keeps flagging the same FR | The FR is too vague; rewrite it to be atomic and testable. |
| Checklist never goes green | The NFR is unmeasurable; add a number or a procedure to the spec NFR. |
| Implement runs without writing tests | Re-prompt with "tests first; if a test does not exist, write one before the implementation." |

---

## What's next

- Bring this filled-in repo to **Session 2** — we deep-dive Steps 4–6
  (Constitution, Specify, Clarify) on your own assigned tuple, not
  the example.
- Use office hours (Wed 4:00–4:30 pm IST) for anything that didn't
  click here.
- Save this file: it is the muscle memory for the full series.
