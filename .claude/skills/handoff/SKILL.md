---
name: handoff
description: Close a long-running session without losing its work: measure usage, save decisions to memory, write a handoff brief, start a FRESH successor session with it, report the context saved, then stop. Trigger on /handoff, "hand off this session", "close this session and continue in a new one". Run it when the context passes ~150k tokens, when the task changes, or at the end of the day for a session that continues tomorrow.
---

# handoff

The user is closing this session to free context. Do the five steps below in order, then stop. Plain full sentences in the memory files and the brief; this is persisted text, caveman does not apply there. Write them densely all the same: every sentence carries a fact the successor needs (a path, a decision, a state, a number), nothing a successor can read in the repo, git history or an existing memory file, no narrative of how the session went. Do not run /caveman-compress on the brief or the memory files: that spends a model call to shorten text that is read once.

## 0. Measure first

If `mcp__ccd_session_mgmt__get_usage` is available (desktop app), call it with `session_id` "self" and keep: context tokens used and percent, the per-category tokens (system prompt, tools, skills, memory files, messages), and each weekly-limit window's percent used and reset time. Where the tool does not exist (cloud, terminal CLI), skip this step silently and leave the numbers out of the report.

## 1. Save to memory

Save everything from this session that is not derivable from the code or git history: decisions and their reasons, open questions, traps found, what is done, what is deployed, what remains and where it stands. One memory file per fact, following the memory format (frontmatter name, description, metadata.type). Update an existing file rather than creating a duplicate. Add or refresh the one-line pointer in MEMORY.md for each file touched. Convert relative dates to absolute.

## 2. Write the handoff brief

Write a brief for a successor session that has none of this conversation:

- goal of the work, in one or two sentences
- current folder, branch and worktree
- files touched
- exactly what is done and verified, and what is done but not verified
- what is not done, as next steps in order
- checks to run before deploying, and any deploy rules that apply (deploy scripts, contract files, live checks)
- the memory files to read first, by file name

Keep the brief under about 1,500 words. Exact paths, commands, error strings and numbers stay verbatim; everything else is summarised.

Synthesize it in your own words. Never write "based on the findings above" or refer to this conversation.

## 3. Start the successor

Start a new session of yourself with that brief as its prompt, with **fresh** context, never a fork: a fork would carry this whole conversation and defeat the purpose. Same folder and same branch. If `start_session` is available, use it with `initiation` "user_asked", `context` "fresh", and `use_worktree` false so it works in this checkout. The brief must say that the session should not start the work on its own: it waits for the user's go.

If no session tool exists in this host, print the brief in a code block instead and tell the user to paste it into a new session.

## 4. Report and stop

Reply with:

- the new session's link
- three lines on what was saved
- when step 0 ran, a usage recap in this shape: context before (tokens and percent); the successor's expected starting size (the fixed categories, meaning system prompt, tools, skills and memory files, plus the brief); the per-message saving that implies, as a percent; the weekly-limit percentages and reset time. Say in a few words that the weekly percentage measures the account, not this handoff, so it cannot show what the handoff saved.

Make no further changes in this session.
