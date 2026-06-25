// Self-contained static-site template. Fills a single index.html (inline CSS +
// minimal JS) from a prospect's data — modeled on the Hill Country Plumbing /
// ByLizstudio reference sites. Category-aware accent color and service menu.

export interface SiteProspect {
  businessName: string;
  category: string | null;
  rating: number | null;
  reviewCount: number | null;
  phone: string | null;
  address: string | null;
  hours: string | null;
  topReviews: string | null;
  mapsUrl: string | null;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface Theme {
  accent: string;
  accentDark: string;
  services: Array<{ title: string; desc: string }>;
}

function themeFor(category: string): Theme {
  const c = category.toLowerCase();
  if (c.includes("plumb")) {
    return {
      accent: "#0e7490",
      accentDark: "#155e75",
      services: [
        { title: "Emergency Repairs", desc: "24/7 response for leaks, bursts, and clogs — fast, clean, and guaranteed." },
        { title: "Water Heaters", desc: "Tankless and traditional install, repair, and maintenance done right." },
        { title: "Drain & Sewer", desc: "Camera inspection, hydro-jetting, and trenchless line repair." },
        { title: "Fixtures & Remodels", desc: "Faucets, toilets, and full bathroom plumbing upgrades." },
      ],
    };
  }
  if (c.includes("hvac") || c.includes("air") || c.includes("heat")) {
    return {
      accent: "#2563eb",
      accentDark: "#1d4ed8",
      services: [
        { title: "AC Repair", desc: "Same-day diagnostics and honest fixes to beat the Texas heat." },
        { title: "Heating Service", desc: "Furnace and heat-pump tune-ups, repairs, and replacements." },
        { title: "Installations", desc: "Right-sized, energy-efficient systems with up-front pricing." },
        { title: "Maintenance Plans", desc: "Seasonal checkups that keep your system running and warrantied." },
      ],
    };
  }
  if (c.includes("barber") || c.includes("salon") || c.includes("nail")) {
    return {
      accent: "#be185d",
      accentDark: "#9d174d",
      services: [
        { title: "Signature Cuts", desc: "Precision fades, tapers, and styles tailored to you." },
        { title: "Color & Treatments", desc: "Perms, lash lifts, and finishing treatments by appointment." },
        { title: "Special Occasions", desc: "Bridal and event-ready looks booked ahead of your big day." },
        { title: "Walk-In Friendly", desc: "Easy online booking with loyal, repeat-client care." },
      ],
    };
  }
  if (c.includes("landscap") || c.includes("lawn") || c.includes("handyman")) {
    return {
      accent: "#15803d",
      accentDark: "#166534",
      services: [
        { title: "Lawn Care", desc: "Mowing, edging, and seasonal cleanups that keep your yard sharp." },
        { title: "Tree & Yard Work", desc: "Trimming, hauling, and brush removal handled same-day." },
        { title: "Handyman Repairs", desc: "Small fixes around the home and yard, done dependably." },
        { title: "Equipment Service", desc: "Lawn-mower repair and tune-ups to keep you running." },
      ],
    };
  }
  return {
    accent: "#1d4ed8",
    accentDark: "#1e3a8a",
    services: [
      { title: "Trusted Service", desc: "Reliable, professional work from a highly-rated local team." },
      { title: "Fair Pricing", desc: "Honest, up-front quotes with no surprises." },
      { title: "Local & Responsive", desc: "Fast scheduling and friendly, neighborly service." },
      { title: "Satisfaction First", desc: "We are not done until you are happy with the result." },
    ],
  };
}

export function renderSiteHtml(p: SiteProspect): string {
  const name = p.businessName;
  const category = p.category || "Local Business";
  const theme = themeFor(category);
  const rating = p.rating ?? 0;
  const reviews = p.reviewCount ?? 0;
  const ratingLine = rating > 0 ? `${rating.toFixed(1)} ★ · ${reviews} reviews` : "Trusted by the community";
  const phone = p.phone && /\d/.test(p.phone) ? p.phone : null;
  const telHref = phone ? phone.replace(/[^0-9+]/g, "") : null;
  const reviewQuotes = (p.topReviews || "")
    .split(/;|\|/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const ctaHref = telHref ? `tel:${telHref}` : p.mapsUrl || "#contact";
  const ctaLabel = phone ? `Call ${phone}` : "Get in Touch";
  const year = new Date().getFullYear();

  const services = theme.services
    .map(
      (s) => `        <article class="card">
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.desc)}</p>
        </article>`,
    )
    .join("\n");

  const reviewsHtml =
    reviewQuotes.length > 0
      ? reviewQuotes
          .map(
            (q) => `        <figure class="review">
          <div class="stars" aria-hidden="true">★★★★★</div>
          <blockquote>“${esc(q)}”</blockquote>
        </figure>`,
          )
          .join("\n")
      : `        <figure class="review"><blockquote>Highly rated by local customers.</blockquote></figure>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(name)} — ${esc(category)}</title>
  <meta name="description" content="${esc(name)} — ${esc(category)}${p.address ? " in " + esc(p.address) : ""}. ${esc(ratingLine)}." />
  <meta name="generator" content="LocalSite AI" />
  <style>
    :root {
      --accent: ${theme.accent};
      --accent-dark: ${theme.accentDark};
      --ink: #1f2937;
      --muted: #6b7280;
      --bg: #f8fafc;
      --card: #ffffff;
      --line: #e5e7eb;
      --maxw: 1080px;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: var(--ink); background: var(--bg); line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    .container { width: 100%; max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
    .btn { display: inline-block; background: var(--accent); color: #fff; padding: 14px 26px; border-radius: 10px; font-weight: 600; transition: background .2s; }
    .btn:hover { background: var(--accent-dark); }
    .btn-ghost { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.6); }
    header.site { position: sticky; top: 0; background: rgba(255,255,255,.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); z-index: 10; }
    .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; max-width: var(--maxw); margin: 0 auto; }
    .brand { font-weight: 800; font-size: 1.15rem; color: var(--accent-dark); }
    .nav a.cta { background: var(--accent); color: #fff; padding: 9px 18px; border-radius: 8px; font-weight: 600; }
    .hero { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff; padding: 88px 0 72px; }
    .hero .eyebrow { text-transform: uppercase; letter-spacing: 2px; font-size: .8rem; opacity: .85; margin: 0 0 12px; }
    .hero h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); margin: 0 0 14px; line-height: 1.1; }
    .hero p.tag { font-size: 1.2rem; opacity: .95; margin: 0 0 22px; max-width: 620px; }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,.18); padding: 8px 16px; border-radius: 999px; font-weight: 600; margin-bottom: 26px; }
    .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
    .trust { background: var(--accent-dark); color: #fff; }
    .trust .container { display: flex; flex-wrap: wrap; gap: 28px; justify-content: center; padding: 18px 24px; font-weight: 600; opacity: .95; }
    section.block { padding: 72px 0; }
    .section-head { text-align: center; max-width: 640px; margin: 0 auto 44px; }
    .section-head h2 { font-size: 2rem; margin: 0 0 10px; }
    .section-head p { color: var(--muted); margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 22px; }
    .card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 26px; }
    .card h3 { margin: 0 0 8px; color: var(--accent-dark); }
    .card p { margin: 0; color: var(--muted); }
    .reviews { background: #fff; }
    .review { margin: 0; background: var(--bg); border: 1px solid var(--line); border-radius: 14px; padding: 24px; }
    .review .stars { color: #f59e0b; margin-bottom: 8px; }
    .review blockquote { margin: 0; font-style: italic; }
    .contact { background: var(--accent-dark); color: #fff; }
    .contact .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .contact h2 { font-size: 2rem; margin: 0 0 14px; }
    .contact .info p { margin: 6px 0; opacity: .95; }
    footer.site { background: #0f172a; color: #cbd5e1; text-align: center; padding: 28px 24px; font-size: .9rem; }
    @media (max-width: 760px) { .contact .grid2 { grid-template-columns: 1fr; } .nav a:not(.cta):not(.brand) { display: none; } }
  </style>
</head>
<body>
  <header class="site">
    <div class="nav">
      <a href="#top" class="brand">${esc(name)}</a>
      <nav>
        <a href="#services">Services</a>
        <a href="#reviews">Reviews</a>
        <a href="#contact">Contact</a>
        <a class="cta" href="${esc(ctaHref)}">${esc(ctaLabel)}</a>
      </nav>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="container">
        <p class="eyebrow">${esc(category)}${p.address ? " · " + esc(p.address.split(",").slice(-2).join(",").trim()) : ""}</p>
        <div class="badge">★ ${esc(ratingLine)}</div>
        <h1>${esc(name)}</h1>
        <p class="tag">Professional ${esc(category.toLowerCase())} service trusted across the local community.</p>
        <div class="hero-actions">
          <a class="btn" href="${esc(ctaHref)}">${esc(ctaLabel)}</a>
          <a class="btn btn-ghost" href="#services">View Services</a>
        </div>
      </div>
    </section>

    <div class="trust">
      <div class="container">
        <span>★ ${esc(ratingLine)}</span>
        ${p.hours ? `<span>⏰ ${esc(p.hours)}</span>` : ""}
        ${p.address ? `<span>📍 ${esc(p.address)}</span>` : ""}
      </div>
    </div>

    <section class="block" id="services">
      <div class="container">
        <div class="section-head">
          <h2>What We Offer</h2>
          <p>Dependable ${esc(category.toLowerCase())} services delivered with care and craftsmanship.</p>
        </div>
        <div class="grid">
${services}
        </div>
      </div>
    </section>

    <section class="block reviews" id="reviews">
      <div class="container">
        <div class="section-head">
          <h2>What Customers Say</h2>
          <p>${esc(ratingLine)}</p>
        </div>
        <div class="grid">
${reviewsHtml}
        </div>
      </div>
    </section>

    <section class="block contact" id="contact">
      <div class="container">
        <div class="grid2">
          <div>
            <h2>Get in Touch</h2>
            <p>Ready to get started? Reach out and we will take care of the rest.</p>
            <p style="margin-top:18px"><a class="btn" href="${esc(ctaHref)}">${esc(ctaLabel)}</a></p>
          </div>
          <div class="info">
            ${phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : ""}
            ${p.address ? `<p><strong>Address:</strong> ${esc(p.address)}</p>` : ""}
            ${p.hours ? `<p><strong>Hours:</strong> ${esc(p.hours)}</p>` : ""}
            ${p.mapsUrl ? `<p><a class="btn btn-ghost" href="${esc(p.mapsUrl)}" target="_blank" rel="noopener">Find us on the map</a></p>` : ""}
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site">
    <p>&copy; ${year} ${esc(name)}. All rights reserved. · Site by <strong>LocalSite AI</strong></p>
  </footer>
</body>
</html>
`;
}

