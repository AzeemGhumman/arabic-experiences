# Arabic Experiences Mission Lab

## Overview

This repository is an **experimental game/mission environment for Arabic Experiences**.

It intentionally lives **next to**, but independently from, the main `arabic-experiences` repository.

Expected local structure:

```text
workspace/
├── arabic-experiences/
│   └── ...existing product...
│
└── arabic-experiences-mission-lab/
    └── ...this repository...
```

The purpose of Mission Lab is to experiment with **game-like, experience-driven Arabic learning** without introducing game-engine dependencies, architecture, assets, or experimental code into the production Arabic Experiences application.

The long-term vision is to create a reusable toolkit for building interactive Arabic-learning missions through simulated experiences such as Umrah.

However:

> **Do not build the full mission engine upfront.**

This repository should initially optimize for experimentation, learning, and iteration.

The first goal is simple:

> Build one compelling playable mission and determine whether this style of language learning is fun and effective.

---

# Product Context

Arabic Experiences teaches Arabic through **experiences rather than traditional lessons**.

The first major experience is:

# Umrah

Instead of presenting learners with:

- vocabulary lists
- grammar worksheets
- translation exercises
- isolated flashcards

the learner should experience situations that naturally require Arabic.

Examples:

- passport control
- baggage claim
- airport navigation
- taking a taxi
- hotel check-in
- entering Makkah
- asking for directions
- purchasing food or water
- interacting with pilgrims
- understanding signs
- performing Umrah
- navigating the Haram

The central philosophy is:

> **Never ask the learner to translate something when you can instead ask them to do something with it.**

For example, instead of:

> What does `جواز` mean?

An immigration officer says:

> الجواز من فضلك

The learner sees several objects and must hand the officer their passport.

The learner acquires the meaning through the experience.

---

# Why This Repository Exists

This system is experimental.

We do **not** currently know:

- whether 3D is better than 2D for these experiences
- how complex missions should be
- which gameplay mechanics work best
- which abstractions will actually be reusable
- whether Phaser is necessary
- how much should be React vs WebGL
- how mission state should ultimately be modeled
- what the final mission specification should look like

Therefore this project must remain isolated from the primary application.

The architecture should make it possible to:

```text
delete arabic-experiences-mission-lab/
```

without requiring any changes to the main Arabic Experiences application.

This is an intentional design constraint.

---

# Existing Arabic Experiences Stack

The existing application currently uses:

```text
React
Vite
TypeScript
ShadCN
Static hosting on S3
```

The long-term mobile application is expected to use:

```text
Capacitor
├── iOS
└── Android
```

Mission Lab should remain compatible with this architecture.

The game itself should run primarily client-side.

The eventual production architecture should remain capable of being deployed as a static application through:

```text
Vite build
   ↓
dist/
   ↓
S3
   ↓
CloudFront
```

No backend should be required for basic mission gameplay.

---

# Repository Boundary

The two repositories must remain independent.

```text
arabic-experiences
        │
        │ eventually launches mission
        ▼
arabic-experiences-mission-lab
```

Mission Lab must **not** import code directly from the Arabic Experiences repository.

Do NOT do things such as:

```ts
import { useUser } from "../arabic-experiences/src/hooks/useUser";
```

or:

```ts
import { LessonProgress } from "../../arabic-experiences/src/state";
```

or share application state directly.

Mission Lab should be independently:

- installable
- runnable
- buildable
- testable
- deployable

---

# Integration Philosophy

Eventually the main app and Mission Lab should communicate through a very small contract.

Conceptually:

```text
Arabic Experiences
       │
       │ MissionLaunchContext
       ▼
┌─────────────────────┐
│     Mission Lab     │
│                     │
│   playable mission  │
└─────────────────────┘
       │
       │ MissionResult
       ▼
Arabic Experiences
```

The main application should not care how Mission Lab works internally.

Mission Lab may eventually use:

- React
- Three.js
- React Three Fiber
- Phaser
- XState
- Web Audio
- speech recognition
- custom game state
- other experimental libraries

None of these should become dependencies of the production app merely because they are being tested here.

---

# Initial Technology Stack

Start with:

```text
React
Vite
TypeScript
Three.js
React Three Fiber
@react-three/drei
```

Use regular React/HTML for:

- dialogue
- Arabic text
- instructions
- buttons
- progress
- hints
- settings
- overlays
- mission completion UI

Use React Three Fiber for:

- world rendering
- NPCs
- environment
- props
- camera
- lighting
- animations
- object interaction

Do **not** introduce Phaser yet.

We expect Phaser may eventually become useful for dedicated 2D missions, but there is no reason to add another game engine until we actually build a 2D mission.

Do **not** introduce a physics engine initially.

Do **not** introduce XState initially unless the first mission becomes sufficiently complex that a state machine clearly improves the implementation.

Start simple.

---

# Development Principles

## 1. Experiment first

Optimize initially for:

> Can we make a small Arabic-learning game that feels delightful?

Do not optimize initially for:

> Can this architecture support 500 missions?

---

## 2. Hardcoding is acceptable

The first mission can contain:

```ts
if (step === "passport-request") {
  ...
}
```

That is okay.

Do not prematurely build:

```text
MissionEngine
MissionCompiler
InteractionDSL
SceneDSL
MissionSchemaV4
BehaviorGraph
PluginSystem
```

just because those abstractions might eventually be useful.

We want the abstractions to emerge from actual missions.

---

## 3. Build before abstracting

The intended progression is:

```text
Mission 1
   ↓
Mission 2
   ↓
Mission 3
   ↓
Identify repetition
   ↓
Extract primitives
   ↓
Mission toolkit
```

Not:

```text
Invent giant toolkit
   ↓
Build first mission
```

---

## 4. Prefer experience over quizzes

Whenever possible:

```text
Hear Arabic
    ↓
Understand situation
    ↓
Perform action
```

rather than:

```text
Hear Arabic
    ↓
Translate to English
```

---

## 5. React owns learning UI

Arabic text should generally remain HTML/React rather than being rendered into WebGL.

This gives us better:

- Arabic typography
- RTL handling
- accessibility
- responsiveness
- text selection
- layout
- mobile support

The game renderer owns the world.

React owns the interface around that world.

---

# Phase 1

# Mission 1: Passport Control

The first experiment should be:

> **Saudi Passport Control**

The learner has arrived in Saudi Arabia for Umrah.

They approach an immigration officer.

The learner should successfully navigate a short interaction using Arabic.

---

# Mission Objective

By the end of the mission, the learner should feel:

> **I just passed passport control using Arabic.**

The primary reward should be accomplishing the experience.

Do not frame completion primarily as:

> You memorized 7 words.

Instead:

```text
Passport stamped.

Mission Complete

You passed passport control in Arabic.
```

Secondary information may show:

```text
6 Arabic words
4 phrases
1 conversation completed
```

---

# Initial Mission Scope

Keep the first experience approximately:

```text
3–5 minutes
```

Do not make it a full airport simulator.

The first version should contain one immigration desk and one officer.

---

# Scene

The environment should communicate:

> Saudi airport passport control

without attempting photorealism.

Possible scene elements:

```text
immigration counter
officer
passport scanner
computer monitor
Saudi airport signage
queue barriers
traveler position
passport
boarding pass
phone
small luggage
```

The learner should face the immigration officer.

Camera movement should be limited.

This is not initially a free-roaming FPS.

Think more:

```text
interactive 3D diorama
```

than:

```text
open-world game
```

---

# Visual Direction

Aim for a stylized mobile-game aesthetic.

Desired qualities:

- friendly
- warm
- playful
- readable
- simple
- polished
- expressive
- culturally respectful
- low-poly or moderately stylized
- performant on mobile

Avoid:

- photorealism
- uncanny humans
- hyper-detailed environments
- excessive visual clutter
- realistic military/security aesthetic
- overly childish cartoon styling

A useful conceptual target is:

```text
stylized animated movie proportions
+
simple mobile-game readability
+
low-poly performance constraints
```

Do not copy a specific commercial game's visual identity.

---

# NPC Requirements

The first NPC is:

```text
Saudi Immigration Officer
```

Initially one character is enough.

The character should support at minimum:

```text
idle
talking
listening
receive-object
looking-down
looking-up
positive-response
```

Do not spend excessive time creating complex animation systems.

Placeholder animations are acceptable initially.

The architecture should not assume that characters will always be male or always use the same model.

Eventually we expect NPCs such as:

```text
immigration officers
airport staff
taxi drivers
hotel receptionists
shopkeepers
pilgrims
security staff
restaurant workers
Umrah guides
```

---

# Passport Control Learning Sequence

Implement approximately this sequence.

## Step 1 — Greeting

Officer says:

```text
السلام عليكم
```

Learner sees a response choice:

```text
وعليكم السلام
```

Selecting it progresses the conversation.

---

## Step 2 — Passport Request

Officer says:

```text
الجواز، من فضلك
```

The learner sees several objects.

For example:

```text
passport
phone
boarding pass
```

The passport should initially receive subtle visual emphasis.

The learner must select or drag the passport to the officer.

Correct behavior:

```text
passport
   ↓
drag/select
   ↓
officer receives passport
```

This teaches:

```text
جواز
```

through action rather than translation.

---

## Step 3 — Ask Name

Officer asks:

```text
ما اسمك؟
```

Initially scaffold the answer:

```text
اسمي ______
```

The user may select a placeholder learner name for the prototype.

Speech input is not required in V1.

A button/selectable phrase is sufficient.

---

## Step 4 — Ask Country

Officer asks:

```text
من أين أنت؟
```

Possible answer:

```text
أنا من أمريكا
```

The country may be configurable.

Initially hardcoding:

```text
أمريكا
```

is acceptable.

---

## Step 5 — Communication Problem

The officer should intentionally say something too quickly or unclearly.

The learner does not understand.

Introduce the repair phrase:

```text
ببطء، من فضلك
```

Meaning:

```text
Slowly, please.
```

The learner selects it.

The officer repeats the previous sentence more slowly.

This is important.

The learner should learn very early that:

> Not understanding everything is okay.

Arabic survival strategies are part of the curriculum.

---

## Step 6 — Completion

Officer approves entry.

Possible sequence:

```text
passport stamped
↓
officer returns passport
↓
positive facial/body reaction
↓
small satisfying sound
↓
mission complete
```

Display:

```text
Mission Complete

You passed passport control in Arabic.
```

---

# Core Interaction Types Needed for Mission 1

Only implement what Mission 1 actually requires.

Likely:

```text
NPC dialogue
response selection
object selection
object dragging
object handoff
simple animation triggering
mission progression
visual hints
audio playback
success state
```

Do not implement unrelated systems.

---

# Audio

Arabic audio should ultimately use high-quality native pronunciation.

For the prototype:

- audio files may be placeholders
- browser speech synthesis may temporarily be used if needed
- text-only mode is acceptable during early development

But structure the code so dialogue can reference audio.

For example:

```ts
{
  text: "الجواز من فضلك",
  audio: "/audio/passport-control/passport-please.mp3"
}
```

Do not tightly couple mission logic to a specific TTS provider.

---

# Arabic Content Model

Keep Arabic strings separated from rendering logic where practical.

For example:

```ts
export const passportDialogue = {
  greeting: {
    arabic: "السلام عليكم",
    transliteration: "as-salamu alaykum",
    meaning: "Peace be upon you"
  },

  passportRequest: {
    arabic: "الجواز، من فضلك",
    transliteration: "al-jawaz, min fadlak",
    meaning: "Passport, please"
  },

  askName: {
    arabic: "ما اسمك؟",
    transliteration: "ma ismuk?",
    meaning: "What is your name?"
  }
};
```

However:

> Do not display all three forms by default.

Arabic should visually dominate.

Translations and transliterations should act as optional scaffolding.

---

# Hint System

Initially support simple progressive assistance.

For example:

### First attempt

Only Arabic audio/text.

### If learner hesitates or answers incorrectly

Highlight likely object.

### Further help

Show translation.

Conceptually:

```text
Arabic
  ↓
visual hint
  ↓
Arabic + visual hint
  ↓
translation
```

Do not immediately display English alongside every Arabic phrase.

---

# Mission State

For Mission 1, a simple React state model is sufficient.

Example:

```ts
type PassportMissionStep =
  | "intro"
  | "greeting"
  | "passport-request"
  | "name"
  | "country"
  | "repair"
  | "complete";
```

Use:

```ts
useState
```

or:

```ts
useReducer
```

if appropriate.

Do not introduce XState solely because this README mentions state machines as a future possibility.

If mission complexity clearly justifies it later, we can migrate.

---

# Suggested Initial Project Structure

Start approximately here:

```text
arabic-experiences-mission-lab/
│
├── public/
│   ├── assets/
│   │   ├── characters/
│   │   ├── environments/
│   │   ├── props/
│   │   ├── textures/
│   │   └── audio/
│   │
│   └── models/
│
├── src/
│   ├── app/
│   │   └── App.tsx
│   │
│   ├── missions/
│   │   └── passport-control/
│   │       ├── PassportControlMission.tsx
│   │       ├── dialogue.ts
│   │       ├── types.ts
│   │       └── components/
│   │
│   ├── game/
│   │   ├── canvas/
│   │   ├── characters/
│   │   ├── environment/
│   │   ├── props/
│   │   └── interactions/
│   │
│   ├── ui/
│   │   ├── DialoguePanel.tsx
│   │   ├── MissionProgress.tsx
│   │   ├── HintButton.tsx
│   │   └── MissionComplete.tsx
│   │
│   ├── styles/
│   │
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

This structure may evolve.

Do not create unnecessary directories purely to match this diagram.

---

# Game Canvas Layout

Conceptually:

```text
┌───────────────────────────────────────────┐
│                                           │
│                                           │
│               3D WORLD                    │
│                                           │
│                👮                         │
│                                           │
│          immigration counter              │
│                                           │
│                 📘                        │
│                                           │
│                                           │
├───────────────────────────────────────────┤
│                                           │
│          الجواز، من فضلك                  │
│                                           │
│                   🔊                      │
│                                           │
│                 [ ? ]                     │
│                                           │
└───────────────────────────────────────────┘
```

The exact layout may differ.

Optimize for mobile portrait usage even during desktop development.

---

# Responsive Design

Primary design target:

```text
mobile portrait
```

Desktop should work but should not dictate the interaction design.

Test at approximately:

```text
390 × 844
```

as a common mobile viewport.

The game should also gracefully resize on desktop.

---

# Controls

For initial gameplay prioritize:

```text
tap
click
drag
```

Any interaction that works with a mouse should also work with touch.

Do not build gameplay around:

```text
hover
right click
keyboard-only controls
```

Those will not translate well to Capacitor/mobile.

---

# Static Hosting Constraint

The application must be statically buildable.

Running:

```bash
npm run build
```

should produce:

```text
dist/
```

that can be hosted on S3.

Do not require:

- Node server
- Express
- server-side rendering
- Next.js
- persistent backend
- websocket service

for basic gameplay.

External APIs may be introduced later for optional features, but core gameplay must not depend on them.

---

# Asset Loading

Do not import every game asset into the initial application bundle.

Mission assets should eventually be loadable independently.

Conceptually:

```text
passport-control
├── environment
├── officer
├── passport
├── phone
├── boarding-pass
└── dialogue-audio
```

Later missions should be able to load their own assets only when opened.

For now, standard Vite lazy-loading / asset loading is sufficient.

---

# Performance

The eventual target includes mobile devices.

Therefore:

- prefer `.glb` / glTF for 3D models
- avoid unnecessarily large textures
- avoid huge polygon counts
- reuse materials where possible
- limit dynamic lights
- avoid expensive post-processing initially
- avoid physics unless required
- lazy-load mission assets
- dispose unused Three.js resources appropriately

Do not sacrifice the experiment to premature optimization, but avoid obviously desktop-only implementation choices.

---

# Debugging

The development build should make mission state easy to inspect.

Create an optional debug panel showing things such as:

```text
mission:
passport-control

step:
passport-request

selectedObject:
passport

attempt:
1

hintsUsed:
0
```

This can be toggled using something like:

```text
?debug=true
```

or a development-only control.

This will become increasingly important as missions become more dynamic.

---

# Reset

Provide an obvious development mechanism to restart the mission.

For example:

```text
Restart Mission
```

or:

```text
R
```

during development.

The production learner experience does not need to expose developer controls.

---

# Do Not Build Yet

Do NOT build these systems during the first implementation unless required to make Passport Control work:

```text
full mission schema
mission editor
visual level editor
AI mission generator
character customization engine
multiplayer
backend
authentication
cloud save
leaderboards
economy
currency
achievement system
complex physics
open-world movement
procedural environments
generic plugin architecture
Phaser renderer
shared package with arabic-experiences
full speech recognition
LLM conversations
```

We may build many of these later.

They are deliberately out of scope for Phase 1.

---

# Phase 2

After Passport Control feels good, build a **very different second mission**.

Recommended:

# Pack for Umrah

This should be a 2D experience.

Example:

```text
suitcase on screen
+
multiple objects
+
Arabic audio instructions
```

The learner places requested objects into the suitcase.

Possible vocabulary:

```text
جواز
حقيبة
حذاء
ماء
ملابس
إحرام
هاتف
```

Potential interactions:

```text
tap object
drag object
remove object
listen to instruction
identify requested item
```

At this point evaluate whether a dedicated 2D renderer such as Phaser is beneficial.

Do not add Phaser before this decision.

---

# Phase 3

Build a third mission:

# Find Your Baggage

Mode:

```text
3D
```

The learner has reached baggage claim.

Skills:

```text
numbers
directions
sign recognition
حقيبة
أين
يمين
يسار
```

Interactions:

```text
listen to carousel number
find correct sign
navigate
ask NPC for help
identify suitcase
```

This mission should introduce limited spatial navigation.

---

# After Three Missions

Only after building approximately three meaningfully different missions should we extract common abstractions.

At that point inspect the code and ask:

```text
What appears in every mission?

What appears in multiple missions?

What looked reusable but actually isn't?

What behavior should become configuration?

What requires custom code?
```

Possible future abstractions may include:

```text
MissionDefinition
MissionRuntime
NPC
Dialogue
InteractiveObject
Scene
Objective
Hint
Interaction
MissionResult
LearningGoal
VocabularyEncounter
```

But these should emerge from actual implementation.

---

# Long-Term Mission Toolkit Vision

Eventually we want mission creation to look roughly like:

```text
Define situation
      ↓
Define Arabic goals
      ↓
Choose 2D or 3D
      ↓
Choose environment
      ↓
Choose NPCs
      ↓
Choose gameplay primitives
      ↓
Define variability
      ↓
Preview
      ↓
Publish
```

A mission author should eventually be able to specify:

```text
Mission:
Lost at Jeddah Airport

Situation:
Learner needs to locate baggage claim.

Mode:
3D

Arabic:
أين
يمين
يسار
أمام
حقيبة
numbers 1–8

Gameplay:
ask NPC
listen to directions
navigate
read sign
find carousel
identify luggage

Variability:
3 NPCs
4 routes
carousel 1–8
3 suitcase appearances
multiple dialogue variants
```

and implement most of the experience using existing building blocks.

That is the destination.

It is **not** the Phase 1 requirement.

---

# Expected Future Gameplay Primitives

Likely reusable interactions include:

```text
touch-object
give-object
drag-object
choose-response
spoken-response
follow-direction
find-location
read-sign
conversation
conversation-boss
sequence-actions
shopping
packing
environment-search
memory
```

These should eventually be reusable across missions.

Example:

```text
give-object
```

could be used for:

```text
passport → officer
booking → receptionist
prescription → pharmacist
money → shopkeeper
water → companion
```

Same gameplay primitive.

Different experience.

---

# Future NPC System

Eventually NPC identity should be independent from its renderer.

Conceptually:

```text
character:
immigration-officer-01
```

could resolve to:

```text
3D:
immigration-officer-01.glb

2D:
immigration-officer-01 sprites

portrait:
immigration-officer-01.webp
```

This will help keep visual identity consistent between 2D and 3D missions.

Do not build the complete character system during Mission 1.

---

# Future Character Animation Library

A reusable human animation library may eventually include:

```text
idle
talk
listen
walk
wave
point
confused
happy
give
receive
sit
stand
look-left
look-right
```

Where possible, NPCs should eventually share compatible rigs so animations can be reused.

Again, do not over-engineer this for the prototype.

---

# Future Variability

Replayability is important because repetition is fundamental to language acquisition.

Later a mission should be able to vary:

```text
NPC
voice
dialogue wording
speech speed
objects
numbers
routes
environment details
background noise
difficulty
hint availability
```

For example:

```text
الجواز
```

may become:

```text
الجواز من فضلك
```

and eventually:

```text
جواز السفر من فضلك
```

The learner should learn the intent rather than memorize one recording.

---

# Future Deterministic Randomness

When variability is introduced, mission runs should eventually use a seed.

Example:

```text
mission=passport-control
seed=847291
```

This allows developers to replay a specific randomized mission run when debugging.

Not required for Phase 1.

---

# Learning Philosophy

These principles should guide design decisions throughout the project.

## Context before explanation

Let learners infer meaning from:

- objects
- gestures
- environment
- NPC behavior
- consequences

before reaching for English translation.

---

## Retrieval over recognition

A learner should gradually progress from:

```text
obvious visual hint
↓
multiple choices
↓
minimal visual assistance
↓
Arabic only
↓
audio only
↓
natural conversation
```

---

## Repetition should feel narrative

Do not say:

> Review the word أين.

Instead create another situation where someone naturally says:

```text
أين ...؟
```

---

## Failure should teach

Incorrect actions should not simply produce:

```text
WRONG
```

The world should respond.

For example:

Learner hands officer a phone.

Officer looks confused.

Then says:

```text
الجواز
```

while gesturing toward the passport.

The correction remains inside the experience.

---

## Communication repair is a core skill

The learner should learn phrases such as:

```text
لا أفهم
ببطء من فضلك
مرة أخرى من فضلك
ماذا؟
أين؟
```

These phrases allow beginners to remain inside an Arabic interaction even with limited vocabulary.

---

## Accomplishment is experiential

Prefer:

```text
You checked into your hotel in Arabic.
```

over:

```text
Lesson 8 Complete.
```

Prefer:

```text
You found your gate.
```

over:

```text
Directions Vocabulary Complete.
```

Prefer:

```text
You passed immigration in Arabic.
```

over:

```text
6 new words learned.
```

The curriculum should be underneath the adventure rather than replacing it.

---

# Cursor Instructions

When implementing this project:

## You MAY

- create or modify any file inside `arabic-experiences-mission-lab`
- install dependencies needed by Mission Lab
- create placeholder assets where appropriate
- create simple reusable components when repetition is obvious
- refactor Mission Lab code as the experiment evolves

## You MUST NOT

- modify `../arabic-experiences`
- import source code from `../arabic-experiences`
- add Mission Lab dependencies to the main application
- assume access to a backend
- introduce Next.js
- introduce server-side rendering
- create production integrations that are not needed for the experiment
- prematurely build a generic mission framework

If something appears reusable with the production application, keep it local to Mission Lab for now.

We will intentionally promote reusable components later.

---

# Initial Deliverable

The first implementation should produce:

```text
npm install
npm run dev
```

and launch an interactive mobile-friendly Passport Control mission.

The user should be able to:

1. enter the scene
2. see an immigration officer
3. receive an Arabic greeting
4. respond to the greeting
5. hear/read a request for their passport
6. identify and give the passport
7. answer their name
8. answer where they are from
9. use `ببطء، من فضلك`
10. see the officer approve them
11. receive a satisfying mission-complete state
12. restart and replay the mission

The experience should feel like the **beginning of a game**, not a form or slideshow.

---

# Success Criteria

Phase 1 succeeds if someone can play Passport Control and say:

> "I understood what the officer wanted even though nobody explicitly taught me the sentence first."

and:

> "That felt like I was doing something rather than completing a language worksheet."

Technical elegance is secondary at this stage.

The most important questions are:

```text
Is it fun?

Does the Arabic feel contextual?

Does interacting with the world help comprehension?

Does the learner want to continue the journey?

Does the experience feel materially different from a normal language app?
```

If the answers are yes, we continue building the mission system.

If not, this repository has done its job by allowing us to learn that without destabilizing Arabic Experiences.

---

# Ultimate Goal

The long-term goal is not simply to make a 3D Arabic game.

It is to create a **toolkit for rapidly building simulated experiences through which people acquire Arabic**.

Eventually:

```text
someone describes an experience
        ↓
defines the Arabic goals
        ↓
selects 2D or 3D
        ↓
defines NPCs and environment
        ↓
defines gameplay and variability
        ↓
Mission Lab assembles the experience
        ↓
learner plays it
```

At that point, creating a new Arabic lesson becomes much closer to:

> **level design**

than:

> **building another software feature**

That is the system this experiment is intended to discover.