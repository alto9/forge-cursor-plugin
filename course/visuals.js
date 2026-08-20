function svg(inner, extra = "") {
  return `<figure class="figure ${extra}"><svg viewBox="0 0 420 220" role="img" aria-hidden="true">${inner}</svg></figure>`;
}

function label(x, y, text, cls = "") {
  return `<text x="${x}" y="${y}" text-anchor="middle" class="fig-label ${cls}">${text}</text>`;
}

export function visual(name, here = "") {
  const mark = (id) => (here === id ? "is-here" : "");

  if (name === "loop") {
    return svg(`
      <circle cx="210" cy="112" r="74" class="fig-ring" fill="none"/>
      <circle cx="210" cy="112" r="4" class="fig-dot"/>
      <path d="M268 58 A78 78 0 0 1 290 112" class="fig-accent" fill="none"/>
      ${label(210, 28, "idea")}
      ${label(338, 80, "specify")}
      ${label(352, 150, "build")}
      ${label(210, 208, "check")}
      ${label(68, 150, "ship")}
      ${label(82, 80, "learn")}
    `);
  }

  if (name === "board") {
    const cols = [
      ["Backlog", 28],
      ["Ready", 108],
      ["Doing", 188],
      ["Review", 268],
      ["Done", 348],
    ];
    const cards = [
      [36, 78],
      [36, 118],
      [116, 78],
      [196, 78],
      [276, 78],
      [276, 118],
      [356, 78],
    ];
    return svg(`
      <rect x="12" y="24" width="396" height="176" rx="8" class="fig-board"/>
      ${cols
        .map(
          ([title, x], i) => `
        <text x="${x + 28}" y="48" text-anchor="middle" class="fig-col ${mark(title)}">${title}</text>
        <line x1="${x}" y1="58" x2="${x + 56}" y2="58" class="fig-rule"/>
      `,
        )
        .join("")}
      ${cards
        .map(
          ([x, y], i) =>
            `<rect x="${x}" y="${y}" width="48" height="28" rx="3" class="fig-card ${i === 2 || i === 4 ? "fig-card-hot" : ""}"/>`,
        )
        .join("")}
    `);
  }

  if (name === "backlog") {
    return svg(`
      <rect x="70" y="86" width="130" height="86" rx="4" class="fig-paper" transform="rotate(-8 135 129)"/>
      <rect x="92" y="78" width="130" height="86" rx="4" class="fig-paper" transform="rotate(-2 157 121)"/>
      <rect x="110" y="72" width="130" height="90" rx="4" class="fig-paper fig-card-hot"/>
      <text x="175" y="118" text-anchor="middle" class="fig-label">maybe later</text>
      <text x="175" y="140" text-anchor="middle" class="fig-small">not a promise</text>
      <path d="M268 70 v90" class="fig-rule"/>
      <rect x="286" y="88" width="92" height="54" rx="4" class="fig-card fig-card-hot"/>
      <text x="332" y="120" text-anchor="middle" class="fig-small">next to shape</text>
    `);
  }

  if (name === "ticket") {
    return svg(`
      <rect x="36" y="50" width="150" height="130" rx="8" class="fig-paper"/>
      <text x="111" y="88" text-anchor="middle" class="fig-label">not a ticket</text>
      <text x="111" y="122" text-anchor="middle" class="fig-small">“make it better”</text>
      <rect x="234" y="50" width="150" height="130" rx="8" class="fig-card fig-card-hot"/>
      <text x="309" y="84" text-anchor="middle" class="fig-label">a ticket</text>
      <text x="309" y="112" text-anchor="middle" class="fig-small">who · what · done</text>
      <text x="309" y="134" text-anchor="middle" class="fig-small">when we know</text>
    `);
  }

  if (name === "groom") {
    return svg(`
      <rect x="40" y="70" width="120" height="80" rx="6" class="fig-paper"/>
      <text x="100" y="116" text-anchor="middle" class="fig-small">foggy idea</text>
      <path d="M172 110 H228" class="fig-accent"/>
      <polygon points="228,104 242,110 228,116" class="fig-accent-fill"/>
      <rect x="256" y="62" width="128" height="96" rx="6" class="fig-card fig-card-hot"/>
      <text x="320" y="100" text-anchor="middle" class="fig-small">outcome</text>
      <text x="320" y="120" text-anchor="middle" class="fig-small">for whom</text>
      <text x="320" y="140" text-anchor="middle" class="fig-small">how we’ll know</text>
    `);
  }

  if (name === "ready") {
    return svg(`
      <rect x="118" y="48" width="184" height="124" rx="6" class="fig-card fig-card-hot"/>
      <text x="210" y="88" text-anchor="middle" class="fig-label">Ready</text>
      <text x="210" y="118" text-anchor="middle" class="fig-small">build this · not that</text>
      <text x="210" y="138" text-anchor="middle" class="fig-small">check it this way</text>
      <text x="210" y="196" text-anchor="middle" class="fig-small">if they still have to guess, it isn’t ready</text>
    `);
  }

  if (name === "review") {
    return svg(`
      <rect x="40" y="54" width="150" height="120" rx="8" class="fig-paper"/>
      <text x="115" y="100" text-anchor="middle" class="fig-label">the right thing?</text>
      <text x="115" y="128" text-anchor="middle" class="fig-small">acceptance</text>
      <rect x="230" y="54" width="150" height="120" rx="8" class="fig-card fig-card-hot"/>
      <text x="305" y="100" text-anchor="middle" class="fig-label">safe to give</text>
      <text x="305" y="128" text-anchor="middle" class="fig-small">to people?</text>
    `);
  }

  if (name === "ship") {
    return svg(`
      <rect x="48" y="70" width="100" height="70" rx="6" class="fig-paper"/>
      <text x="98" y="110" text-anchor="middle" class="fig-small">merged</text>
      <path d="M164 104 H214" class="fig-rule"/>
      <rect x="230" y="58" width="140" height="96" rx="8" class="fig-card fig-card-hot"/>
      <text x="300" y="100" text-anchor="middle" class="fig-label">in their hands</text>
      <text x="300" y="124" text-anchor="middle" class="fig-small">a release</text>
    `);
  }

  if (name === "cycle-steps") {
    const steps = ["idea", "groom", "ready", "build", "review", "ship"];
    return `<figure class="cycle-strip" aria-hidden="true">${steps
      .map(
        (s, i) =>
          `<span>${s}</span>${i < steps.length - 1 ? `<span class="cycle-arrow">→</span>` : `<span class="cycle-arrow">↻</span>`}`,
      )
      .join("")}</figure>`;
  }

  if (name === "handoff") {
    return svg(`
      <rect x="28" y="64" width="110" height="92" rx="8" class="fig-paper"/>
      <text x="83" y="116" text-anchor="middle" class="fig-small">propose</text>
      <rect x="156" y="48" width="110" height="124" rx="8" class="fig-card fig-card-hot"/>
      <text x="211" y="100" text-anchor="middle" class="fig-label">talk</text>
      <text x="211" y="124" text-anchor="middle" class="fig-small">until the set is right</text>
      <rect x="284" y="64" width="110" height="92" rx="8" class="fig-paper"/>
      <text x="339" y="116" text-anchor="middle" class="fig-small">then Apply</text>
    `);
  }

  if (name === "repos") {
    return svg(`
      <rect x="48" y="50" width="140" height="128" rx="8" class="fig-paper"/>
      <text x="118" y="100" text-anchor="middle" class="fig-label">code</text>
      <text x="118" y="128" text-anchor="middle" class="fig-small">branches · PRs</text>
      <rect x="232" y="50" width="140" height="128" rx="8" class="fig-card fig-card-hot"/>
      <text x="302" y="100" text-anchor="middle" class="fig-label">memory</text>
      <text x="302" y="128" text-anchor="middle" class="fig-small">main only</text>
    `);
  }

  if (name === "sequence") {
    return svg(`
      <rect x="22" y="70" width="96" height="80" rx="6" class="fig-paper"/>
      <text x="70" y="106" text-anchor="middle" class="fig-small">prove mail</text>
      <text x="70" y="128" text-anchor="middle" class="fig-small">landed</text>
      <path d="M128 110 H158" class="fig-accent"/>
      <polygon points="158,104 172,110 158,116" class="fig-accent-fill"/>
      <rect x="182" y="62" width="108" height="96" rx="6" class="fig-card fig-card-hot"/>
      <text x="236" y="104" text-anchor="middle" class="fig-small">password reset</text>
      <text x="236" y="126" text-anchor="middle" class="fig-small">in flight</text>
      <path d="M300 110 H326" class="fig-rule"/>
      <rect x="334" y="70" width="68" height="80" rx="6" class="fig-paper"/>
      <text x="368" y="106" text-anchor="middle" class="fig-small">share</text>
      <text x="368" y="128" text-anchor="middle" class="fig-small">waits</text>
    `);
  }

  if (name === "kit") {
    return svg(`
      <rect x="22" y="58" width="114" height="104" rx="8" class="fig-paper"/>
      <text x="79" y="100" text-anchor="middle" class="fig-label">event</text>
      <text x="79" y="124" text-anchor="middle" class="fig-small">a cadence</text>
      <rect x="152" y="48" width="116" height="124" rx="8" class="fig-card fig-card-hot"/>
      <text x="210" y="100" text-anchor="middle" class="fig-label">skill</text>
      <text x="210" y="124" text-anchor="middle" class="fig-small">a procedure</text>
      <rect x="284" y="58" width="114" height="104" rx="8" class="fig-paper"/>
      <text x="341" y="100" text-anchor="middle" class="fig-label">ask</text>
      <text x="341" y="124" text-anchor="middle" class="fig-small">between rituals</text>
    `);
  }

  if (name === "gates") {
    return svg(`
      <rect x="90" y="40" width="240" height="36" rx="4" class="fig-paper"/>
      <text x="210" y="64" text-anchor="middle" class="fig-small">In Review</text>
      <rect x="70" y="100" width="120" height="80" rx="8" class="fig-card fig-card-hot"/>
      <text x="130" y="146" text-anchor="middle" class="fig-label">QA</text>
      <rect x="230" y="100" width="120" height="80" rx="8" class="fig-card fig-card-hot"/>
      <text x="290" y="146" text-anchor="middle" class="fig-label">Security</text>
    `);
  }

  return "";
}
