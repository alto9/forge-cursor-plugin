export const boardPath = [
  "Grooming",
  "Refinement",
  "Ready",
  "In Progress",
  "In Review",
  "Done",
  "Release",
  "Told the world",
];

export const courses = [
  {
    id: "agentic-sdlc",
    title: "Agentic SDLC",
    kicker: "Course 1 · required",
    subtitle: "How software gets made, and who is responsible for each part of the loop.",
    sessions: [
      {
        id: "what-is-sdlc",
        title: "What is an SDLC?",
        duration: "30–40 min",
        format: "slides",
        slides: [
          {
            title: "Nobody ships a product in one sitting",
            visual: "loop",
            body: [
              "Think of a kitchen that never really closes. Someone is always planning the next plate, cooking, tasting, or talking to the people who just ate.",
              "Software is like that: ideas come in, someone writes them down, someone builds, someone tastes, someone serves, and the comments from the table become tomorrow’s ideas.",
            ],
          },
          {
            title: "That loop is the SDLC",
            visual: "cycle-steps",
            body: [
              "SDLC is just a stuffy name for that kitchen: the software development lifecycle, the path from “we should do this” to “people can use it,” and then around again.",
              "Teams pin the path to a wall as columns and argue about the names; the jobs stay the same: decide, specify, build, check, ship, learn.",
            ],
          },
          {
            title: "A ticket is one finishable piece of work",
            visual: "ticket",
            body: [
              "If you write “make the product better,” nobody can finish that wish. A ticket is small enough that a person can take it, do it, and put the spatula down.",
              "“A signed-out visitor can reset their password and land back on sign-in” is something you can cook. Different teams call it an issue, a story, or a card; the idea is the same: one finishable piece.",
            ],
          },
          {
            title: "What a backlog is",
            visual: "backlog",
            body: [
              "The backlog is everything we might do, rather than what we are cooking before lunch. New scraps get tossed in; some sit for months, and some get quietly thrown away.",
              "Treat it as a promise or a calendar and the team drowns, because the backlog is a pile of possibilities rather than a commitment.",
            ],
          },
          {
            title: "Vague items and items we will shape next",
            visual: "backlog",
            body: [
              "“Customers want a mobile app” is fog. It can live at the back of the kitchen (people sometimes call that the icebox) until someone is ready to make it specific.",
              "The cards at the front still need shaping before they are dinner, and shaping is a different job from cooking.",
            ],
          },
          {
            title: "What grooming is",
            visual: "groom",
            body: [
              "Grooming is when we pick a vague card and ask the questions we have been avoiding: what does better look like, for whom, how will we know we did it, and what are we leaving alone?",
              "You leave with something clearer, and usually still not clear enough to hand to the line and walk away.",
            ],
          },
          {
            title: "Ready means they should not have to guess",
            visual: "ready",
            body: [
              "The next pass writes the contract: build this, leave that alone, and check it this way. When that is done, the ticket is Ready.",
              "Ready is a feeling you can test: if the person building it still has to ping you to ask what you meant, you hoped it was ready rather than proving it.",
            ],
          },
          {
            title: "In Progress means the work has started",
            visual: "board",
            here: "Doing",
            body: [
              "Someone (or an agent, with a someone still responsible) picks up a Ready ticket and starts, and the card moves so the rest of the kitchen can see it is taken, because two cooks on the same plate in the dark is how you get two sauces and no dinner.",
            ],
          },
          {
            title: "Review asks two different questions",
            visual: "review",
            body: [
              "When the change exists, other people look before it becomes the house special. One question is whether we cooked what we said we would; the other is whether this is safe to put in front of people.",
              "“The oven beeped” (the automated checks passed) is only the timer; tasting is a different job.",
            ],
          },
          {
            title: "Done and released are different moments",
            visual: "ship",
            body: [
              "Done usually means we accepted the change, folded it into the main recipe, and closed that ticket’s job.",
              "The guests may still be waiting. A release is the walk from the pass to the table: a version, a few words about what changed, and a moment when it actually leaves.",
            ],
          },
          {
            title: "The cycle starts again after we ship",
            visual: "loop",
            body: [
              "Idea into the backlog, grooming until the outcome is honest, specification until it is Ready, then build, review, accept, and release. What people do with it, and what we learned, becomes new scraps on the pile.",
              "If you stop after Done, you plated it and never left the pass; serving is what feeds the next loop.",
            ],
          },
          {
            title: "Next: the eight roles",
            visual: "cycle-steps",
            body: [
              "You have the words, and the rest of this course is who stands at which station: Product Owner, Project Manager, Architect, Engineer, QA, Security, Release, Marketing, and when they step in.",
              "How this team runs the loop in software is Course 2, after you can tell the story of a ticket out loud.",
            ],
          },
        ],
      },
      {
        id: "product-owner",
        title: "Product Owner",
        duration: "75–90 min",
        role: "product-owner",
        source: "agents/product-owner.md",
        here: "Grooming",
        blocks: [
          { type: "visual", name: "groom" },
          {
            type: "prose",
            paragraphs: [
              "The Product Owner decides what we are building and why. They write down the problem, who it is for, how we will know it worked, and what is out of scope right now.",
              "They turn vague ideas into tickets: first the intention and how we will know, then a Ready contract a builder can finish without guessing. Those answers live on the product pages; ask the Agent any time to read them with you.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask the Agent anytime",
            body: "The Agent can open the brief, roadmap, and backlog notes with you whenever you want to say what we are building, why, how we will know, and what is out of scope, and whenever you want help writing the next page. How to use those asks, and which events and skills to pair with them, is Course 3.",
          },
          {
            type: "heading",
            text: "What this role does",
          },
          {
            type: "list",
            items: [
              "Name the problem, the people it is for, and the outcome.",
              "Keep a shared roadmap so the team agrees what we are doing now, what comes next, and what can wait.",
              "Turn vague ideas into tickets: first the intention and how we will know, then a full Ready contract.",
              "Say what a ticket will not do, so scope stays one finishable piece of work.",
              "Read feedback and metrics, and let that change what we do next.",
              "Before and after a release, check that the launch words match the outcome you asked for.",
            ],
          },
          {
            type: "heading",
            text: "The product story has to be written down",
          },
          {
            type: "prose",
            paragraphs: [
              "Before tickets, you need a short product story that the rest of the team can share: what this thing is, what problem it solves, who it is for and who it is not for, what success looks like (in a number if you have one), and what we are refusing on purpose.",
              "That story is the brief, and you should be able to read it aloud in a few minutes. If you cannot say the current focus in a sentence, the brief is already out of date.",
              "Next to it sits a roadmap, where themes group related work; you cannot close a theme the way you close a ticket. After themes come what we are doing now, what comes next, what can wait, and what we are not planning. The “now” list stays short: a few current bets (work you are actually spending attention on), rather than every idea the team has had. Writing down what we are not planning keeps the same argument from coming back every week.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Current state only",
            body: "The brief’s frontmatter is the source of truth for the shared product story; the body only expands with context and links. The brief and the roadmap describe what is true now; they are not a diary of how you argued. When the focus changes, you change the page rather than appending a history of feelings.",
          },
          {
            type: "heading",
            text: "A ticket is one piece of work",
          },
          {
            type: "prose",
            paragraphs: [
              "A ticket is one piece of work someone can finish, while “Improve onboarding” is a theme: a bucket for related work.",
              "If that theme would become five or more related tickets, group them under a milestone on the board so the tickets stay finishable and the cluster still has a name, rather than opening a parent ticket you cannot close.",
              "Vague ideas can sit in an icebox as a holding place; sitting there does not promise we will build them. They become tickets only when you are ready to make them specific.",
            ],
          },
          {
            type: "heading",
            text: "Pass one: grooming",
          },
          {
            type: "prose",
            paragraphs: [
              "Grooming is weekly, and it is the first pass rather than the last. You pick a vague item and make the outcome honest enough that refinement can finish the contract. Write why this matters and how we will know, and stop before you have designed the solution.",
              "If you try to make a Ready ticket in grooming, you will either stall the room or call it Ready on a guess. Grooming lands the card in Refinement: clearer, and still not something a builder can finish alone.",
            ],
          },
          {
            type: "example",
            title: "Example: a groomed ticket",
            lines: [
              "Intention",
              "A signed-out visitor can get back into their account without emailing support.",
              "",
              "Acceptance criteria",
              "[ ] They can request a reset from the sign-in screen",
              "[ ] They receive a one-time link that expires",
              "[ ] After a successful reset they land on sign-in, not inside the app",
              "",
              "Notes",
              "Do we already have email sending in this product? Still open.",
            ],
          },
          {
            type: "prose",
            paragraphs: [
              "That last note is allowed in grooming; it cannot survive into Ready. If email sending is still an open question, the ticket stays in Refinement until you answer it, split the unknown into its own short investigation (“prove we can send mail”), or leave the card there.",
            ],
          },
          {
            type: "heading",
            text: "Pass two: refinement — until it is Ready",
          },
          {
            type: "prose",
            paragraphs: [
              "Refinement is on demand, after grooming. You write the contract into the ticket itself so a builder does not need you in the room. Every fact they need lives on that card: what changes, what must not change, the edge cases (the odd paths that would change the work), and how to check it.",
              "Grooming wrote Intention (why this matters and how we will know), and Ready restates that as Outcome, the concrete result the builder is contracted to produce.",
              "Ready means the ticket body is enough that the builder does not have to ask what you meant. A longer background note can exist (a feature write-up, a competitive scan), and it still does not replace the ticket.",
            ],
          },
          {
            type: "table",
            headers: ["The ticket must say", "What that means"],
            rows: [
              ["Outcome", "One concrete result for a person or the system. This is the groomed Intention, written as the contract."],
              ["Scope", "What will change (screens, behavior, data) and the boundary."],
              ["Acceptance criteria", "Claims that must be true, written so you could fail them. Edge cases that would change the work belong here."],
              ["Out of scope", "What this ticket will not do, so nobody “helpfully” adds it."],
              ["Constraints", "Rules that bind the work, written on the ticket rather than “see the brief.”"],
              ["Verification", "The procedure you will actually run, or watch a human run, to prove the claims. The criteria are the claims; this is how you check them."],
              ["Open questions", "Must be None; any leftover question keeps the card in Refinement."],
            ],
          },
          {
            type: "example",
            title: "Example: the same ticket, Ready",
            lines: [
              "Outcome",
              "A signed-out visitor resets their password with a one-time email link and returns to sign-in.",
              "",
              "Scope",
              "Sign-in screen: “Forgot password.” Reset request, email with a 30-minute link,",
              "set-new-password page, then redirect to sign-in. No change to signed-in settings.",
              "",
              "Acceptance criteria",
              "[ ] From sign-in, they can request a reset with the email on the account",
              "[ ] Unknown emails get the same “if we have an account…” message (no account fishing)",
              "[ ] The link works once and fails after 30 minutes",
              "[ ] After success they are on sign-in, not inside the app",
              "",
              "Out of scope",
              "Social login. Changing email. Reset from inside a signed-in session.",
              "",
              "Constraints",
              "Use the existing mail sender. Do not add a second email vendor.",
              "",
              "Verification",
              "Request a reset on a test account, use the link, sign in with the new password.",
              "Confirm an expired link and a second use of the same link both fail.",
              "",
              "Open questions",
              "None.",
            ],
          },
          {
            type: "heading",
            text: "Can an agent do this?",
          },
          {
            type: "prose",
            paragraphs: [
              "When a ticket is Ready, you also put exactly one mark on the card: an agent can execute this, or a person has to. Work in the codebase (change the product, add tests, update docs in the repo) can be marked for an agent. Work that leaves the repo stays with a person: a vendor console, credentials, a payment-provider dashboard, a conversation with legal. That still needs a complete ticket, and a person has to do the steps.",
              "Both kinds of work can sit in Ready, and only the agent-marked cards go to an Engineer agent later. If you are unsure, mark it for a human, because ambiguity is how an agent invents a second product in the margins.",
            ],
          },
          {
            type: "heading",
            text: "When you show up",
          },
          {
            type: "table",
            headers: ["When", "What you are doing"],
            rows: [
              ["Project start", "Write the first brief and a first-pass roadmap. Vague ideas can sit in the icebox."],
              ["Weekly — grooming", "Turn vague items into Intention and acceptance criteria, and stop at Refinement."],
              ["When a card is groomed", "Refine it to a full Ready contract, or send it back if questions remain."],
              ["Weekly — feedback", "Read what users and the team are saying. Promote a comment toward a ticket or Now, park it in the icebox, or drop it (we are not doing this), rather than opening a ticket for every comment."],
              ["Weekly — stakeholders", "Say what is still true and what changed, and get decisions out of hallway chat."],
              ["Every other week — roadmap", "Check whether the current bets are still the right ones, and update the roadmap where the team can see it."],
              ["Every other week — metrics", "Read the numbers you claimed would move, and say so if they did not."],
              ["Monthly — discovery / competitive", "Go looking on purpose: problems, alternatives, where we win and lose."],
              ["After a release", "Can we tell a true launch story? Then look back: did the outcome happen?"],
            ],
          },
          {
            type: "heading",
            text: "How this work meets the rest of the team",
          },
          {
            type: "prose",
            paragraphs: [
              "The Project Manager puts Ready tickets in an order the team can actually run, which only works if the roadmap’s current list is short enough to sequence.",
              "When a Ready outcome might force a new kitchen layout, the Architect says so, and sometimes the next step is a spike: a short investigation, like “prove we can send mail,” so the feature ticket can be honest.",
              "The Engineer builds what is on the card; extra scope is a product decision, so you add it to this ticket or you write the next one.",
              "If QA finds the acceptance criteria were wrong while checking the change, you update the ticket so the next review is true.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "callout",
            tone: "note",
            title: "Stay with the outcome",
            body: "The outcome is that a coworker can use the shared project, so stay with that rather than drawing screens.",
          },
          {
            type: "prose",
            paragraphs: [
              "Take this wish: “We should let people share a project with a coworker.” Groom it by writing Intention and three acceptance criteria, then list the questions that would still need answers before Ready: permissions, email, what “share” means, what the coworker can do. Fifteen minutes is enough to start.",
            ],
          },
          {
            type: "desk",
            title: "When you write this work down, it lives here",
            items: [
              { name: "Product brief", file: "product/brief.md", note: "Frontmatter holds the shared product story (product, problem, audience, goals, non-goals, success metrics, current focus); the body expands with context and links only." },
              { name: "Roadmap", file: "product/roadmap.md", note: "Themes, what we are doing now, what is next, what can wait, and what we are not planning." },
              { name: "Backlog notes", file: "product/backlog.md", note: "A working copy of the board columns; the tickets themselves still live on the board." },
              { name: "Metrics", file: "product/metrics.md", note: "The numbers you claimed, and the current read." },
              { name: "Insights", file: "product/insights.md", note: "What you are hearing, and what it implies for the backlog." },
              { name: "Personas / competitive / experiments", file: "product/…", note: "Who it is for, alternatives, bets you are running. Use them when you have something true to say." },
              { name: "Feature note (optional)", file: "product/specs/<feature>.md", note: "Background for a larger change; the Ready ticket is still the contract." },
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can do this role when",
            body: "You can turn a vague wish into a groomed card, say what is still missing for Ready, refuse a parent ticket you cannot close, and use the Agent to help you say what we are building, why, how we will know, and what is out of scope from the pages you wrote.",
          },
        ],
      },
      {
        id: "project-manager",
        title: "Project Manager",
        duration: "70–85 min",
        role: "project-manager",
        source: "agents/project-manager.md",
        here: "Ready",
        blocks: [
          { type: "visual", name: "sequence" },
          {
            type: "prose",
            paragraphs: [
              "The Project Manager decides the order of Ready work and keeps delivery visible. They say what is in flight, what is stuck, what is next, and which assumptions are about to become a problem.",
              "They name couplings so a builder does not start a card that cannot finish, and they write that order on the plan and status pages. Ask the Agent any time to read those pages with you.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask the Agent anytime",
            body: "The Agent can open the plan, status, risks, and the board with you whenever you want those four answers, and whenever you want help writing the next page. How to use those asks, and which events and skills to pair with them, is Course 3.",
          },
          {
            type: "heading",
            text: "What this role does",
          },
          {
            type: "list",
            items: [
              "Put Ready tickets in an order a builder can run without inventing the next step.",
              "Keep in-flight work short enough that something can actually land.",
              "Name the couplings: this ticket cannot start until that one lands.",
              "Write what is true this week: in flight, stuck, next, and who we need.",
              "Keep delivery risks, open issues, and the assumptions we are betting on as live posture.",
              "Say who picks up when a ticket lands.",
              "When five or more related tickets share a fate, group them under a host milestone.",
            ],
          },
          {
            type: "heading",
            text: "The plan is the order",
          },
          {
            type: "prose",
            paragraphs: [
              "The Product Owner’s roadmap says what we are doing now, what comes next, and what can wait. Your plan is narrower: the order of Ready work the team will actually run.",
              "That only works if the current list is short enough to sequence. A “now” list of twelve bets is a wish list; you cannot put twelve cards first.",
              "The plan names the objective, what is in scope for this stretch, the sequence, the couplings, and the handoffs. When the story changes, you rewrite the page rather than appending last month’s order underneath.",
            ],
          },
          {
            type: "table",
            headers: ["The plan must say", "What that means"],
            rows: [
              ["Objective", "The stretch of work this sequence is for, in one concrete result."],
              ["In scope", "Which Ready tickets (or soon-Ready) belong in this order, and the boundary."],
              ["Sequence", "The order a builder should pick: one next card, then the one after."],
              ["Dependencies", "Ticket-to-ticket couplings: this cannot start until that lands."],
              ["Handoffs", "Who picks up when a ticket lands: QA, Security, a follow-on card, Release."],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Current state only",
            body: "The plan, the status, and the risk page describe what is true now; they are not a diary of how the week felt. When a card lands or a blocker clears, you change the page rather than appending a history of feelings.",
          },
          {
            type: "heading",
            text: "Sequence: one next thing",
          },
          {
            type: "prose",
            paragraphs: [
              "Starting every Ready ticket at once is how nothing finishes: each card waits on another card, or on a review that never gets a turn.",
              "In flight should be few, next should be one card a builder can pick without asking which one you meant, and everything else waits, even when it is Ready.",
              "Keep the password-reset story from the Product Owner page. Before that ticket can be honest, someone has to prove we can send mail. Share-a-project can wait; it has no coupling to mail.",
            ],
          },
          {
            type: "example",
            title: "Example: a sequence",
            lines: [
              "Objective",
              "Signed-out visitors stop emailing support to get back into their account.",
              "",
              "In scope",
              "Mail spike, then password reset. Share-a-project waits.",
              "",
              "Sequence",
              "1. #12 Prove we can send mail",
              "2. #18 Password reset (after #12)",
              "3. #24 Share a project (no coupling; waits)",
              "",
              "Dependencies",
              "#18 cannot start until #12 lands.",
              "",
              "Handoffs",
              "#18 → QA walks the reset path. Security looks at the token expiry.",
            ],
          },
          {
            type: "heading",
            text: "This ticket waits on that ticket",
          },
          {
            type: "prose",
            paragraphs: [
              "A coupling is a fact about order: password reset cannot start until we have proven we can send mail. Write that on the plan so nobody “helpfully” starts the reset and then sits in a pull request that cannot be verified.",
              "If two tickets have no coupling, say so, because parallel work is allowed and invisible work is the problem. Reference the board issue ids rather than inventing a second numbering system on the plan.",
            ],
          },
          {
            type: "callout",
            tone: "warn",
            title: "“Dependencies” means two different things",
            body: "Here it means “this ticket cannot start until that one lands.” Security uses the same English word for npm and pip and last week’s CVE. Mix them up and the wrong person will try to fix the wrong fire.",
          },
          {
            type: "heading",
            text: "Status is what is true this week",
          },
          {
            type: "prose",
            paragraphs: [
              "Once a week you write the delivery truth: a short summary, what is in flight, what is blocked, what is next, and the asks (decisions or unblocks you need from someone).",
              "Finished work comes off the page, and so do cleared blockers. The board is the source of truth; if memory says a card is in flight and the board says it is Done, you correct the page.",
            ],
          },
          {
            type: "example",
            title: "Example: the same week, as status",
            lines: [
              "Summary",
              "Mail spike is in flight; reset is Ready but blocked on mail; share waits.",
              "",
              "In flight",
              "#12 Prove we can send mail (In Progress)",
              "",
              "Blockers",
              "#18 waits on #12 (no mail sender yet)",
              "",
              "Next up",
              "#18 Password reset, once #12 lands",
              "",
              "Asks",
              "Does the existing mail sender work from this environment? Still unknown.",
            ],
          },
          {
            type: "heading",
            text: "Risks, issues, and assumptions",
          },
          {
            type: "prose",
            paragraphs: [
              "Weekly you also look at what could break the sequence. The words are easy to mash together, so keep them separate.",
            ],
          },
          {
            type: "table",
            headers: ["Word", "Means"],
            rows: [
              ["Risk", "It might still happen, and it would change the sequence or the date."],
              ["Issue", "It is already happening: a blocker that has arrived."],
              ["Dependency", "A ticket-to-ticket coupling that is still live."],
              ["Assumption", "We are proceeding as if this is true. If it is false, the plan moves."],
            ],
          },
          {
            type: "prose",
            paragraphs: [
              "This page is live posture: when a risk dies or an issue clears, delete the row rather than writing “mitigated on Tuesday.”",
            ],
          },
          {
            type: "example",
            title: "Example: the same week, as risks",
            lines: [
              "Risks",
              "If the existing mail sender cannot send from this environment, reset slips a week.",
              "",
              "Issues",
              "None.",
              "",
              "Dependencies",
              "#18 blocked on #12.",
              "",
              "Assumptions",
              "The existing mail vendor stays; we will not add a second one.",
            ],
          },
          {
            type: "heading",
            text: "Who picks up when a ticket lands",
          },
          {
            type: "prose",
            paragraphs: [
              "A handoff is the next person after the builder: QA walks the acceptance criteria, Security looks at the token, and Release waits on a cluster that was supposed to be a version. Name that, or the card lands and sits.",
              "Write the handoff on the plan while the sequence is still cheap to change, because discovering it in the pull request is how review becomes a holding pen.",
            ],
          },
          {
            type: "heading",
            text: "A milestone is a cluster",
          },
          {
            type: "prose",
            paragraphs: [
              "When five or more related tickets share a fate, group them under a milestone on the host (GitHub or GitLab). That is a label on the cluster, so the tickets stay finishable and the cluster still has a name, rather than opening a parent ticket you cannot close.",
              "Memory only projects what the host already knows: active, upcoming, slipped. Slipped is a temporary shelf: re-date the cluster into upcoming, or drop it if the work is abandoned.",
              "When you check a milestone you make a call: we met it, it is at risk, or it slipped. Scope and priority cuts go back to the Product Owner; you do not rewrite the product story from the plan.",
            ],
          },
          {
            type: "heading",
            text: "When you show up",
          },
          {
            type: "table",
            headers: ["When", "What you are doing"],
            rows: [
              ["Weekly — status", "Write what is in flight, blocked, next, and who we need, and leave the page alone if nothing material changed."],
              ["Weekly — risk", "Keep live posture: add what is true, delete what is no longer live, and touch the plan only when risk changes the sequence."],
              ["Every other week — plan", "Reshuffle the sequence now that Ready work exists, and rewrite the page rather than appending last fortnight’s order."],
              ["When a cluster was supposed to mean something", "Milestone call: met, at risk, or slipped; close or re-date the host milestone to match."],
              ["When the board and the plan disagree", "Update the plan, because the board is the source of truth; memory is a projection we correct."],
            ],
          },
          {
            type: "heading",
            text: "How this work meets the rest of the team",
          },
          {
            type: "prose",
            paragraphs: [
              "The Product Owner decides what we are building, and you say whether the current list can actually be sequenced. If it cannot, that is a product cut, and it goes back to them.",
              "When a Ready outcome might force a new kitchen layout, the Architect says so, and sometimes the next step is a spike so the feature ticket can be honest. They also say when the order is forced by the line: you cannot ship B before the interface A creates.",
              "The Engineer takes the next Ready card in the sequence, rather than the most interesting one; extra scope is still a product decision.",
              "QA and Security are the handoff after the pull request exists, and Release cares when a milestone was supposed to be a version.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "callout",
            tone: "note",
            title: "Stay with the order",
            body: "The job is a sequence the team can run, so stay with couplings and blockers rather than rewriting the tickets.",
          },
          {
            type: "prose",
            paragraphs: [
              "Take three cards that follow the Product Owner page: prove we can send mail, password reset, and share a project with a coworker. Write the sequence, name the one coupling, and write a status for the week the mail spike is still open. Ten minutes is enough to start.",
            ],
          },
          {
            type: "desk",
            title: "When you write this work down, it lives here",
            items: [
              { name: "Plan", file: "project/plan.md", note: "The execution story: objective, in scope, sequence, couplings, handoffs." },
              { name: "Status", file: "project/status.md", note: "What is true this week: summary, in flight, blockers, next, and the asks." },
              { name: "Delivery risks", file: "project/risks.md", note: "Live posture: risks, issues, ticket couplings, assumptions. Delete what is no longer true." },
              { name: "Milestones", file: "project/milestones.md", note: "A projection of host milestones when five or more related tickets share a fate." },
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can do this role when",
            body: "You can put three Ready tickets in an order, name the one coupling, write a status for the week something is stuck, refuse a parent ticket you cannot close in favor of a host milestone, and use the Agent to help you say what is in flight, what is blocked, what is next, and what is at risk from the pages you wrote.",
          },
        ],
      },
      {
        id: "architect",
        title: "Architect",
        duration: "40–50 min",
        role: "architect",
        source: "agents/architect.md",
        here: "Refinement",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "The Architect owns how the system is shaped: a current picture of the parts, what must not break, how those parts talk, and which decisions are already locked.",
              "They review that picture every other week, and when a Ready outcome would force a new kitchen layout they say so before the line starts cooking. When the team does not yet know enough to write an honest feature ticket, they run a short investigation (a spike).",
              "The station rules stay current because they update them when the kitchen actually changes.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask the Agent anytime",
            body: "The Agent can open the overview, constraints, interfaces, and decisions with you whenever you want to say what the system looks like, what must not break, and which decisions are locked. How to use those asks, and which events and skills to pair with them, is Course 3.",
          },
          {
            type: "desk",
            title: "Documents this role keeps current",
            items: [
              { name: "System overview", file: "architecture/overview.md", note: "The map: parts, data, where it lives." },
              { name: "Constraints", file: "architecture/constraints.md", note: "Hard no, soft no, and out of bounds." },
              { name: "Interfaces", file: "architecture/interfaces.md", note: "What talks to what, and who owns the seam." },
              { name: "Decisions", file: "architecture/decisions.md", note: "The one file allowed to keep history." },
              { name: "Structural risks", file: "architecture/risks.md", note: "Coupling, migrations, the stations that already sag." },
            ],
          },
        ],
      },
      {
        id: "engineer",
        title: "Engineer",
        duration: "45–60 min",
        role: "engineer",
        source: "agents/engineer.md",
        here: "In Progress",
        blocks: [
          { type: "visual", name: "board", here: "Doing" },
          {
            type: "prose",
            paragraphs: [
              "The Engineer implements a Ready ticket that is marked for an agent. They write the code and tests, open a pull request, and keep the branch current while review happens.",
              "They claim In Progress so nobody else starts the same ticket. After the pull request exists they wait for the checks, then move the card to In Review when those checks are green (or when the host has no checks, which they say out loud), and they leave the merge to a human.",
              "One short page of what is in flight is enough, because the code, the ticket, and the pull request are the source of truth.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask the Agent anytime",
            body: "The Agent can open the ticket and the pull request with you whenever you want to say what is in progress and what is left to clear. How to use those asks, and which events and skills to pair with them, is Course 3.",
          },
          {
            type: "desk",
            title: "Documents this role keeps current",
            items: [
              { name: "In flight", file: "engineering/in-flight.md", note: "Optional projection for other rituals; implement-ticket uses the board and PR only." },
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "They start only when it is Ready",
            body: "Refinement is still shaping, so it is the wrong moment to start building. “Human-ready” means a person should build it, because that card is the wrong kind of work for an agent. A brief that still has open questions is a request for another conversation rather than a request for code.",
          },
        ],
      },
      {
        id: "quality-assurance",
        title: "Quality Assurance",
        duration: "40–50 min",
        role: "quality-assurance",
        source: "agents/quality-assurance.md",
        here: "In Review",
        blocks: [
          { type: "visual", name: "review" },
          {
            type: "prose",
            paragraphs: [
              "Quality Assurance checks that the change matches the ticket. They walk the acceptance criteria, look a little off the happy path, and either approve the work or send it back with a clear note.",
              "This happens in In Review, and before a release they also re-check the wider product. If they fail the change, the card stays In Review; Done means the change was accepted.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask the Agent anytime",
            body: "The Agent can open the In Review board column and the PR with you whenever you want to say what is waiting, what is blocking approve, and what was sent back. How to use those asks, and which events and skills to pair with them, is Course 3.",
          },
          {
            type: "desk",
            title: "Documents this role keeps current",
            items: [
              { name: "QA queue", file: "qa/queue.md", note: "Optional projection for release-wide rituals; validate-ticket uses the board and PR comment only." },
              { name: "Findings", file: "qa/findings.md", note: "Open problems only; when it is fixed, delete it." },
              { name: "Test plan", file: "qa/test-plan.md", note: "How we intended to check this, and what we skipped." },
            ],
          },
        ],
      },
      {
        id: "security",
        title: "Security",
        duration: "45–60 min",
        role: "security",
        source: "agents/security.md",
        here: "In Review",
        blocks: [
          { type: "visual", name: "gates" },
          {
            type: "prose",
            paragraphs: [
              "Security decides whether a change is safe to put in front of people. They review at the same In Review gate as QA; both have to approve before the change merges.",
              "They also look when there is no pull request: a monthly check of what we depend on, a review of a station that never got a ticket, and a last look before a plate goes to the table.",
              "Once a month they also check the lockfile and the real package manifests.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask the Agent anytime",
            body: "The Agent can open the threat model, findings, and checklist with you whenever you want to say whether a change is safe, what is open, and what is blocking a security OK. How to use those asks, and which events and skills to pair with them, is Course 3.",
          },
          {
            type: "desk",
            title: "Documents this role keeps current",
            items: [
              { name: "Threat model", file: "security/threat-model.md", note: "What we protect, and where trust ends." },
              { name: "Findings", file: "security/findings.md", note: "Open issues; when it is fixed, delete it." },
              { name: "Checklist", file: "security/checklist.md", note: "Secrets, dependencies, who can do what, data, defaults." },
            ],
          },
        ],
      },
      {
        id: "release-manager",
        title: "Release Manager",
        duration: "35–45 min",
        role: "release-manager",
        source: "agents/release-manager.md",
        here: "Release",
        blocks: [
          { type: "visual", name: "ship" },
          {
            type: "prose",
            paragraphs: [
              "The Release Manager gets merged work to users. After a ticket is Done, they own the version, the checklist, the notes, and how we would undo the release.",
              "They prepare, then cut; a release is planned, and the checklist is this project’s checklist: you write the gates that mean ready for the table.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask the Agent anytime",
            body: "The Agent can open the checklist, notes, and release status with you whenever you want to say what version we are cutting and whether the release is blocked. How to use those asks, and which events and skills to pair with them, is Course 3.",
          },
          {
            type: "desk",
            title: "Documents this role keeps current",
            items: [
              { name: "Release checklist", file: "release/checklist.md", note: "Version, pre-ship, gates, how we publish, how we undo." },
              { name: "Release notes", file: "release/notes.md", note: "What changed, what breaks, what to do after." },
              { name: "Release status", file: "release/status.md", note: "Is this release blocked, ready, or already out?" },
            ],
          },
        ],
      },
      {
        id: "marketing-manager",
        title: "Marketing Manager",
        duration: "35–45 min",
        role: "marketing-manager",
        source: "agents/marketing-manager.md",
        here: "Told the world",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "The Marketing Manager owns how the project shows up in the world: who we are talking to, what we are willing to claim, and a queue of posts that does not start from zero every Monday.",
              "They keep a voice so announcements sound like the same project, and when something actually ships they announce what shipped.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask the Agent anytime",
            body: "The Agent can open positioning, messaging, voice, and the social queue with you whenever you want to say who we are talking to, what we claim, and what is ready to announce. How to use those asks, and which events and skills to pair with them, is Course 3.",
          },
          {
            type: "desk",
            title: "Documents this role keeps current",
            items: [
              { name: "Positioning", file: "marketing/positioning.md", note: "Who it is for, the promise, the proof." },
              { name: "Messaging", file: "marketing/messaging.md", note: "The words we use, and the ones we will not." },
              { name: "Voice", file: "marketing/voice.md", note: "How we sound when we are ourselves." },
              { name: "Social queue", file: "marketing/social-queue.md", note: "Ready, needs work, and holding; published posts come off this list." },
            ],
          },
        ],
      },
      {
        id: "tabletop",
        title: "One ticket, one release",
        duration: "50–60 min",
        source: "agents/*.md",
        blocks: [
          { type: "visual", name: "loop" },
          {
            type: "prose",
            paragraphs: [
              "Stand up, pick one coarse wish, and walk it from the icebox to the announcement. At each column, say who speaks, what page would change, and who is supposed to keep their hands off.",
              "If the room cannot do that yet, stay here, because Course 2 is how this team runs the same story in software and it will not make sense if the story itself is still fuzzy.",
            ],
          },
          { type: "path", here: null },
          {
            type: "table",
            headers: ["When the card is here", "Who leans in", "What has to be true"],
            rows: [
              ["Grooming", "Product Owner", "We know the outcome and how we will know."],
              ["Refinement → Ready", "Product Owner", "The issue is a contract with exactly one readiness label."],
              ["Plan / shape", "PM and Architect", "The order is possible, and the kitchen can still run service."],
              ["In Progress", "Engineer", "The ticket was Ready, a PR exists, and the checks are honest."],
              ["In Review", "QA and Security", "Both approve, the command auto-merges, and a pass-back stays In Review."],
              ["Release", "Release Manager", "We can name the version and the undo."],
              ["Told the world", "Marketing", "The words match what actually shipped."],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You are ready for Course 2 when",
            body: "Someone can point at a column and you can say who acts, what “done” means, and when you would refuse to approve because you do not understand it yet.",
          },
        ],
      },
    ],
  },
  {
    id: "using-forge",
    title: "Using Forge",
    kicker: "Course 2 · required",
    subtitle: "The same lifecycle. Now you run the rituals.",
    requires: "agentic-sdlc",
    sessions: [
      {
        id: "orient",
        title: "Judging the hand-off",
        duration: "40–50 min",
        source: "commands/forge.help.md",
        blocks: [
          { type: "visual", name: "handoff" },
          {
            type: "prose",
            paragraphs: [
              "Forge is a Cursor plugin, but the important picture is simpler: you are the parent of the ritual. A command calls the roles. They propose. They do not ship. When there is a fork, you answer Questions first — a picker when Cursor offers one, or the same list in chat when it does not. Each question is one decision; its letters are options to that decision, with (Recommended) on the first. After answers (or when there was nothing to ask), you read the apply-set — intent, files, remote actions, what they left alone — and you talk until that set is right. Only then do you approve.",
              "Ask the Agent any time: between rituals, mid-sentence, or when a page is half-written. /forge.help just looks and does not write, so start there when the map goes fuzzy.",
            ],
          },
          {
            type: "list",
            title: "How you reply at every pause",
            items: [
              "Questions phase — pick one option per named question (Recommended is the default if you want it), or say Other / describe a different idea. Nothing is written yet. Independent forks are separate questions, not one flat A/B/C list.",
              "approve all — Apply exactly the memory and remote actions on the apply-set screen. Last word. Only valid when Questions is None.",
              "approve subset — Apply only the lines you name from that set. Still an Apply; still this proposal, just smaller.",
              "reject — Apply nothing and end the event.",
              "Anything else on the apply-set — a new idea or freeform steer. That is a redirect: the Agent reshapes (and may ask Questions again). Nothing is written until you approve a set you have seen.",
            ],
          },
          {
            type: "prose",
            paragraphs: [
              "Picture a grooming pass where the board is empty. The Agent asks one question — Hold, Live maturity slice, or polish — with Hold marked (Recommended). You pick Hold (or another letter). Then the apply-set appears with Questions: None, often memory-only and vendor none. approve all ships that Hold. If you change your mind after seeing the set, say what to change; the Agent comes back with a new hand-off. You do not approve a direction you have not seen as an apply-set.",
            ],
          },
          {
            type: "list",
            title: "The ways a ritual can pause",
            items: [
              "observe — just telling you (help).",
              "propose — a draft; nothing moves unless you say so.",
              "approve-before-write — pause before memory changes.",
              "approve-before-vendor — pause before GitHub, GitLab, or the calendar.",
              "auto-apply — implement-ticket and validate-ticket: no pause; SCM only.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Try it",
            body: "Run /forge.help. See whether you can name the super-repo, the code submodule, and the memory-repo — or honestly say they are unresolved. Do not invent a folder to silence the error. That creates a second source of truth.",
          },
        ],
      },
      {
        id: "stand-up",
        title: "Code repository and memory repository",
        duration: "50–60 min",
        source: "commands/forge.init-project.md",
        blocks: [
          { type: "visual", name: "repos" },
          {
            type: "prose",
            paragraphs: [
              "The rituals you type live in a Cursor plugin at ~/.cursor/plugins/local/forge-cursor. Forge Studio (the VS Code / Cursor extension) clones that repo on first launch and fast-forwards it when origin moves; Command Palette → Forge: Sync Cursor Plugin does the same on demand. Command Palette → Forge: Open Forge Course serves this workshop from that clone and opens a browser tab. Reload the window after the files change.",
              "The code lives in a git submodule, with the usual branches and pull requests. The agents’ notes live in a second submodule at .ai/memory, on main only — no feature branches, no PRs on that repo. Memory is a projection of the board, not a second product.",
              "Every real ritual starts the same way: find the paths, pull memory’s main, read forge.json. If that fails, stop. Guessing the submodule is how you write someone else’s project. Two exceptions skip the memory pull: /forge.implement-ticket and /forge.validate-ticket run on the board and the PR only.",
              "A super-repo can hold several code submodules. Each one set up for Forge has its own forge.json and its own board under .ai/memory/<that path>/. The command binds to the one it resolved; remaining configured projects wait for their own invocation.",
              "Standing up: add the memory submodule, run /forge.init-project, approve the first brief and the empty pages, let it push main. Icebox is fine. Refining tickets on day one is not.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "One ritual, one project",
            body: "If you keep three Forge projects, you run the same command three times: stand in that submodule, or pass --submodule. Each run has its own hand-off, because the Agent does not tour the workspace for you.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "If the memory repository is missing",
            body: "Do not tuck memory under the code. Do not run init if .ai/memory is missing from .gitmodules. Add the submodule first, then come back.",
          },
        ],
      },
      {
        id: "po-flow",
        title: "Grooming and refinement",
        duration: "50–60 min",
        source: "commands/forge.backlog-grooming.md",
        blocks: [
          { type: "visual", name: "groom" },
          {
            type: "prose",
            paragraphs: [
              "You already know this story. Here it is as two commands. Once a week, /forge.backlog-grooming takes a wish and makes the outcome and the test of success visible, then parks the card on Refinement. When you are actually ready to let go, /forge.refinement writes the full contract into the issue and moves it to Ready with one label: for an agent, or still for a human.",
              "Each command grooms or refines the project it resolved — the folder you are standing in, or the submodule you named. Three configured projects means three grooming runs, then three refinement runs, each with its own hand-off.",
              "Judge the hand-off the same way Course 2 taught you: talk until the apply-set is right, then approve. If a groom is secretly an epic, redirect and reshape. If Open questions is not None, it is not Ready. The board is the truth; memory just points at the issue.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Try it",
            body: "Groom one outcome. Refine it to Ready and ai-ready. Read the issue as if the builder cannot ask you follow-up questions.",
          },
        ],
      },
      {
        id: "delivery-shape",
        title: "Plan, risk, and architecture",
        duration: "40–50 min",
        source: "commands/forge.plan-refresh.md",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "These rituals do not move a single ticket, and they still matter. Weekly, the PM looks at status and delivery risk. Every other week they reshuffle the plan if Ready work has piled up, and the Architect reviews the system shape. A spike is a short investigation when the team does not yet know enough to write a feature ticket. The Product Owner’s roadmap review asks whether the current bets are still the right ones.",
              "When you approve, approve the pages that should change. Practice saying “leave that alone” out loud. Most of the mess in memory is someone “helpfully” rewriting a file that was fine.",
            ],
          },
        ],
      },
      {
        id: "implement",
        title: "Build the ticket you were handed",
        duration: "50–60 min",
        source: "commands/forge.implement-ticket.md",
        blocks: [
          { type: "visual", name: "board", here: "Doing" },
          {
            type: "prose",
            paragraphs: [
              "/forge.implement-ticket will not start unless the card is Ready and marked for an agent. It claims In Progress right away, opens the PR, waits for CI, and moves to In Review when those checks succeeded — or when the host has no CI, which you should treat as a fact. There is no hand-off and no memory write; the board and the PR are the trail. /forge.respond-to-review is the conversation until the change is ready to re-gate. Neither command merges. Merge comes from /forge.validate-ticket after QA and Security both approve.",
              "Read the diff against the issue, not against your hope. Extra scope is not a gift. Tests should be able to fail the acceptance criteria. New packages you do not recognize are a question, not a flourish.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Try it",
            body: "Implement one ai-ready ticket. When the PR is up, wait. Impatience is not a column. Then take the first review comment through respond-to-review.",
          },
        ],
      },
      {
        id: "validate",
        title: "QA and Security both approve",
        duration: "45–55 min",
        source: "commands/forge.validate-ticket.md",
        blocks: [
          { type: "visual", name: "gates" },
          {
            type: "prose",
            paragraphs: [
              "/forge.validate-ticket is the acceptance and safety gate. QA leads; Security reviews beside them. A PASS or FAIL goes on the PR in words someone else could read next week. If both approve, the command merges, deletes the branch, and moves the card to Done — no second approval, no memory queue. If anyone fails it, the FAIL comment is the trail and the card stays In Review.",
              "If you cannot explain the change, you do not approve it. “Looks fine” is not a review.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Try it",
            body: "Validate a real In Review PR. Write the PASS or FAIL as if you will not be there to interpret it.",
          },
        ],
      },
      {
        id: "recurring",
        title: "Monthly dependency audit",
        duration: "45–55 min",
        source: "commands/forge.dependency-audit.md",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Every language eventually invents the same object: a lockfile. npm writes down the tree it actually installed. Python does it with a lock and an environment. You do not need the resolver’s autobiography. You need to know the lock is what we run, and that agents often edit the shopping list, skip the receipt, or invent a shop that does not exist.",
              "/forge.dependency-audit is Security, once a month. It reads the real manifests, proposes findings, maybe touches the Dependencies row on the checklist, and recommends upgrades. It does not quietly bump versions. If something should change in the code, that is a ticket for the Engineer after you say so.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Try it",
            body: "Run the audit. For each finding, say whether it is a real risk, noise, or a hallucination. Approve a subset. Do not Apply a bump in this ritual.",
          },
        ],
      },
      {
        id: "ship",
        title: "Prepare and cut a release",
        duration: "40–50 min",
        source: "commands/forge.prepare-release.md",
        blocks: [
          { type: "visual", name: "ship" },
          {
            type: "prose",
            paragraphs: [
              "Prepare is the check before you ship: version, notes, blockers, and how you would undo it. Cut creates the tag and the host release — and if your organization wants a human on the last button, that human is still you. Launch comms wait until the announcement matches what actually shipped. A retro waits until you can say whether it mattered.",
              "Gates in forge.json are this project’s pass checklist, in order. Empty gates are a missing definition of “ready for the table,” rather than a license to ship harder.",
            ],
          },
        ],
      },
      {
        id: "operator",
        title: "When it gets stuck",
        duration: "35–45 min",
        source: "skills/forge/resolve-paths/SKILL.md",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Most hard stops are the same three: you are not in the super-repo, you did not say which submodule, or memory was never added as a submodule. Pull memory’s main at the start of a ritual; push main only after you Apply.",
              "The command picks a project this way: you passed --submodule, or your folder is already inside one code submodule, or there is only one code submodule to choose. Anything else stops and lists the paths rather than guessing or looping the rest.",
              "Calendar meetings are optional, harness-wide, and they never start the work for you. One meeting set covers every Forge project you manage; when the slot starts, run that command once per project.",
              "When the map blurs, /forge.help. When you are about to Apply, tell the story in Course 1 words first — who, what, why, when — and only then press the button.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You are ready for Course 3 when",
            body: "You can take a repo you did not write through init, groom, refine, implement, and validate, and you can explain each pause in plain language before you Apply. Course 3 is the station book: which events you lead, which skills you load, and how you use them for the work this role actually does.",
          },
        ],
      },
    ],
  },
  {
    id: "role-playbooks",
    title: "Role playbooks",
    kicker: "Course 3 · required",
    subtitle: "Events you attend, skills you can call, and how to use them for the work this role actually does.",
    requires: "using-forge",
    sessions: [
      {
        id: "playbook-how",
        title: "How a playbook works",
        duration: "20–30 min",
        source: "agents/*.md",
        blocks: [
          { type: "visual", name: "kit" },
          {
            type: "prose",
            paragraphs: [
              "Course 1 told you who stands at which station. After that, Using Forge taught you that a ritual proposes, you talk until the apply-set is right, then you Apply. This course is the book on the station: which events you run, which skills the Agent loads, and what to ask between rituals.",
              "The pages that follow are the same eight roles you already know, written as a kit rather than a job description, with three kinds of tool for the same work.",
            ],
          },
          {
            type: "heading",
            text: "Events",
          },
          {
            type: "prose",
            paragraphs: [
              "An event is a slash command with a cadence: /forge.backlog-grooming every week, /forge.implement-ticket when a card is Ready and marked for an agent. You either lead it (your role owns the hand-off) or you attend (another role leads; you still get spawned and you still propose). One invocation binds to one code submodule; if you keep several Forge projects, you run the event once for each.",
              "The schedule lives on the agent file. If this page and that file disagree, the agent file and the command win.",
            ],
          },
          {
            type: "heading",
            text: "Skills",
          },
          {
            type: "prose",
            paragraphs: [
              "A skill is a procedure the Agent loads when that event, or your ask, needs it: groom-ticket writes Intention and acceptance criteria, and agent-ready-ticket writes the full Ready contract. You name the skill that already exists under skills/<role>/ rather than inventing a second procedure. Those procedures assume the event already picked a project; they shape that board and that memory tree.",
              "Vendor skills (issues, pulls, CI) are shared machinery. They show up inside events; each role kit stays the skills listed on that agent file.",
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "prose",
            paragraphs: [
              "Between rituals you can still talk to the Agent: ask it to read the pages this role keeps current, or to help write the next page. Those are the same skills, used when there is no cadence on the calendar.",
              "Course 1 already named those asks; this course pairs them with the event you would run if the work is big enough to need a ritual.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You still judge",
            body: "Lead or attend, the Agent still proposes. You still answer Questions when they appear, then talk until the apply-set is right, then approve all or approve subset — or reject, or redirect with a freeform steer — the same way Course 2 taught you.",
          },
          {
            type: "heading",
            text: "Lead versus attend",
          },
          {
            type: "table",
            headers: ["You are…", "What that means"],
            rows: [
              ["Lead", "The command names your role as Lead. You own the hand-off shape. On a conflict between spawned roles, you win unless the command says otherwise."],
              ["Attend", "Another role leads, and you still propose from your pages and skills without rewriting their contract."],
              ["Required peer", "Same room: QA and Security on /forge.validate-ticket. Either domain can fail the change; dual approve auto-merges."],
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Pick the role you will inhabit first. On that page, find one event you lead and one you only attend. Name the skill you would load for a goal you already have.",
            ],
          },
        ],
      },
      {
        id: "playbook-product-owner",
        title: "Product Owner",
        duration: "40–50 min",
        role: "product-owner",
        source: "agents/product-owner.md",
        here: "Grooming",
        blocks: [
          { type: "visual", name: "groom" },
          {
            type: "prose",
            paragraphs: [
              "What we are building and why is already the job. Here the events you lead write the brief, the roadmap, and the tickets, and the skills are how the Agent does that writing. Between rituals you ask it to read those pages with you.",
            ],
          },
          {
            type: "heading",
            text: "Events you lead",
          },
          {
            type: "table",
            headers: ["Cadence", "Command", "What you are doing"],
            rows: [
              ["On demand", "/forge.init-project", "First brief and a first-pass roadmap. Icebox is fine on day one; refining tickets into Ready is work for later."],
              ["Weekly", "/forge.backlog-grooming", "Turn a wish into Intention and acceptance criteria. Land the card in Refinement."],
              ["On demand", "/forge.refinement", "Write the full Ready contract into the issue. One label: ai-ready or human-ready."],
              ["Weekly", "/forge.feedback-triage", "Promote a comment toward a ticket or Now, park it in the icebox, or drop it."],
              ["Weekly", "/forge.stakeholder-sync", "Say what is still true and what changed. Get decisions out of hallway chat."],
              ["Every other week", "/forge.metrics-review", "Read the numbers you claimed would move, and say so when they did not."],
              ["Every other week", "/forge.roadmap-review", "Check whether the current bets are still the right ones. Rewrite Now / Next / Later in place."],
              ["Monthly", "/forge.discovery", "Go looking on purpose: problems, alternatives, where we win and lose."],
              ["Monthly", "/forge.competitive-scan", "Update the competitive page. Change the brief or roadmap only when a bet actually moves."],
              ["Per release", "/forge.launch-readiness-check", "Go, no-go, or ship-with-exceptions. The launch words have to match the outcome you asked for."],
              ["Per release", "/forge.outcomes-retro", "Did the outcome happen? Fold the learning into insights and the next roadmap."],
            ],
          },
          {
            type: "heading",
            text: "Events you attend",
          },
          {
            type: "table",
            headers: ["Command", "Who leads", "What you bring"],
            rows: [
              ["/forge.design-spike", "Architect", "Scope: is this still one ticket, or did the spike change the bet?"],
              ["/forge.prepare-release", "Release Manager", "Does the version story match the outcome you asked for?"],
              ["/forge.messaging-refresh", "Marketing", "Do the words we use still match the brief?"],
            ],
          },
          {
            type: "heading",
            text: "Skills you can load",
          },
          {
            type: "table",
            headers: ["Skill", "Reach for it when"],
            rows: [
              ["problem-framing", "The brief is fog: problem, who it is for, what success looks like."],
              ["outcome-definition", "You need Intention or Outcome in one concrete result."],
              ["groom-ticket", "Weekly grooming: Intention + acceptance, then stop at Refinement."],
              ["requirements-writing", "Refinement: expand the brief into a self-contained Ready body."],
              ["agent-ready-ticket", "The Ready gate: full contract, Open questions is None, one readiness label."],
              ["scope-control", "Someone is about to add a second product in the margins."],
              ["prioritization", "Now is too long, or two cards both want to be first."],
              ["roadmapping", "Themes, Now, Next, Later, Not planning need a rewrite."],
              ["discovery", "Monthly looking: problems and alternatives, which is a different job from writing a feature list."],
              ["feedback-synthesis", "Comments, metrics, and team noise have to become implications."],
              ["stakeholder-alignment", "A decision is still living in a hallway."],
              ["decision-hygiene", "The page is turning into a diary of how you argued."],
              ["launch-readiness", "Before a release: can we tell a true launch story?"],
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "list",
            items: [
              "Read the brief with me. Is current focus still a sentence we can say aloud?",
              "Here is a wish. Groom it: Intention and three acceptance criteria. List what is still missing for Ready.",
              "This Refinement card still has an open question. What would make Open questions None?",
              "Triage these comments: ticket, Now, icebox, or drop.",
              "Before we ship, walk launch-readiness against the outcome on the ticket.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Ask versus event",
            body: "A one-card groom can be an ask; a weekly pass over the icebox is /forge.backlog-grooming. That weekly pass is still one project. If the Agent would create or move issues, run the event so you get a hand-off you can approve.",
          },
          {
            type: "heading",
            text: "Common goals",
          },
          {
            type: "table",
            headers: ["You want", "Run", "Load"],
            rows: [
              ["A new project has a story", "/forge.init-project", "problem-framing, roadmapping, outcome-definition"],
              ["A wish becomes a groomed card", "/forge.backlog-grooming", "groom-ticket, outcome-definition, scope-control"],
              ["That card is a contract a builder can finish", "/forge.refinement", "requirements-writing, agent-ready-ticket"],
              ["The current bets are honest", "/forge.roadmap-review", "roadmapping, prioritization"],
              ["User noise becomes a decision", "/forge.feedback-triage", "feedback-synthesis"],
              ["We can tell a true launch story", "/forge.launch-readiness-check", "launch-readiness, scope-control"],
              ["We learn whether it mattered", "/forge.outcomes-retro", "outcome-definition, decision-hygiene"],
            ],
          },
          {
            type: "example",
            title: "Example: password reset, as a kit",
            lines: [
              "Goal: a signed-out visitor can get back in without emailing support.",
              "",
              "1. /forge.backlog-grooming + groom-ticket",
              "   Intention + three acceptance criteria. Open note: do we have mail?",
              "2. Architect may /forge.design-spike if mail is unknown.",
              "   You attend with scope-control: spike first, then the feature ticket.",
              "3. /forge.refinement + agent-ready-ticket",
              "   Outcome, Scope, AC, Out of scope, Constraints, Verification, Open questions: None.",
              "   Label: ai-ready (the work stays in the repo).",
              "4. After ship: /forge.outcomes-retro",
              "   Did support tickets about “I forgot my password” actually drop?",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Take “we should let people share a project with a coworker.” Name the event you would run this week, the skill you would load, and the event you would run only after the open questions are gone, which is enough work for fifteen minutes.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can work this station when",
            body: "You can name the events you lead, one you only attend, and which skill you would load to turn a wish into a groomed card versus a Ready contract.",
          },
        ],
      },
      {
        id: "playbook-project-manager",
        title: "Project Manager",
        duration: "40–50 min",
        role: "project-manager",
        source: "agents/project-manager.md",
        here: "Ready",
        blocks: [
          { type: "visual", name: "sequence" },
          {
            type: "prose",
            paragraphs: [
              "The kit here is narrower than the job: four events you lead, plus the product and ship rooms you attend so the sequence stays possible.",
            ],
          },
          {
            type: "heading",
            text: "Events you lead",
          },
          {
            type: "table",
            headers: ["Cadence", "Command", "What you are doing"],
            rows: [
              ["Weekly", "/forge.delivery-status", "Write what is in flight, blocked, next, and who we need. Leave the page alone if nothing material changed."],
              ["Weekly", "/forge.risk-review", "Keep live posture: add what is true, delete what is no longer live. Touch the plan only when risk changes the sequence."],
              ["Every other week", "/forge.plan-refresh", "Reshuffle the sequence now that Ready work exists. Rewrite the page; do not append last fortnight’s order."],
              ["Per milestone", "/forge.milestone-check", "Met, at risk, or slipped. Close or re-date the host milestone to match."],
            ],
          },
          {
            type: "heading",
            text: "Events you attend",
          },
          {
            type: "table",
            headers: ["Command", "Who leads", "What you bring"],
            rows: [
              ["/forge.init-project", "Product Owner", "A thin plan and milestone shelf so day one has an order, even if the order is “icebox.”"],
              ["/forge.backlog-grooming", "Product Owner", "Sequence and couplings when grooming changes what can start."],
              ["/forge.roadmap-review", "Product Owner", "Whether the current list can actually be sequenced. A cut goes back to them."],
              ["/forge.stakeholder-sync", "Product Owner", "Delivery truth: in flight, stuck, next."],
              ["/forge.implement-ticket", "Engineer", "Status only if you still keep an in-flight page for other rituals; implement itself writes board and PR only."],
              ["/forge.launch-readiness-check", "Product Owner", "Status and handoffs for the ship call."],
              ["/forge.outcomes-retro", "Product Owner", "Risks and milestones the release closed."],
            ],
          },
          {
            type: "heading",
            text: "Skills you can load",
          },
          {
            type: "table",
            headers: ["Skill", "Reach for it when"],
            rows: [
              ["work-planning", "The plan needs an objective, in-scope set, and a boundary."],
              ["sequencing", "Someone has to pick one next card, then the one after."],
              ["dependency-management", "This ticket cannot start until that one lands."],
              ["handoff-coordination", "QA, Security, or Release should already know they are next."],
              ["status-update", "The weekly truth: summary, in flight, blockers, next, asks."],
              ["risk-tracking", "Separate risk, issue, coupling, and assumption."],
              ["blocker-resolution", "An issue has arrived and the sequence has to move around it."],
              ["milestone-tracking", "Five or more related tickets share a fate on a host milestone."],
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "list",
            items: [
              "What is in flight, and does the board agree?",
              "Put these three Ready cards in an order. Name the one coupling.",
              "Write this week’s status as if I will paste it into a room that has not read the board.",
              "This card has been In Review for a week. Who was supposed to pick up?",
              "We have six tickets about onboarding. Do they need a host milestone?",
            ],
          },
          {
            type: "heading",
            text: "Common goals",
          },
          {
            type: "table",
            headers: ["You want", "Run", "Load"],
            rows: [
              ["The room knows what is true this week", "/forge.delivery-status", "status-update"],
              ["Ready work has an order", "/forge.plan-refresh", "work-planning, sequencing, handoff-coordination"],
              ["A coupling or a bet is about to break the date", "/forge.risk-review", "risk-tracking, blocker-resolution, dependency-management"],
              ["A cluster of five or more has a name", "/forge.milestone-check", "milestone-tracking"],
              ["Grooming just changed what can start", "/forge.backlog-grooming (attend)", "sequencing"],
            ],
          },
          {
            type: "example",
            title: "Example: mail, then reset, then share",
            lines: [
              "Goal: signed-out visitors stop emailing support.",
              "",
              "1. /forge.plan-refresh + sequencing",
              "   #12 prove mail, then #18 password reset, then #24 share waits.",
              "2. Weekly /forge.delivery-status while #12 is In Progress.",
              "   #18 is Ready and blocked: a coupling the plan already named.",
              "3. /forge.risk-review if the existing mail sender cannot send from here.",
              "   The date moves; you do not rewrite the product story.",
              "4. When #18 lands, handoff-coordination: QA walks the reset path;",
              "   Security looks at the token expiry.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Take the same three cards. Name the event you would run this week, the skill that writes the coupling, and the event you would attend when grooming adds a fourth card in front of mail.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can work this station when",
            body: "You can name the four events you lead, one you only attend, and which skill you would load to write a sequence versus a status page.",
          },
        ],
      },
      {
        id: "playbook-architect",
        title: "Architect",
        duration: "35–45 min",
        role: "architect",
        source: "agents/architect.md",
        here: "Refinement",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "Two events you lead, and a lot of rooms you sit in whenever a Ready outcome, a roadmap bet, or a ship call might force a new kitchen layout.",
            ],
          },
          {
            type: "heading",
            text: "Events you lead",
          },
          {
            type: "table",
            headers: ["Cadence", "Command", "What you are doing"],
            rows: [
              ["Every other week", "/forge.architecture-review", "Walk overview, constraints, interfaces, risks. Lock or supersede a decision when the kitchen actually changed."],
              ["Per major bet", "/forge.design-spike", "A short investigation when the team does not yet know enough to write an honest feature ticket."],
            ],
          },
          {
            type: "heading",
            text: "Events you attend",
          },
          {
            type: "table",
            headers: ["Command", "Who leads", "What you bring"],
            rows: [
              ["/forge.init-project", "Product Owner", "A thin overview and constraints sketch. Leave decisions empty unless something is already locked."],
              ["/forge.refinement", "Product Owner", "Constraints and interface facts to write into the issue. Call a spike if Ready would be a guess."],
              ["/forge.roadmap-review", "Product Owner", "Which Now/Next items violate a constraint or need a spike before the team commits."],
              ["/forge.plan-refresh", "Project Manager", "When the order is forced by the line: you cannot ship B before the interface A creates."],
              ["/forge.launch-readiness-check", "Product Owner", "Structural go or no-go. Unresolved structural risk should weigh against go."],
            ],
          },
          {
            type: "heading",
            text: "Skills you can load",
          },
          {
            type: "table",
            headers: ["Skill", "Reach for it when"],
            rows: [
              ["system-design", "The overview is stale: parts, data, where it lives."],
              ["constraint-mapping", "Hard no, soft no, out of bounds need to be said on the page or the ticket."],
              ["interface-contracts", "What talks to what, and who owns the seam."],
              ["change-impact", "A bet or a sequence would move a load-bearing wall."],
              ["technical-risk", "Coupling, migrations, the stations that already sag."],
              ["spike-framing", "The question, the options, and what “done investigating” looks like."],
              ["tradeoff-analysis", "Two shapes could work; the spike has to pick with eyes open."],
              ["tech-selection", "A vendor or a library is on the table."],
              ["architecture-decision", "Lock it in decisions.md, or supersede the old one. This file may keep history."],
              ["review-design", "A ship call or a proposed layout needs a yes, a no, or a spike."],
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "list",
            items: [
              "Read the overview with me. What must not break if we add password reset?",
              "Would this Ready outcome force a new layout, or can the line still run service?",
              "Frame a spike: prove we can send mail. What does done look like, and what do we refuse to design yet?",
              "The plan wants to ship share-a-project before mail. Is that structurally forced, or just impatience?",
              "Write the constraint this ticket has to carry so the builder does not guess the mail vendor.",
            ],
          },
          {
            type: "heading",
            text: "Common goals",
          },
          {
            type: "table",
            headers: ["You want", "Run", "Load"],
            rows: [
              ["The map matches the kitchen", "/forge.architecture-review", "system-design, constraint-mapping, review-design"],
              ["A decision is locked (or superseded)", "/forge.architecture-review", "architecture-decision"],
              ["The feature ticket would be a guess", "/forge.design-spike", "spike-framing, tradeoff-analysis, tech-selection"],
              ["A Ready card needs the constraint on the issue", "/forge.refinement (attend)", "constraint-mapping, interface-contracts"],
              ["The sequence is forced by an interface", "/forge.plan-refresh (attend)", "change-impact"],
            ],
          },
          {
            type: "example",
            title: "Example: prove we can send mail",
            lines: [
              "Goal: password reset cannot be honest until mail is proven.",
              "",
              "1. You flag it in /forge.refinement or /forge.roadmap-review.",
              "2. /forge.design-spike + spike-framing",
              "   Question: can the existing sender send from this environment?",
              "   Done: one path that delivers a message, or a no with why.",
              "   Refuse: designing the reset screens in the spike.",
              "3. Engineer attends if the constraint is “how we call it from code.”",
              "4. Product Owner attends with scope-control: spike first, then #18.",
              "5. If the vendor stays, lock it with architecture-decision.",
              "   If it cannot, that is a product cut; you leave the second vendor off the page until product says otherwise.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Take password reset again. Write the spike question in one sentence, name the event you would lead, and name the event you would attend to get that constraint onto the Ready issue.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can work this station when",
            body: "You can name the two events you lead, one you only attend, and which skill you would load to frame a spike versus lock a decision.",
          },
        ],
      },
      {
        id: "playbook-engineer",
        title: "Engineer",
        duration: "40–50 min",
        role: "engineer",
        source: "agents/engineer.md",
        here: "In Progress",
        blocks: [
          { type: "visual", name: "board", here: "Doing" },
          {
            type: "prose",
            paragraphs: [
              "Implementing a Ready ticket marked for an agent, opening a pull request, and keeping the branch current is already the job. You lead two events, and you attend when refinement, a spike, or a release needs an implementation fact. Code, the ticket, and the pull request are the source of truth; implement-ticket does not keep an in-flight diary.",
            ],
          },
          {
            type: "heading",
            text: "Events you lead",
          },
          {
            type: "table",
            headers: ["Cadence", "Command", "What you are doing"],
            rows: [
              ["On demand", "/forge.implement-ticket", "Ready + ai-ready only: claim In Progress right away, open the PR, wait for CI, and move to In Review when checks are green, or when the host has no checks, which you say out loud. No hand-off, no memory. Merge waits for validate-ticket."],
              ["On demand", "/forge.respond-to-review", "The conversation until the change is ready to re-gate; merge still waits for validate-ticket."],
            ],
          },
          {
            type: "heading",
            text: "Events you attend",
          },
          {
            type: "table",
            headers: ["Command", "Who leads", "What you bring"],
            rows: [
              ["/forge.refinement", "Product Owner", "Whether the contract is actually buildable. Open questions keep the card in Refinement."],
              ["/forge.design-spike", "Architect", "Implementation constraints: how we would call mail, what the spike must prove in code."],
              ["/forge.security-review", "Security", "A non-PR surface (config, a dependency bump) that still needs a code fact."],
              ["/forge.dependency-audit", "Security", "If a finding should become a ticket, you wait for that ticket; the audit leaves versions alone until then."],
              ["/forge.cut-release", "Release Manager", "A version bump or changelog commit in the submodule, when that is the publish step."],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Validate is a different room",
            body: "You do not attend /forge.validate-ticket. When QA or Security fail the PR, you run /forge.respond-to-review from the FAIL comment, then they re-run validate.",
          },
          {
            type: "heading",
            text: "Skills you can load",
          },
          {
            type: "table",
            headers: ["Skill", "Reach for it when"],
            rows: [
              ["implement-ticket", "The card is Ready and ai-ready. Build what is on the card."],
              ["write-tests", "The acceptance criteria need a test that can fail them."],
              ["open-pr", "The change exists and needs a pull request."],
              ["update-branch", "Main moved, or review asked for a refresh."],
              ["respond-to-review", "Comments arrived. Stay inside the review ask."],
              ["debug", "The build, the test, or the path is lying and you do not know why yet."],
              ["fix-bug", "The ticket is a defect with a reproduction; the outcome is a fix rather than a new capability."],
              ["refactor", "The ticket allows a structural cleanup inside the same outcome."],
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "list",
            items: [
              "Read this Ready issue. Is anything still ambiguous before I run implement-ticket?",
              "What is In Progress on the board, and does the PR agree?",
              "The first review comment is in. Walk it through respond-to-review without adding scope.",
              "These acceptance criteria: which tests would fail them if they were wrong?",
              "Main moved. Update the branch and say what you will leave alone.",
            ],
          },
          {
            type: "callout",
            tone: "rule",
            title: "Start only from Ready + ai-ready",
            body: "A card in Refinement is still being specified; starting from it is how you build a guess. human-ready means a person should build it. A brief that still has open questions is a request to talk, and the Agent should leave the code alone.",
          },
          {
            type: "heading",
            text: "Common goals",
          },
          {
            type: "table",
            headers: ["You want", "Run", "Load"],
            rows: [
              ["The Ready card becomes a PR", "/forge.implement-ticket", "implement-ticket, write-tests, open-pr"],
              ["Review comments get cleared", "/forge.respond-to-review", "respond-to-review, update-branch"],
              ["A failing path is understood", "/forge.implement-ticket or an ask", "debug, then write-tests"],
              ["A defect ticket is honest", "/forge.implement-ticket", "fix-bug, write-tests"],
              ["A spike needs a code fact", "/forge.design-spike (attend)", "debug, implement-ticket"],
            ],
          },
          {
            type: "example",
            title: "Example: #18 password reset",
            lines: [
              "Gate: Ready + ai-ready. Open questions: None. Mail spike has landed.",
              "",
              "1. /forge.implement-ticket",
              "   Claims In Progress, builds the path on the card, and writes tests that can fail the AC.",
              "   Opens the PR, waits for CI, and moves to In Review when green.",
              "2. QA or Security leaves a comment.",
              "   /forge.respond-to-review until ready to re-gate. Merge still waits for validate-ticket.",
              "3. Extra “while we’re here” scope is a product decision.",
              "   You stop and send it back rather than inventing a second ticket in the PR.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Read a Ready issue as if you are not allowed to ask follow-up questions. Name the event you would run, the skill that writes the tests, and the event you would run when the first review comment lands.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can work this station when",
            body: "You can name the two events you lead, the Ready + ai-ready gate, when the card moves to In Review, and which skill you would load to answer a review comment without adding scope.",
          },
        ],
      },
      {
        id: "playbook-quality-assurance",
        title: "Quality Assurance",
        duration: "35–45 min",
        role: "quality-assurance",
        source: "agents/quality-assurance.md",
        here: "In Review",
        blocks: [
          { type: "visual", name: "review" },
          {
            type: "prose",
            paragraphs: [
              "The tasting question is already yours: did we cook what we said we would? You lead the ticket gate and the release-wide pass; Security sits in the same room, and both have to approve before the command merges.",
            ],
          },
          {
            type: "heading",
            text: "Events you lead",
          },
          {
            type: "table",
            headers: ["Cadence", "Command", "What you are doing"],
            rows: [
              ["On demand", "/forge.validate-ticket", "One In Review PR: walk the acceptance criteria, then approve or pass back in a PR comment someone else could read next week. The card stays In Review on a fail; dual approve auto-merges and moves the card to Done."],
              ["Per release", "/forge.regression-pass", "Re-check the wider product before a plate goes to the table. Pass, fail, or ship-with-known-issues."],
            ],
          },
          {
            type: "heading",
            text: "Events you attend",
          },
          {
            type: "table",
            headers: ["Command", "Who leads", "What you bring"],
            rows: [
              ["/forge.launch-readiness-check", "Product Owner", "Queue, findings, and test-plan posture. Open blockers weigh against go."],
              ["/forge.prepare-release", "Release Manager", "Whether the version is actually testable. Known issues belong on the notes, where the ship call can see them."],
            ],
          },
          {
            type: "heading",
            text: "Skills you can load",
          },
          {
            type: "table",
            headers: ["Skill", "Reach for it when"],
            rows: [
              ["build-test-plan", "For validate-ticket, build checks from the issue AC for this run only. Durable test-plan memory is for release-wide rituals."],
              ["verify-acceptance", "Walk the claims on the ticket. The criteria are the claims; this is how you check them."],
              ["exploratory-test", "A little off the happy path, on purpose."],
              ["reproduce-bug", "A report has to become a path you can fail again."],
              ["qa-pass-back", "The change does not match the ticket: write the FAIL verdict on the PR, and the card stays In Review."],
              ["qa-approve-change", "The claims hold, and you still wait for Security before the command merges."],
              ["regression-check", "The wider product, usually before a release."],
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "list",
            items: [
              "What is waiting on the board In Review, and what is blocking approve?",
              "Walk this PR against the acceptance criteria. Write PASS or FAIL as if I will not be there to interpret it.",
              "This FAIL comment: can we reproduce it, and is it a product call or a blocker?",
              "Before we cut, what would a regression-pass actually run?",
            ],
          },
          {
            type: "heading",
            text: "Common goals",
          },
          {
            type: "table",
            headers: ["You want", "Run", "Load"],
            rows: [
              ["This PR matches the ticket", "/forge.validate-ticket", "verify-acceptance, exploratory-test, then qa-approve-change or qa-pass-back"],
              ["A report becomes a path you can fail", "an ask, then validate or implement", "reproduce-bug"],
              ["The wider product still holds", "/forge.regression-pass", "regression-check, build-test-plan"],
              ["The ship call sees QA truth", "/forge.launch-readiness-check (attend)", "verify-acceptance"],
            ],
          },
          {
            type: "example",
            title: "Example: #18 in review",
            lines: [
              "The PR exists and the checks are green, which is the timer; tasting is still your walk of the acceptance criteria.",
              "",
              "1. /forge.validate-ticket + verify-acceptance",
              "   Request a reset, use the link, land on sign-in.",
              "   Expired link and second use both fail. Unknown emails do not fish.",
              "2. exploratory-test: request twice in a row; try a signed-in session.",
              "3. If an AC fails: qa-pass-back, and the card stays In Review.",
              "   Engineer runs /forge.respond-to-review.",
              "4. If the claims hold: qa-approve-change, and wait for Security.",
              "   Dual approve → the command merges, deletes the branch, and moves the card to Done.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Take the Ready password-reset ticket from Course 1. Write three checks you would actually run, and the sentence you would put on the PR if the expired-link case failed.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can work this station when",
            body: "You can name the two events you lead, why Security sits in the same ticket gate, and which skill you would load to pass a change back without turning findings into a diary.",
          },
        ],
      },
      {
        id: "playbook-security",
        title: "Security",
        duration: "40–50 min",
        role: "security",
        source: "agents/security.md",
        here: "In Review",
        blocks: [
          { type: "visual", name: "gates" },
          {
            type: "prose",
            paragraphs: [
              "Safety is the question you already own. You sit in the ticket gate with QA, and you lead the work that has no pull request: a review of a station that never got a ticket, the monthly lockfile, and the last look before a plate goes to the table.",
            ],
          },
          {
            type: "heading",
            text: "Events you lead",
          },
          {
            type: "table",
            headers: ["Cadence", "Command", "What you are doing"],
            rows: [
              ["On demand", "/forge.security-review", "A surface with no PR/MR: config, a dependency bump, a station that never got a ticket. Approve or pass back."],
              ["Monthly", "/forge.dependency-audit", "Read the real manifests and the lockfile, propose findings, and recommend upgrades. Version bumps wait for an Engineer ticket after you say so."],
              ["Per release", "/forge.security-release-gate", "OK, not OK, or ship-with-exceptions for this version."],
            ],
          },
          {
            type: "heading",
            text: "Events you attend",
          },
          {
            type: "table",
            headers: ["Command", "Who leads", "What you bring"],
            rows: [
              ["/forge.validate-ticket", "Quality Assurance (required peer)", "The same PR, against safety expectations for this change. Either domain can fail; dual approve auto-merges."],
              ["/forge.launch-readiness-check", "Product Owner", "Open blockers weigh against go. Edit security pages only for release-gate truth."],
              ["/forge.prepare-release", "Release Manager", "Whether the version is blocked on a security finding."],
            ],
          },
          {
            type: "callout",
            tone: "warn",
            title: "“Dependencies” means two different things",
            body: "On the plan it means “this ticket cannot start until that one lands.” Here it means npm, pip, and last week’s CVE. Mix them up and the wrong person will try to fix the wrong fire.",
          },
          {
            type: "heading",
            text: "Skills you can load",
          },
          {
            type: "table",
            headers: ["Skill", "Reach for it when"],
            rows: [
              ["security-review", "A change (PR or not) needs a safety read."],
              ["secret-scan", "Credentials, tokens, or keys might have landed in the tree."],
              ["harden-config", "Defaults, authn/z, or environment shape look loose."],
              ["threat-model", "Assets, trust boundaries, or mitigations changed."],
              ["dependency-audit", "The lockfile and the real manifests need a monthly read."],
              ["security-pass-back", "The change is not safe: write the FAIL verdict on the PR, and the card stays In Review."],
              ["security-approve-change", "The safety claims hold, and you still wait for QA before the command merges a PR."],
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "list",
            items: [
              "What is blocking a security OK right now?",
              "Read this PR against the checklist, secret-scan it, and write PASS or FAIL in one line.",
              "This finding: real risk, noise, or a hallucination?",
              "Walk the lockfile. What would you recommend, and what would you leave alone?",
              "Before we cut, is the release gate OK, not OK, or ship-with-exceptions?",
            ],
          },
          {
            type: "heading",
            text: "Common goals",
          },
          {
            type: "table",
            headers: ["You want", "Run", "Load"],
            rows: [
              ["This PR is safe to merge (with QA)", "/forge.validate-ticket", "security-review, secret-scan, then security-approve-change or security-pass-back"],
              ["A change with no PR gets a verdict", "/forge.security-review", "security-review, harden-config"],
              ["The lockfile is what we run", "/forge.dependency-audit", "dependency-audit"],
              ["This version can leave the pass", "/forge.security-release-gate", "security-review, threat-model"],
            ],
          },
          {
            type: "example",
            title: "Example: the reset token",
            lines: [
              "Same PR as QA, with a different question: is it safe to give to people?",
              "",
              "1. /forge.validate-ticket + security-review",
              "   One-time link, 30-minute expiry, no account fishing.",
              "   secret-scan the diff. harden-config if a default went loose.",
              "2. Token in a log or a guessable link: security-pass-back.",
              "   The card stays In Review, and the Engineer runs respond-to-review.",
              "3. Monthly: /forge.dependency-audit on the mail library.",
              "   A bump is a ticket for the Engineer after you say so.",
              "4. Per release: /forge.security-release-gate on the version.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Take the Ready password-reset ticket. Write one threat you would check on the PR, and say whether a stale mail-library CVE is validate-ticket, security-review, or dependency-audit.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can work this station when",
            body: "You can name the events you lead, why validate-ticket is a required peer rather than a solo, and which skill you would load for a PR versus a lockfile.",
          },
        ],
      },
      {
        id: "playbook-release-manager",
        title: "Release Manager",
        duration: "35–45 min",
        role: "release-manager",
        source: "agents/release-manager.md",
        here: "Release",
        blocks: [
          { type: "visual", name: "ship" },
          {
            type: "prose",
            paragraphs: [
              "Prepare, then cut: version, checklist, notes, and how we would undo it. The gates in forge.json are this project’s pass checklist; empty gates are a missing definition of “ready for the table.”",
            ],
          },
          {
            type: "heading",
            text: "Events you lead",
          },
          {
            type: "table",
            headers: ["Cadence", "Command", "What you are doing"],
            rows: [
              ["Per release", "/forge.prepare-release", "Version, notes, blockers, and how you would undo it. Call out missing configured gates. Publishing waits for cut-release."],
              ["Per release", "/forge.cut-release", "Tag, host release, and the last button. If the organization wants a human on that button, that human is still you."],
            ],
          },
          {
            type: "heading",
            text: "Events you attend",
          },
          {
            type: "table",
            headers: ["Command", "Who leads", "What you bring"],
            rows: [
              ["/forge.launch-readiness-check", "Product Owner", "Checklist, notes, and status for the version target. Ship blockers belong here; the vendor publish stays on cut-release."],
              ["/forge.regression-pass", "Quality Assurance", "Known issues and blockers that change ship readiness."],
              ["/forge.security-release-gate", "Security", "Whether the version is OK, not OK, or ship-with-exceptions."],
              ["/forge.launch-comms", "Marketing", "What actually shipped, so the announcement can stay true."],
            ],
          },
          {
            type: "heading",
            text: "Skills you can load",
          },
          {
            type: "table",
            headers: ["Skill", "Reach for it when"],
            rows: [
              ["version-plan", "What are we calling this, and why that number?"],
              ["release-checklist", "Pre-ship, gates, publish steps, rollback — this project’s list."],
              ["write-release-notes", "What changed, what breaks, what to do after."],
              ["rollback-plan", "How we undo it, written before we need it."],
              ["cut-release", "The tag and the host release."],
              ["publish-release", "The remaining publish steps after the tag exists."],
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "list",
            items: [
              "What version are we cutting, and is the release blocked?",
              "Read forge.json release.gates[]. What is missing from the checklist?",
              "Draft notes for what actually merged since the last tag, and leave hoped-for outcomes off the page.",
              "Write the rollback in the same words you would use at 2 a.m.",
            ],
          },
          {
            type: "heading",
            text: "Common goals",
          },
          {
            type: "table",
            headers: ["You want", "Run", "Load"],
            rows: [
              ["We know whether we can ship", "/forge.prepare-release", "version-plan, release-checklist, write-release-notes, rollback-plan"],
              ["The version leaves the pass", "/forge.cut-release", "cut-release, publish-release"],
              ["The ship call sees release truth", "/forge.launch-readiness-check (attend)", "release-checklist"],
              ["The announcement matches the tag", "/forge.launch-comms (attend)", "write-release-notes"],
            ],
          },
          {
            type: "example",
            title: "Example: password reset as a version",
            lines: [
              "#18 is Done, and the guests still do not have it.",
              "",
              "1. /forge.prepare-release",
              "   Version target. Notes: reset path, 30-minute link, sign-in redirect.",
              "   Rollback: revert the tag; mail sender stays.",
              "   Gates: whatever forge.json lists, in order.",
              "2. QA may /forge.regression-pass. Security /forge.security-release-gate.",
              "   Product Owner /forge.launch-readiness-check. You attend all three.",
              "3. /forge.cut-release when the call is go.",
              "4. Marketing /forge.launch-comms after the tag exists.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Write a four-line prepare: version, one change, one rollback, one gate you would refuse to waive. Name the event that publishes and the event that only writes the notes.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can work this station when",
            body: "You can name prepare versus cut, where this project’s gates live, and which skill you would load to write a rollback before you need it.",
          },
        ],
      },
      {
        id: "playbook-marketing-manager",
        title: "Marketing Manager",
        duration: "35–45 min",
        role: "marketing-manager",
        source: "agents/marketing-manager.md",
        here: "Told the world",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "A voice and a queue that survives Monday is the work you already know. You lead the weekly posts, the monthly word pass, and the launch announcement, and you attend when product learns something that should change the external story.",
            ],
          },
          {
            type: "heading",
            text: "Events you lead",
          },
          {
            type: "table",
            headers: ["Cadence", "Command", "What you are doing"],
            rows: [
              ["Weekly", "/forge.social-post-batch", "Draft or refresh the queue. Ready to post gets a human look before it stays Ready."],
              ["Monthly", "/forge.messaging-refresh", "Positioning, messaging, voice. Product Owner attends so the words still match the brief."],
              ["Per release", "/forge.launch-comms", "Announce what shipped, after the tag exists, in words that match the notes."],
            ],
          },
          {
            type: "heading",
            text: "Events you attend",
          },
          {
            type: "table",
            headers: ["Command", "Who leads", "What you bring"],
            rows: [
              ["/forge.competitive-scan", "Product Owner", "Differentiator and words we use or avoid, only when a real bet moved. Optionally one competitive-angle post in Holding."],
              ["/forge.outcomes-retro", "Product Owner", "Proof harvest: what to keep saying, what to stop saying."],
            ],
          },
          {
            type: "heading",
            text: "Skills you can load",
          },
          {
            type: "table",
            headers: ["Skill", "Reach for it when"],
            rows: [
              ["positioning", "Audience, promise, proof, and what we are not claiming."],
              ["messaging", "One-liner, pillars, CTAs, words we use and words we avoid."],
              ["voice", "How we sound when we are ourselves."],
              ["content-calendar", "Themes and hooks for this period, so Monday is not blank."],
              ["social-post", "One post, in voice, into Ready / Needs revision / Holding."],
              ["launch-announcement", "What shipped, after it shipped."],
              ["competitive-angle", "Where we win or lose, without a feature-parity rant."],
              ["proof-harvest", "Evidence from a release or a retro that the claim can stand on."],
            ],
          },
          {
            type: "heading",
            text: "Anytime asks",
          },
          {
            type: "list",
            items: [
              "Who are we talking to, and what are we willing to claim this week?",
              "Draft three posts from the social queue rules. Put anything shaky in Needs revision.",
              "Password reset just shipped. Write the announcement from the release notes; the roadmap wish stays off the post.",
              "This competitor claim: do we answer it, or do we leave it off the page?",
            ],
          },
          {
            type: "heading",
            text: "Common goals",
          },
          {
            type: "table",
            headers: ["You want", "Run", "Load"],
            rows: [
              ["Monday has a queue", "/forge.social-post-batch", "social-post, content-calendar, voice"],
              ["The words still match the product", "/forge.messaging-refresh", "positioning, messaging, voice"],
              ["A release has an announcement", "/forge.launch-comms", "launch-announcement, proof-harvest"],
              ["A competitor moved the story", "/forge.competitive-scan (attend)", "competitive-angle, positioning"],
              ["The claim has evidence", "/forge.outcomes-retro (attend)", "proof-harvest"],
            ],
          },
          {
            type: "example",
            title: "Example: tell the world about reset",
            lines: [
              "The cut has happened, and the notes say what shipped.",
              "",
              "1. /forge.launch-comms + launch-announcement",
              "   “Signed-out visitors reset from sign-in and land back on sign-in.”",
              "   You do not promise that support tickets already dropped.",
              "2. social-post into the queue, in voice.",
              "3. After /forge.outcomes-retro, proof-harvest.",
              "   If support volume dropped, that proof can enter messaging; if the number did not move, you stop claiming it did.",
            ],
          },
          {
            type: "heading",
            text: "Practice",
          },
          {
            type: "prose",
            paragraphs: [
              "Write one launch sentence for password reset that you could defend from the Ready ticket. Name the event that publishes it and the event you would attend if a competitor shipped the same path first.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You can work this station when",
            body: "You can name the three events you lead, why launch-comms waits for the tag, and which skill you would load to harvest proof rather than invent it.",
          },
        ],
      },
      {
        id: "playbook-pick",
        title: "Pick a station",
        duration: "15–25 min",
        source: "commands/forge.help.md",
        blocks: [
          { type: "visual", name: "loop" },
          {
            type: "prose",
            paragraphs: [
              "Keep the playbook you are standing at close, plus the courtesy of knowing who else is in the room; the rest can stay on the shelf until you change stations.",
              "Open /forge.help and ask it to expand the agent you just read, then compare that report to this page. If they disagree, the agent file and the command win, and you come back so we can fix the course.",
            ],
          },
          {
            type: "table",
            headers: ["If you are here this week", "Run"],
            rows: [
              ["The story is still fog", "/forge.init-project or /forge.backlog-grooming"],
              ["A groomed card needs a contract", "/forge.refinement"],
              ["Ready work has no order", "/forge.plan-refresh"],
              ["The kitchen layout might move", "/forge.architecture-review or /forge.design-spike"],
              ["A card is Ready and ai-ready", "/forge.implement-ticket"],
              ["A PR is In Review", "/forge.validate-ticket"],
              ["The lockfile is a month stale", "/forge.dependency-audit"],
              ["Merged work has no version", "/forge.prepare-release"],
              ["The tag exists and nobody was told", "/forge.launch-comms"],
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "You are done with the three courses when",
            body: "You can inhabit one role for a week: run the events you lead, attend the ones you owe, load the skill that matches the goal, and explain each pause in Course 1 words before you Apply.",
          },
        ],
      },
    ],
  },
];
