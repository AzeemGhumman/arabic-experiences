# README-mission-passport

# Mission 1 — Passport Control

## Purpose

Build the first playable mission in the Arabic Experiences app.

This mission is called:

> **Passport Control**

It is the learner's first real Arabic conversation inside the Umrah experience.

The player has just arrived in Saudi Arabia and must pass through passport control by understanding and responding to a short, beginner-friendly conversation with an immigration officer.

This mission should feel like a **small interactive story**, not a vocabulary quiz.

The primary product goal is:

> By the end of the mission, the learner should feel: **"I can already introduce myself in Arabic."**

The learner should leave the mission able to understand and produce a few useful constructions such as:

- السلام عليكم
- وعليكم السلام
- اسمي ___
- أنا من ___
- أنا هنا للعمرة
- أنا مع عائلتي
- هذا أبي
- هذه أمي
- نعم
- لا
- شكراً

The mission must be replayable. Different playthroughs should vary in questions, family context, answer choices, order, and small complications while preserving the same core learning objectives.

---

# Product Context

Arabic Experiences teaches Arabic through real-life experiences rather than isolated textbook lessons.

The first broader experience is:

> **Going for Umrah**

The learner progresses through situations they may actually encounter:

1. Arrival
2. Passport control
3. Baggage claim
4. Transportation
5. Hotel
6. Makkah
7. Masjid al-Haram
8. Umrah-related situations
9. Food
10. Shopping
11. Family
12. Health
13. Madinah

The mission in this README is the first major interactive mission.

It should establish the design language that later missions can reuse.

---

# Core Design Principle

Do **not** build this as:

> Arabic phrase → choose English translation → next question

Instead, every question should exist because something is happening in the story.

For example:

Bad:

> What does "جواز السفر" mean?

Better:

> The officer holds out his hand and says:
>
> **جواز السفر، من فضلك**
>
> What do you hand him?

The answer options could be visual cards:

- Passport
- Phone
- Suitcase
- Boarding pass

The learner is using Arabic to solve a problem.

---

# Mission Fantasy

The player has landed in Saudi Arabia for Umrah.

They enter the passport-control line.

An immigration officer calls them forward.

The player must:

1. greet the officer,
2. hand over their passport,
3. say their name,
4. say where they are from,
5. explain that they are here for Umrah,
6. answer one simple family/travel question,
7. recover from an optional misunderstanding,
8. receive their passport back,
9. enter Saudi Arabia.

The final moment should feel rewarding.

Example:

> **أهلاً وسهلاً**
>
> *Welcome.*

Passport stamp animation.

Then:

> **Mission complete**
>
> You can now introduce yourself in Arabic.

---

# Vocabulary Sources

This mission should use no more than three existing vocabulary domains.

Primary sources:

1. **Airport & arrival**
2. **Polite essentials**
3. **Family**

Do not add unrelated vocabulary categories merely to make the mission longer.

Some small mission-specific identity vocabulary is allowed because it is central to the conversation.

Examples:

- اسم — name
- أنا — I
- من — from
- هنا — here
- عمرة — Umrah

These should be treated as core constructions rather than requiring a separate vocabulary lesson.

---

# Learning Objectives

The learner should practice five conceptual abilities.

## 1. Greetings

Recognize and respond to:

- السلام عليكم
- وعليكم السلام
- أهلاً وسهلاً
- شكراً
- من فضلك

Do not require grammatical explanation.

---

## 2. Identity

Understand:

> ما اسمك؟

Produce:

> اسمي ___

Core construction:

> **اسمي + NAME**

This construction should later be reusable throughout the app.

---

## 3. Origin

Understand:

> من أين أنت؟

Produce:

> أنا من ___

Examples:

- أنا من أمريكا
- أنا من باكستان
- أنا من الهند
- أنا من بريطانيا
- أنا من كندا

Core construction:

> **أنا من + PLACE**

---

## 4. Purpose

Understand a simple question about why they are entering Saudi Arabia.

Possible officer prompts:

> لماذا أنت هنا؟

or a simplified contextual prompt:

> للعمرة؟

Expected learner responses:

> للعمرة

or:

> أنا هنا للعمرة

Core construction:

> **أنا هنا لـ + PURPOSE**

Do not introduce detailed grammar explanations in this mission.

---

## 5. Family / Companions

Understand questions such as:

> مع من أنت؟

Possible responses:

- أنا مع عائلتي
- أنا مع أبي
- أنا مع أمي
- أنا مع زوجتي
- أنا مع زوجي

Optional recognition constructions:

- هذا أبي
- هذه أمي
- هذا ابني
- هذه ابنتي
- هذا أخي
- هذه أختي

Core concepts:

> **مع + PERSON**

and:

> **هذا / هذه + PERSON**

The learner does not need to master masculine/feminine grammar here.

Expose the pattern through context.

---

# Mission Structure

Use a fixed high-level narrative skeleton with variable content.

```text
ENTER LINE
    ↓
GREETING
    ↓
PASSPORT REQUEST
    ↓
NAME
    ↓
COUNTRY / ORIGIN
    ↓
PURPOSE OF VISIT
    ↓
FAMILY / COMPANION QUESTION
    ↓
OPTIONAL COMPLICATION
    ↓
PASSPORT RETURNED
    ↓
WELCOME TO SAUDI ARABIA
```

The exact number of interactions can vary by playthrough.

Target:

- minimum: 6 interactions
- typical: 8 interactions
- maximum: 10 interactions

The first playthrough should be easier and more guided.

Later playthroughs may become less guided.

---

# Suggested Scene Breakdown

## Scene 0 — Arrival

Visual:

- immigration hall
- queue barriers
- passport-control booths
- travelers with luggage
- airport signage

Narrative:

> You've landed in Saudi Arabia.
>
> Your first challenge: pass passport control.

CTA:

> **Join the line**

No Arabic test yet.

This establishes context.

---

# Scene 1 — Greeting

The officer looks at the player.

Officer:

> السلام عليكم

Prompt:

> How do you respond?

Possible answers:

- وعليكم السلام ✅
- شكراً
- مع السلامة
- من فضلك

This should be easy.

On success, the officer reacts naturally and continues.

Avoid giant green "CORRECT!" overlays.

Prefer story feedback.

Example:

> The officer nods and continues.

---

# Scene 2 — Passport Request

Officer:

> جواز السفر، من فضلك

Prefer visual interaction.

Prompt:

> What does the officer want?

Cards:

- passport ✅
- suitcase
- phone
- water bottle

If possible, use illustrations rather than English-only text.

After selection:

> You hand over your passport.

Then show a subtle passport movement animation toward the officer.

---

# Scene 3 — Name

Officer:

> ما اسمك؟

On the learner's first playthrough, show scaffolding.

Example:

> **اسمي ...**
>
> My name is ...

The learner completes the response.

If the app has a stored learner name, use it.

Example:

> اسمي أزيم

Otherwise use a generated character name or allow the user to select one before starting.

Preferred design:

The mission should support a `playerProfile` object.

```ts
type PlayerProfile = {
  displayName: string;
  arabicName?: string;
  country?: string;
  countryArabic?: string;
  travelingWith?: FamilyRelation[];
};
```

If real profile data is unavailable, provide sensible defaults.

---

# Scene 4 — Country

Officer:

> من أين أنت؟

Beginner mode:

Display 3–4 Arabic responses.

Example:

- أنا من أمريكا ✅
- أنا هنا للعمرة
- اسمي أزيم
- أنا مع عائلتي

This is important:

Distractors should usually be **valid Arabic sentences** the learner has seen.

The challenge is to answer the correct question, not merely distinguish Arabic from nonsense.

This creates much better learning.

---

# Scene 5 — Purpose of Visit

Officer:

> لماذا أنت هنا؟

Possible responses:

- أنا هنا للعمرة ✅
- أنا من أمريكا
- هذا أبي
- اسمي أزيم

Alternative easier variation:

Officer:

> عمرة؟

Player:

- نعم ✅
- لا

This gives us difficulty variation while testing the same concept.

---

# Scene 6 — Family / Traveling Companion

Randomly choose a family context for the playthrough.

Possible officer question:

> مع من أنت؟

Possible answer:

> أنا مع عائلتي

Or:

> أنا مع أبي

Or:

> أنا مع زوجتي

Another variation:

The officer points to someone next to you.

> هل هذا أبوك؟

Responses:

- نعم
- لا

If `لا`, a follow-up may appear:

> هذا أخي

Keep this very simple.

---

# Scene 7 — Optional Complication

Not every playthrough should have a complication.

Probability recommendation:

```ts
complicationChance = 0.35
```

A complication should create a small recovery moment.

Do not punish the learner harshly.

Examples follow.

---

## Complication A — Wrong Answer to Correct Question

Officer:

> من أين أنت؟

Player selects:

> أنا هنا للعمرة

This sentence is valid Arabic but answers the wrong question.

Do not show:

> ❌ WRONG

Instead the officer reacts:

> لا، من أين أنت؟

Then visually emphasize:

> **من أين**
>
> *from where*

Give the learner another attempt.

This is an important design pattern for the whole app:

> **Wrong answers should often create story consequences rather than quiz failure screens.**

---

## Complication B — Family Clarification

Officer:

> هل هذا ابنك؟

Player responds:

> لا

Officer:

> من هذا؟

Player chooses:

- هذا أخي ✅
- هذه أمي
- أنا من أمريكا

---

## Complication C — Repeat Yourself

Officer:

> ما اسمك؟

Player answers incorrectly.

Officer:

> مرة أخرى، من فضلك

Translation initially available:

> Once again, please.

Then retry.

This begins exposing learners to conversational repair language.

---

# Scene 8 — Success

The officer returns the passport.

Officer:

> شكراً

Then:

> أهلاً وسهلاً

Show:

- passport returned
- stamp
- gate opening / player moving forward

Final CTA:

> **Enter Saudi Arabia**

This should feel like entering the next part of the journey.

---

# Mission Completion Screen

Avoid making the main reward merely:

> 12 words learned

Instead emphasize capability.

Primary message:

> # You can introduce yourself in Arabic.

Then show the learner's constructed mini-bio.

Example:

```text
اسمي أزيم.
أنا من أمريكا.
أنا هنا للعمرة.
أنا مع عائلتي.
```

English can appear underneath in smaller text.

Then show secondary metrics:

- New words: 9
- Constructions: 4
- Conversation score: 92%
- Mistakes recovered from: 1

Possible CTA buttons:

- **Continue to baggage claim**
- **Play again**

Replay should be prominent enough that users understand the mission changes.

Optional supporting text:

> The officer may ask different questions next time.

---

# Replayability

Replayability is a core requirement.

Do not simply shuffle answer order.

Each run should generate a small variation of the conversation.

The mission should support randomization across several dimensions.

---

## Variable 1 — Question Selection

Choose a subset from pools.

Example:

```ts
const identityQuestions = [
  "name",
  "country",
  "purpose",
];

const familyQuestions = [
  "traveling_with",
  "is_this_your_son",
  "is_this_your_father",
  "who_is_this",
];
```

A playthrough should not necessarily ask every possible question.

---

# Variable 2 — Question Order

Keep a believable conversation.

Do not fully randomize.

For example, name and passport should come early.

But these can vary:

Run A:

```text
Greeting
Passport
Name
Country
Purpose
Family
```

Run B:

```text
Greeting
Passport
Country
Name
Family
Purpose
```

Run C:

```text
Greeting
Passport
Name
Purpose
Country
Family clarification
```

---

# Variable 3 — Family Context

Possible traveler states:

```ts
type TravelParty =
  | "alone"
  | "family"
  | "father"
  | "mother"
  | "spouse"
  | "son"
  | "daughter"
  | "brother"
  | "sister";
```

For the first version, supporting 4–5 states is enough.

Recommended initial states:

- alone
- family
- father
- spouse
- son

The mission generator selects questions compatible with that state.

Do not ask:

> Is this your son?

if the generated scenario says the learner is alone.

---

# Variable 4 — Origin

Use a small initial pool of countries.

Examples:

```ts
[
  { en: "United States", ar: "أمريكا" },
  { en: "Pakistan", ar: "باكستان" },
  { en: "India", ar: "الهند" },
  { en: "United Kingdom", ar: "بريطانيا" },
  { en: "Canada", ar: "كندا" },
]
```

If the learner has a stored country, prefer that country.

Do not require a giant country database for v1.

---

# Variable 5 — Officer Personality

Small flavor variations can make replays feel different.

Do not make them cartoonishly extreme.

Possible variants:

### Friendly

Short smile, warmer reactions.

> أهلاً وسهلاً

### Neutral

Professional and direct.

### Busy

Shorter questions.

> الجواز.

> من أين؟

This is useful because real spoken Arabic may be abbreviated.

For the first implementation, personality can affect:

- text flavor,
- animation,
- question wording,

but should not significantly change difficulty.

---

# Variable 6 — Difficulty

The same mission should be reusable as the learner improves.

Support at least three conceptual levels.

## Guided

- Arabic + English translation
- obvious visual options
- sentence scaffolding
- audio replay available
- four choices

Example:

> من أين أنت؟
>
> Where are you from?

---

## Assisted

- Arabic prompt
- translation available through tap
- less scaffolding
- Arabic answer options

---

## Immersive

- Arabic only by default
- audio-first prompts
- fewer translations
- learner constructs response
- optional speaking interaction later

For MVP, implement the system so difficulty can be represented in data even if only `guided` is fully polished.

```ts
type MissionDifficulty =
  | "guided"
  | "assisted"
  | "immersive";
```

---

# Interaction Types

Avoid using the same multiple-choice interaction for every scene.

Support a small reusable set.

Recommended MVP types:

## `choice`

Select the correct response.

---

## `visual-choice`

Choose an object/image.

Example:

> جواز السفر، من فضلك

Choose the passport.

---

## `sentence-complete`

Example:

```text
اسمي ______
```

Choose or insert the learner's name.

---

## `dialogue-choice`

Choose the best response to what the officer said.

---

## `yes-no`

Example:

> هل هذا أبوك؟

- نعم
- لا

---

## `listen-and-choose`

Optional if audio infrastructure exists.

Play:

> من أين أنت؟

Then choose the correct response.

Do not block the first implementation on speech recognition.

---

# Recommended Data Model

Do not hardcode the entire mission as one React component.

The adventure engine should be data-driven enough that later missions can reuse the same UI.

Example:

```ts
type Mission = {
  id: string;
  title: string;
  subtitle: string;
  experience: "umrah";
  stage: "arrival";
  difficulty: MissionDifficulty;
  intro: MissionIntro;
  sceneGenerator: MissionSceneGenerator;
  completion: MissionCompletion;
};
```

Suggested scene model:

```ts
type MissionScene = {
  id: string;
  type:
    | "story"
    | "choice"
    | "visual-choice"
    | "dialogue-choice"
    | "sentence-complete"
    | "yes-no";

  speaker?: "officer" | "player" | "narrator";

  arabic?: string;
  transliteration?: string;
  english?: string;

  prompt?: string;

  answers?: MissionAnswer[];

  successFeedback?: string;
  retryFeedback?: string;

  tags?: string[];

  constructionId?: string;
  vocabularyIds?: string[];
};
```

Answer:

```ts
type MissionAnswer = {
  id: string;
  arabic?: string;
  english?: string;
  image?: string;
  correct: boolean;
  responseEffect?: string;
};
```

---

# Mission Generator

Use a mission generator rather than a static scene array.

Example conceptual API:

```ts
generatePassportMission({
  playerProfile,
  difficulty,
  seed,
});
```

Return:

```ts
{
  runId,
  seed,
  travelParty,
  origin,
  officerVariant,
  complication,
  scenes,
}
```

Use a seed so a playthrough can be reproduced during debugging.

Example:

```ts
const run = generatePassportMission({
  playerProfile,
  difficulty: "guided",
  seed: 18273,
});
```

---

# State Machine

The mission should have explicit state.

Example:

```ts
type MissionState = {
  runId: string;
  currentSceneIndex: number;

  correctAnswers: number;
  incorrectAnswers: number;
  recoveredMistakes: number;

  introducedVocabulary: string[];
  practicedConstructions: string[];

  completed: boolean;
};
```

Basic transitions:

```text
MISSION_START
    ↓
SCENE_PRESENTED
    ↓
PLAYER_RESPONSE
    ↓
CORRECT ─────────→ NEXT_SCENE
    │
INCORRECT
    ↓
REACTION / HINT
    ↓
RETRY
    ↓
NEXT_SCENE
```

Some incorrect answers can branch into a short recovery scene.

Example:

```text
COUNTRY QUESTION
    ↓
WRONG BUT VALID RESPONSE
    ↓
OFFICER CLARIFIES
    ↓
COUNTRY RETRY
    ↓
CONTINUE
```

---

# Arabic Content Model

Store Arabic separately from English.

Do not embed strings randomly throughout JSX.

Example:

```ts
const constructions = {
  myNameIs: {
    id: "my-name-is",
    pattern: "اسمي {name}",
    english: "My name is {name}",
  },

  iAmFrom: {
    id: "i-am-from",
    pattern: "أنا من {place}",
    english: "I am from {place}",
  },

  hereForUmrah: {
    id: "here-for-umrah",
    pattern: "أنا هنا للعمرة",
    english: "I am here for Umrah",
  },

  withPerson: {
    id: "with-person",
    pattern: "أنا مع {person}",
    english: "I am with {person}",
  },
};
```

---

# Transliteration

Transliteration should be available as learner support, but should not dominate the interface.

Preferred hierarchy:

1. Arabic — largest
2. English meaning — smaller
3. Transliteration — optional / toggle / helper

Do not visually train the learner to rely primarily on Latin transliteration.

A learner preference such as:

```ts
showTransliteration: boolean
```

should control it.

---

# Arabic Text Requirements

Arabic must:

- use RTL rendering correctly,
- have generous font sizing,
- use a font that renders Arabic cleanly,
- avoid line-height clipping,
- display diacritics correctly if later added.

Where Arabic appears by itself:

```tsx
dir="rtl"
lang="ar"
```

Use these semantically where appropriate.

Do not make the entire page RTL if the interface language is English.

---

# Audio

The UI should be designed with audio in mind even if real recordings are not yet available.

Every officer utterance should support:

```ts
audioSrc?: string;
```

Show a small replay button next to Arabic dialogue.

Future behavior:

- play Arabic automatically when a scene begins,
- allow replay,
- optionally slow playback.

For MVP, mock audio or omit playback if assets are unavailable, but keep the component API ready.

---

# Visual Direction

Use the existing playful Arabic Experiences visual style.

The mission should feel:

- warm,
- playful,
- respectful,
- adventurous,
- simple,
- slightly game-like,

without turning passport control into a stressful or intimidating environment.

Visual environment:

- modern Saudi airport
- immigration booth
- passport
- suitcase
- queue
- travelers
- subtle Saudi/Umrah context

Do not overfill the screen.

The conversation is the focus.

---

# Mobile-First Layout

Build for phone first.

Suggested layout:

```text
┌──────────────────────────┐
│ Mission progress         │
│ ● ● ● ○ ○ ○              │
├──────────────────────────┤
│                          │
│      Scene artwork       │
│                          │
├──────────────────────────┤
│ Officer                  │
│                          │
│   من أين أنت؟           │
│   Where are you from?    │
│                          │
│   🔊                     │
├──────────────────────────┤
│ [ أنا من أمريكا ]        │
│ [ أنا هنا للعمرة ]       │
│ [ اسمي أزيم ]            │
│                          │
└──────────────────────────┘
```

Desktop can center the same experience inside a phone-like content width.

Do not create a dense desktop dashboard layout.

---

# Progress

Show narrative progress rather than "Question 4 of 8" if possible.

Possible stages:

```text
● Greeting
● Passport
● Questions
○ Entry
```

Or simple dots.

The learner should know the mission is short.

Target mission duration:

> approximately 2–4 minutes

Do not make the introductory mission exhausting.

---

# Feedback Philosophy

Avoid:

- giant red X,
- buzzer sounds,
- "WRONG!",
- losing lives,
- restarting the mission.

Prefer conversational correction.

Example:

Player answers:

> أنا هنا للعمرة

when asked:

> من أين أنت؟

Officer:

> من أين؟

Then highlight:

> **أين = where**

And allow retry.

The goal is:

> Mistakes should move the story forward or create recovery opportunities.

---

# Scoring

Scoring is secondary.

Recommended:

```ts
score = {
  comprehension: number,
  responses: number,
  recovery: number,
};
```

Do not surface complicated percentages everywhere.

The completion screen can simply show:

```text
Conversation
★★★

Introductions
★★★★

Recovered mistakes
1
```

Or another simple representation compatible with the existing app.

---

# First-Play vs Replay Behavior

The first playthrough should be intentionally controlled.

## First Play

Guarantee these scenes:

1. greeting
2. passport
3. name
4. origin
5. Umrah purpose
6. family
7. completion

Use maximum scaffolding.

No difficult complication is required.

---

## Replay

Allow:

- alternative question wording,
- family variants,
- different answer options,
- reordered middle scenes,
- 35% chance of complication,
- fewer translations,
- audio-first prompts if supported.

Display:

> **Play again — the conversation will change**

---

# Example Playthrough A

## Scene 1

Officer:

> السلام عليكم

Player:

> وعليكم السلام

---

## Scene 2

Officer:

> جواز السفر، من فضلك

Player selects passport.

---

## Scene 3

Officer:

> ما اسمك؟

Player:

> اسمي أزيم

---

## Scene 4

Officer:

> من أين أنت؟

Player:

> أنا من أمريكا

---

## Scene 5

Officer:

> لماذا أنت هنا؟

Player:

> أنا هنا للعمرة

---

## Scene 6

Officer:

> مع من أنت؟

Player:

> أنا مع عائلتي

---

## Scene 7

Officer:

> شكراً. أهلاً وسهلاً

Passport stamped.

Mission complete.

---

# Example Playthrough B

A replay should feel different.

Officer:

> السلام عليكم

Player responds.

Officer:

> الجواز، من فضلك

Player selects passport.

Officer:

> من أين أنت؟

Player accidentally answers:

> أنا هنا للعمرة

Officer:

> لا، من أين أنت؟

Player:

> أنا من أمريكا

Officer:

> ما اسمك؟

Player:

> اسمي أزيم

Officer points to a companion:

> هل هذا ابنك؟

Player:

> نعم

Officer:

> عمرة؟

Player:

> نعم

Officer:

> أهلاً وسهلاً

Mission complete.

---

# Example Playthrough C

Officer is in a busier state and uses abbreviated language.

> السلام عليكم

Then:

> الجواز.

Then:

> اسمك؟

Then:

> من أين؟

Then:

> مع من أنت؟

Then:

> عمرة؟

The learner is hearing shorter real-world constructions while still practicing the same concepts.

This should probably only appear after the learner has completed the mission before.

---

# Mini-Bio Reward

At mission completion, create a generated learner artifact.

Example:

## My Arabic Bio

> اسمي أزيم  
> أنا من أمريكا  
> أنا هنا للعمرة  
> أنا مع عائلتي

This should persist conceptually across the app.

As learners complete future missions, their usable Arabic identity can expand.

Future examples:

> أنا مهندس

> عندي ابن

> أحب القهوة

This could eventually become a persistent feature called something like:

- My Arabic
- My Arabic Passport
- What I Can Say
- My Arabic Identity

Do not block this mission implementation on building the entire persistence feature.

For now, create the completion component so it could later be persisted.

---

# Suggested Component Structure

Adapt to the existing project architecture.

Do not blindly create these names if equivalent components already exist.

Conceptually:

```text
src/
  missions/
    passport/
      passportMission.ts
      passportGenerator.ts
      passportContent.ts
      passportTypes.ts

  components/
    mission/
      MissionShell.tsx
      MissionProgress.tsx
      DialogueCard.tsx
      AnswerChoice.tsx
      VisualChoice.tsx
      AudioButton.tsx
      MissionFeedback.tsx
      MissionComplete.tsx
      ArabicBioCard.tsx
```

Prefer reusable mission primitives because later experiences will use the same engine.

---

# URL

Follow the project's existing routing conventions.

Suggested route:

```text
/missions/passport-control
```

If the project already has an experience/adventure hierarchy, use that hierarchy rather than creating an incompatible route.

Possible example:

```text
/experiences/umrah/missions/passport-control
```

Do not break existing routes.

---

# Start Screen

Before the story begins, show a lightweight mission card.

Example:

```text
PASSPORT CONTROL

You've landed in Saudi Arabia.

Use a little Arabic to get through
passport control.

You'll practice:
👋 Greetings
🪪 Introductions
👨‍👩‍👦 Family

[ Start Mission ]
```

Optional:

```text
~3 min
```

Do not list every vocabulary word before the experience.

Discovery is part of the fun.

---

# Content Safety / Accuracy

This mission is language learning, not immigration/legal guidance.

Avoid:

- making claims about exact Saudi immigration requirements,
- presenting fictional dialogue as an official procedure,
- collecting sensitive passport information,
- asking the learner for passport number,
- asking for legal name unless already part of an optional local profile.

Use simulated personal details only for language practice.

Never request or store:

- passport number
- visa number
- date of birth for immigration purposes
- document scans

The "passport" is purely a story object.

---

# Analytics Hooks

If the project has analytics infrastructure, capture:

```ts
mission_started
mission_scene_answered
mission_scene_retry
mission_complication_triggered
mission_completed
mission_replayed
```

Suggested fields:

```ts
{
  missionId: "passport-control",
  runId,
  sceneId,
  difficulty,
  correct,
  attemptNumber,
  constructionId,
}
```

Do not block the mission on analytics if no analytics layer currently exists.

---

# Persistence

At minimum, persist locally:

- mission completion status,
- number of completions,
- best score if scoring exists,
- vocabulary seen,
- constructions practiced.

Example:

```ts
{
  missionId: "passport-control",
  completed: true,
  completions: 3,
  constructionsSeen: [
    "my-name-is",
    "i-am-from",
    "here-for-umrah",
    "with-person"
  ]
}
```

Use the project's existing persistence approach.

Do not introduce a backend solely for this feature.

---

# Accessibility

Ensure:

- answer buttons are keyboard accessible,
- Arabic has sufficient font size,
- images have alt text,
- color is not the only correctness indicator,
- audio has text equivalent,
- focus states remain visible,
- tap targets work comfortably on mobile.

---

# MVP Scope

The MVP should include:

- mission start screen,
- passport-control environment,
- 6–8 scene first playthrough,
- Arabic + English support,
- greeting interaction,
- passport visual selection,
- name interaction,
- country interaction,
- Umrah purpose interaction,
- family interaction,
- mission completion,
- Arabic mini-bio,
- replay button,
- randomized replay,
- at least one recoverable misunderstanding,
- local mission completion state.

---

# Explicitly Out of Scope for MVP

Do not spend time implementing:

- speech recognition,
- live LLM-generated conversations,
- real immigration APIs,
- real passport data,
- avatars with complex customization,
- dozens of countries,
- grammar lessons,
- a full spaced-repetition engine,
- backend accounts,
- elaborate scoring algorithms,
- multiplayer,
- open-ended AI conversation.

The first mission should be polished rather than enormous.

---

# Acceptance Criteria

The mission is complete when:

- [ ] A learner can start Passport Control from the Umrah experience.
- [ ] The mission clearly takes place at Saudi airport passport control.
- [ ] The learner encounters Arabic in context rather than as isolated flashcards.
- [ ] The learner practices a greeting.
- [ ] The learner understands a passport request.
- [ ] The learner practices `اسمي ___`.
- [ ] The learner practices `أنا من ___`.
- [ ] The learner practices `أنا هنا للعمرة`.
- [ ] The learner encounters at least one family/companion construction.
- [ ] Wrong answers can be retried without a punitive failure screen.
- [ ] At least one mistake type can cause conversational clarification.
- [ ] Mission completion feels like successfully entering Saudi Arabia.
- [ ] The completion screen shows a generated Arabic mini-bio.
- [ ] Replay generates a meaningfully different conversation.
- [ ] Answer ordering alone is not the only source of replay variability.
- [ ] The first run is easier than later runs.
- [ ] Arabic renders correctly in RTL.
- [ ] The experience works well on a phone-sized viewport.
- [ ] Mission progress persists locally.
- [ ] Existing application routes/features remain intact.

---

# Product North Star for This Mission

When someone completes the first mission, we want them to think:

> **"I just had my first little conversation in Arabic."**

Not:

> "I memorized ten airport words."

The story is the container.

The vocabulary and constructions are the skills.

Replayability turns those skills into familiarity.

And each later mission should build on the Arabic the learner has already used here.
