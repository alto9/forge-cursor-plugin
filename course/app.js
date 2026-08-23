import { boardPath, courses } from "./content.js";
import { visual } from "./visuals.js";

const STORAGE = "forge-course-v1";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE) || "{}");
  } catch {
    return {};
  }
}

function save(state) {
  localStorage.setItem(STORAGE, JSON.stringify(state));
}

function courseById(id) {
  return courses.find((c) => c.id === id);
}

function sessionById(course, sid) {
  return course?.sessions.find((s) => s.id === sid);
}

function doneSet(courseId) {
  const state = load();
  return new Set(state[courseId] || []);
}

function markDone(courseId, sessionId) {
  const state = load();
  const set = new Set(state[courseId] || []);
  set.add(sessionId);
  state[courseId] = [...set];
  save(state);
}

function courseComplete(courseId) {
  const course = courseById(courseId);
  const done = doneSet(courseId);
  return course.sessions.every((s) => done.has(s.id));
}

function parseHash() {
  const raw = (location.hash || "#/").replace(/^#\/?/, "");
  const [courseId, sessionId, slideRaw] = raw.split("/");
  const slide = Number.parseInt(slideRaw, 10);
  return {
    courseId: courseId || "",
    sessionId: sessionId || "",
    slide: Number.isFinite(slide) && slide > 0 ? slide : 1,
  };
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderPath(here) {
  return `<div class="path" aria-label="Board path">${boardPath
    .map((step) => `<span class="${here === step ? "here" : ""}">${esc(step)}</span>`)
    .join("")}</div>`;
}

function renderBlock(block, session) {
  if (block.type === "heading") {
    return `<h3>${esc(block.text)}</h3>`;
  }
  if (block.type === "example") {
    const lines = (block.lines || []).map((l) => esc(l)).join("\n");
    return `<div class="example"><strong>${esc(block.title)}</strong><pre>${lines}</pre></div>`;
  }
  if (block.type === "prose") {
    return block.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
  }
  if (block.type === "list") {
    const items = block.items.map((i) => `<li>${esc(i)}</li>`).join("");
    return `${block.title ? `<h3>${esc(block.title)}</h3>` : ""}<ul>${items}</ul>`;
  }
  if (block.type === "table") {
    const head = `<tr>${block.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>`;
    const rows = block.rows
      .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
      .join("");
    return `<table><thead>${head}</thead><tbody>${rows}</tbody></table>`;
  }
  if (block.type === "callout") {
    return `<div class="callout ${esc(block.tone)}"><strong>${esc(block.title)}</strong>${esc(block.body)}</div>`;
  }
  if (block.type === "path") {
    return renderPath(block.here ?? session.here ?? null);
  }
  if (block.type === "visual") {
    return visual(block.name, block.here ?? session.here ?? "");
  }
  if (block.type === "docs") {
    const rows = block.items
      .map(
        (d) =>
          `<tr><td><code class="mono">${esc(d.file)}</code></td><td>${esc(d.h2s)}</td></tr>`,
      )
      .join("");
    return `<h3>Docs they keep current</h3><p class="stat">Memory path: <code>.ai/memory/&lt;submodule&gt;/</code> — YAML frontmatter (<code>doc</code> + <code>schema_version: 1</code>); body is expansion-only; empty fields OK at init.</p><table><thead><tr><th>File</th><th>Core fields</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  if (block.type === "desk") {
    const cards = block.items
      .map((d) => {
        const title = d.name ? `<strong>${esc(d.name)}</strong>` : `<code class="mono">${esc(d.file)}</code>`;
        const path = d.name && d.file ? `<code class="mono">${esc(d.file)}</code>` : "";
        return `<li><div>${title}${path ? ` ${path}` : ""}</div><span>${esc(d.note)}</span></li>`;
      })
      .join("");
    return `<h3>${esc(block.title || "Documents they keep current")}</h3><ul class="desk">${cards}</ul>`;
  }
  return "";
}

function navHtml(activeCourse, activeSession) {
  return courses
    .map((c) => {
      const done = doneSet(c.id);
      const n = c.sessions.filter((s) => done.has(s.id)).length;
      const items = c.sessions
        .map((s) => {
          const cls = [
            activeCourse === c.id && activeSession === s.id ? "active" : "",
            done.has(s.id) ? "done" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return `<li><a class="${cls}" href="#/${c.id}/${s.id}">${esc(s.title)}</a></li>`;
        })
        .join("");
      return `<div class="nav-course"><a href="#/${c.id}">${esc(c.title)} <span class="progress-n">${n}/${c.sessions.length}</span></a><ol>${items}</ol></div>`;
    })
    .join("");
}

function renderHome() {
  const cards = courses
    .map((c) => {
      const done = doneSet(c.id);
      const n = c.sessions.filter((s) => done.has(s.id)).length;
      const locked = c.requires && !courseComplete(c.requires);
      const first = c.sessions[0];
      return `<a class="card ${locked ? "locked" : ""}" href="#/${c.id}/${first.id}">
        <div class="kicker">${esc(c.kicker)}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.subtitle)}</p>
        <div class="meta">${n} of ${c.sessions.length} sessions · ${c.sessions.length} hours-ish${locked ? ` · finish ${esc(courseById(c.requires).title)} first (or open a session anyway)` : ""}</div>
      </a>`;
    })
    .join("");

  return `<article class="sheet home-hero">
    <p class="kicker">Local workshop</p>
    <h2 class="page">Forge course</h2>
    <p class="lede">Three required courses: fluent in how software gets made, then how this team runs that loop in Forge, then a playbook per role (events, skills, and common goals).</p>
    <div class="cards">${cards}</div>
    <p class="stat">Progress stays in this browser. Source of truth for roles, commands, and skills remains <code>agents/</code>, <code>commands/</code>, and <code>skills/</code> in the plugin.</p>
  </article>`;
}

function renderCourse(course) {
  const done = doneSet(course.id);
  const n = course.sessions.filter((s) => done.has(s.id)).length;
  const items = course.sessions
    .map((s, i) => {
      return `<a class="card" href="#/${course.id}/${s.id}">
        <div class="kicker">Session ${i + 1} · ${esc(s.duration)}${done.has(s.id) ? " · done" : ""}</div>
        <h3>${esc(s.title)}</h3>
      </a>`;
    })
    .join("");
  return `<article class="sheet">
    <p class="kicker">${esc(course.kicker)}</p>
    <h2 class="page">${esc(course.title)}</h2>
    <p class="lede">${esc(course.subtitle)}</p>
    <p class="stat">${n} of ${course.sessions.length} complete</p>
    <div class="cards">${items}</div>
  </article>`;
}

function renderSlides(course, session, slideNum) {
  const slides = session.slides;
  const total = slides.length;
  const i = Math.min(Math.max(slideNum, 1), total);
  const slide = slides[i - 1];
  const idx = course.sessions.findIndex((s) => s.id === session.id);
  const nextSession = course.sessions[idx + 1];
  const done = doneSet(course.id).has(session.id);
  const prevHref = i > 1 ? `#/${course.id}/${session.id}/${i - 1}` : `#/${course.id}`;
  const nextHref = i < total ? `#/${course.id}/${session.id}/${i + 1}` : nextSession ? `#/${course.id}/${nextSession.id}` : `#/${course.id}`;
  const nextLabel = i < total ? "Next slide" : nextSession ? `Next: ${nextSession.title}` : "Course overview";
  const vis = slide.visual ? visual(slide.visual, slide.here || "") : "";
  const body = (slide.body || []).map((p) => `<p>${esc(p)}</p>`).join("");
  const steps = slide.steps
    ? `<ol class="slide-steps">${slide.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`
    : "";
  const dots = slides
    .map((_, n) => {
      const num = n + 1;
      return `<a class="dot ${num === i ? "here" : ""}" href="#/${course.id}/${session.id}/${num}" aria-label="Slide ${num}"></a>`;
    })
    .join("");

  return `<article class="sheet slide-sheet">
    <p class="kicker">${esc(course.title)} · ${esc(session.title)} · Slide ${i} of ${total}</p>
    <div class="slide">
      <h2 class="page">${esc(slide.title)}</h2>
      ${vis}
      ${body}
      ${steps}
    </div>
    <div class="dots" aria-label="Slides">${dots}</div>
    <div class="actions">
      <a class="btn" href="${prevHref}">${i > 1 ? "Previous slide" : "Course overview"}</a>
      ${i === total ? `<button class="primary" data-complete="${course.id}:${session.id}">${done ? "Completed" : "Mark complete"}</button>` : ""}
      <a class="btn" href="${nextHref}">${esc(nextLabel)}</a>
    </div>
    <p class="stat">Arrow keys move between slides.</p>
  </article>`;
}

function renderSession(course, session, slideNum) {
  if (session.format === "slides") return renderSlides(course, session, slideNum);

  const idx = course.sessions.findIndex((s) => s.id === session.id);
  const prev = course.sessions[idx - 1];
  const next = course.sessions[idx + 1];
  const done = doneSet(course.id).has(session.id);
  const requiredCourse = course.requires ? courseById(course.requires) : null;
  const locked = requiredCourse && !courseComplete(requiredCourse.id);
  const body = (session.blocks || []).map((b) => renderBlock(b, session)).join("");
  const nextCourse = courses[courses.indexOf(course) + 1];
  const order = courses.map((c) => c.title).join(", then ");

  let nextHref = next ? `#/${course.id}/${next.id}` : nextCourse ? `#/${nextCourse.id}/${nextCourse.sessions[0].id}` : "#/";
  let nextLabel = next ? `Next: ${next.title}` : nextCourse ? `Next: ${nextCourse.title}` : "Back to start";

  return `<article class="sheet">
    <p class="kicker">${esc(course.title)} · Session ${idx + 1} of ${course.sessions.length} · ${esc(session.duration)}</p>
    <h2 class="page">${esc(session.title)}</h2>
    ${locked ? `<div class="callout warn"><strong>${esc(requiredCourse.title)} is not marked complete</strong>You can still read this. The intended order is ${esc(order)}.</div>` : ""}
    ${body}
    ${session.source ? `<p class="source">Contract: <code>${esc(session.source)}</code></p>` : ""}
    <div class="actions">
      ${prev ? `<a class="btn" href="#/${course.id}/${prev.id}">Previous</a>` : `<a class="btn" href="#/${course.id}">Course overview</a>`}
      <button class="primary" data-complete="${course.id}:${session.id}">${done ? "Completed" : "Mark complete"}</button>
      <a class="btn" href="${nextHref}">${esc(nextLabel)}</a>
    </div>
  </article>`;
}

function render() {
  const { courseId, sessionId, slide } = parseHash();
  const course = courseById(courseId);
  const session = sessionById(course, sessionId);
  const app = document.getElementById("app");

  let main;
  if (!course) main = renderHome();
  else if (!session) main = renderCourse(course);
  else main = renderSession(course, session, slide);

  const title = session ? `${session.title} · ${course.title}` : course ? course.title : "Forge Course";
  document.title = title;

  app.innerHTML = `<div class="layout">
    <aside class="sidebar">
      <div class="brand"><a href="#/">Forge course</a></div>
      <h1>Alto9 SDLC On-Ramp</h1>
      ${navHtml(courseId, sessionId)}
    </aside>
    <main class="main">${main}</main>
  </div>`;

  const btn = app.querySelector("[data-complete]");
  if (btn) {
    btn.addEventListener("click", () => {
      const [cid, sid] = btn.getAttribute("data-complete").split(":");
      markDone(cid, sid);
      render();
    });
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("keydown", (e) => {
  const { courseId, sessionId, slide } = parseHash();
  const course = courseById(courseId);
  const session = sessionById(course, sessionId);
  if (!session || session.format !== "slides") return;
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const total = session.slides.length;
  if (e.key === "ArrowRight" && slide < total) {
    location.hash = `/${course.id}/${session.id}/${slide + 1}`;
  }
  if (e.key === "ArrowLeft" && slide > 1) {
    location.hash = `/${course.id}/${session.id}/${slide - 1}`;
  }
});
render();
