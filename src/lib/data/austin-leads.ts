// Austin/Leander/Cedar Park seed dataset — the 8 verified prospects from the
// "Austin Leads" sheet (sh_uqOVm8mM). Single source of truth shared by the DB
// seed script and the mock/seed scraper provider.
//
// `hasWebsite` is derived from the raw "has_website" notes: businesses with a
// real (even if thin) live site get hasWebsite=true + websiteUrl; booking-only
// (Booksy/Fresha), expired, or abandoned-free-host listings count as no website.

export interface SeedProspect {
  businessName: string;
  phone: string | null;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  hours: string;
  topReviews: string;
  mapsUrl: string;
  hasWebsite: boolean;
  websiteUrl: string | null;
  // Optional pre-built static site already committed under sites/<slug>/.
  builtSiteUrl?: string | null;
  status?: "new" | "site_built";
}

export const AUSTIN_LEADS: SeedProspect[] = [
  {
    businessName: "Plumb Doctors Inc.",
    phone: "(512) 960-0044",
    category: "Plumbing",
    rating: 4.9,
    reviewCount: 576,
    address: "1519 Dillon Lake Bend, Leander, TX 78641",
    hours: "Open 24 hours / 7 days",
    topReviews:
      "Same-day service; named techs Josh & Marc praised for transparency; tankless water heater specialist",
    mapsUrl: "https://maps.app.goo.gl/PlumbDoctors",
    hasWebsite: true,
    websiteUrl: "https://plumbdocs.com",
  },
  {
    businessName: "Piña Cool-ada Heating Cooling & Air",
    phone: "(512) 900-6512",
    category: "HVAC",
    rating: 5,
    reviewCount: 129,
    address: "1706 Hur Industrial Blvd Suite 220, Cedar Park, TX 78613",
    hours: "Mon–Fri 7AM–7PM",
    topReviews:
      "Owner Bryan praised for professionalism; quick response; honest pricing; competitive rates — formerly Blue Wave Heating & Air",
    mapsUrl: "https://maps.app.goo.gl/PinaCoolada",
    hasWebsite: false,
    websiteUrl: null,
  },
  {
    businessName: "RiRi's Place",
    phone: "Book via Booksy",
    category: "Barbershop",
    rating: 5,
    reviewCount: 198,
    address: "11620 Hero Way W Suite 17, Leander, TX 78641",
    hours: "By appointment (Booksy)",
    topReviews:
      "5.0★ across 198 confirmed clients; known for kids cuts, fades, perms; loyal repeat clientele",
    mapsUrl:
      "https://booksy.com/en-us/397569_riris-place_barber-shop_37500_leander",
    hasWebsite: false,
    websiteUrl: null,
  },
  {
    businessName: "Lexi Did My Fade",
    phone: "(512) 270-0622",
    category: "Barbershop / Salon",
    rating: 5,
    reviewCount: 114,
    address: "1335 E Whitestone Blvd Suite V, Cedar Park, TX 78613",
    hours: "By appointment (Booksy)",
    topReviews:
      "5.0★ across 114 confirmed clients; fades, perms, lash lift, bridal; highly responsive",
    mapsUrl:
      "https://booksy.com/en-us/470649_lexi-did-my-fade_barber-shop_37606_cedar-park",
    hasWebsite: false,
    websiteUrl: null,
  },
  {
    businessName: "KD Air Pro",
    phone: "(512) 590-4863",
    category: "HVAC",
    rating: 4.9,
    reviewCount: 44,
    address: "3404 Bratton Ridge Crossing, Austin, TX 78728",
    hours: "Serving Austin area",
    topReviews:
      "Kevin fits same-day calls; praised for honesty, efficiency, fair pricing across 38+ reviews",
    mapsUrl: "https://www.yelp.com/biz/kd-air-pro-austin-2",
    hasWebsite: true,
    websiteUrl: "https://kdairpro.com",
  },
  {
    businessName: "Green Air Conditioning & Heating",
    phone: null,
    category: "HVAC",
    rating: 4.8,
    reviewCount: 74,
    address: "200 White Oak, Austin, TX 78753",
    hours: "Serving Austin area",
    topReviews:
      "Warranty honored; team registers products for customers; Seamus (owner) known for going above & beyond",
    mapsUrl:
      "https://www.yelp.com/biz/green-air-conditioning-and-heating-austin",
    hasWebsite: false,
    websiteUrl: null,
  },
  {
    businessName: "Raine's Lawn & Handyman Service",
    phone: null,
    category: "Landscaping",
    rating: 4.8,
    reviewCount: 127,
    address: "16316 Spotted Eagle Dr, Leander, TX 78641",
    hours: "Mon–Sat 7AM–9PM / Sun 9AM–5PM",
    topReviews:
      "Owner Duane responds fast on Yelp; same-day house calls; lawn mower repair + tree trimming + yard work",
    mapsUrl:
      "https://www.yelp.com/biz/raines-lawn-and-handyman-service-leander",
    hasWebsite: false,
    websiteUrl: null,
  },
  {
    businessName: "ByLizstudio",
    phone: "Book via Booksy",
    category: "Nail Salon",
    rating: 5,
    reviewCount: 17,
    address: "205 N Mount Rushmore Dr, Cedar Park, TX 78613",
    hours: "By appointment (Booksy)",
    topReviews:
      "Lismary praised for nail art detail and client care; 17 confirmed 5-star reviews (emerging prospect)",
    mapsUrl:
      "https://booksy.com/en-us/1566411_bylizstudio_nail-salon_37606_cedar-park",
    hasWebsite: false,
    websiteUrl: null,
    // Already has a hand-built static site committed under sites/bylizstudio/.
    builtSiteUrl: "/sites/bylizstudio/",
    status: "site_built",
  },
];

