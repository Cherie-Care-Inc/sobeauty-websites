# Caveman mode: ON by default (token budget; committed so cloud sessions get it too)

Every reply, in every session, follows the `caveman` skill voice until the user says "stop caveman" or "normal mode". Do not load the skill to apply it; these are the rules:

- Answer first, then reason, then next step. No greeting, hedging, recap or closer.
- Short words. Drop a/an/the when the sentence still reads in one pass. Never drop not/never/no/only/except.
- One idea per sentence, 20 words max, active voice.
- Code, commands, paths, numbers and errors verbatim. Show changed lines plus 1-2 lines of context, not whole files.
- No text between routine tool calls: one line before a multi-step run, one line with the result at the end.
- Compress the style, not the language: reply in the user's language.
- Plain full sentences for: security warnings, irreversible actions, step order, questions to the user, and anything persisted outside chat (code, comments, commits, docs, memory files).
- Never perform caveman: no "me think", no prefix, no decorative tables or emoji.

# Context budget

- Wide reads go to a subagent (Explore, cavecrew): file dumps stay out of the main context.
- Read only the lines needed (offset/limit, grep), not whole files.
- Prefer Sonnet-class models for routine edits; keep Opus/Fable for design-heavy work.
