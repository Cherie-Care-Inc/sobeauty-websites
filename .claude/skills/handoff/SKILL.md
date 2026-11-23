---
name: handoff
description: Close a long-running session without losing its work: save decisions to memory, write a handoff brief, start a FRESH successor session with it, then stop. Trigger on /handoff, "hand off this session", "close this session and continue in a new one".
---

# handoff

The user is closing this session to free context. Do the four steps below in order, then stop. Plain full sentences in the memory files and the brief; this is persisted text, caveman does not apply there.

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

Synthesize it in your own words. Never write "based on the findings above" or refer to this conversation.

## 3. Start the successor

Start a new session of yourself with that brief as its prompt, with **fresh** context, never a fork: a fork would carry this whole conversation and defeat the purpose. Same folder and same branch. If `start_session` is available, use it with `initiation` "user_asked", `context` "fresh", and `use_worktree` false so it works in this checkout. The brief must say that the session should not start the work on its own: it waits for the user's go.

If no session tool exists in this host, print the brief in a code block instead and tell the user to paste it into a new session.

## 4. Report and stop

Reply with the new session's link and a three-line summary of what was saved. Make no further changes in this session.
