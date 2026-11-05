import type { PagesInput } from "@/lib/content/schema";

/**
 * Copy for index and utility pages. DRAFT lines come from docs/voice.md and
 * are awaiting sign-off.
 */
export const pages = {
  home: {
    title: "AION Consultancy",
    // DRAFT tagline: one sentence summarising the three pillars. Awaiting sign-off.
    intro:
      "Research, strategy and executive education for the people shaping cities and property markets.",
    hero: {
      image: {
        src: "/images/home/hero-thames.jpg",
        alt: "Aerial view along the River Thames in London, past Tower Bridge towards Canary Wharf, in evening light",
        width: 2400,
        height: 1600,
        credit: "Unsplash (photo-1513635269975)",
      },
      cta: { label: "Explore", href: "/expertise" },
    },
    seo: { title: "AION Consultancy" },
  },
  expertise: {
    eyebrow: "Expertise",
    // DRAFT (docs/voice.md)
    title: "Evidence for the long view.",
    intro:
      "We help governments and investors understand the places they're shaping, and we train the people who'll shape them next.",
    seo: {
      title: "Expertise",
      description:
        "Executive education, research and market intelligence, and strategy and regeneration from AION Consultancy.",
    },
  },
  work: {
    eyebrow: "Work",
    title: "Selected work.",
    intro: "[Introduction to selected projects]",
    seo: { title: "Work", noindex: true },
  },
  people: {
    eyebrow: "People",
    title: "Our team",
    intro:
      "A small group of senior academics-turned-practitioners, with decades of experience in universities, government rooms and on site.",
    seo: {
      title: "Our team",
      description: "The academics and practitioners behind AION Consultancy.",
    },
  },
  insights: {
    eyebrow: "Insights",
    title: "Insights.",
    seo: { title: "Insights", noindex: true },
  },
  contact: {
    title: "Contact us",
    seo: { title: "Contact", description: "Get in touch with AION Consultancy." },
  },
  // TODO(legal): both notices below are drafts written for a site that sets no
  // non-essential cookies. Have them reviewed by a qualified adviser before
  // launch, and update them if tracking, newsletters or new processors are added.
  privacy: {
    eyebrow: "Legal",
    title: "Privacy notice",
    intro:
      "How AION Consultancy Ltd collects and uses personal information through this website, under UK GDPR and the Data Protection Act 2018.",
    body: [
      {
        type: "paragraph",
        text: "[Draft for legal review. Last updated: date to be set on publication.]",
      },
      { type: "heading", text: "Who we are" },
      {
        type: "paragraph",
        text: "AION Consultancy Ltd (“AION”, “we”) is the controller of the personal information described here. Our company details are shown at the foot of every page, and you can reach us through the contact page.",
      },
      { type: "heading", text: "What we collect" },
      {
        type: "list",
        items: [
          "When you send us a message: your name, email address, organisation (if you give it), the type of enquiry and what you write.",
          "When you visit the site: technical information our hosting provider records in server logs, such as IP address, browser type and the pages requested.",
          "Anonymous, aggregated statistics about page views and site performance (Vercel Web Analytics and Speed Insights). These don’t use cookies and don’t identify you.",
          "On the contact form, Cloudflare Turnstile checks that a person rather than a bot is sending the message, using technical signals from your browser.",
        ],
      },
      { type: "heading", text: "Why we use it, and our lawful basis" },
      {
        type: "list",
        items: [
          "To reply to your enquiry and, if you ask, to discuss working together: our legitimate interest in responding to people who contact us, or steps taken at your request before entering a contract.",
          "To keep the site secure and free of spam: our legitimate interest in protecting the site and our inbox.",
          "To understand, in aggregate, how the site is used so we can improve it: our legitimate interest in running a useful website.",
        ],
      },
      { type: "heading", text: "Who we share it with" },
      {
        type: "paragraph",
        text: "We don’t sell personal information. We use a small number of service providers who process it on our behalf: Vercel (website hosting and analytics), Resend (delivering contact-form emails), Cloudflare (spam protection) and our email provider. Some are based outside the UK; where that’s the case, transfers are protected by appropriate safeguards such as the UK International Data Transfer Agreement or Addendum.",
      },
      { type: "heading", text: "How long we keep it" },
      {
        type: "paragraph",
        text: "[Retention period for enquiries, e.g. up to two years after our last contact, unless we go on to work together — to be confirmed.]",
      },
      { type: "heading", text: "Your rights" },
      {
        type: "paragraph",
        text: "You can ask to see the information we hold about you, and to have it corrected, deleted or restricted. You can also object to how we use it, or ask for a copy to take elsewhere. To make a request, get in touch through the contact page. If you’re unhappy with how we’ve handled your information, you can complain to the Information Commissioner’s Office (ico.org.uk).",
      },
      { type: "heading", text: "Changes" },
      {
        type: "paragraph",
        text: "If we change how we use personal information, we’ll update this notice and the date at the top.",
      },
    ],
    seo: { title: "Privacy", description: "How AION Consultancy uses personal information." },
  },
  cookies: {
    eyebrow: "Legal",
    title: "Cookies",
    intro: "We don’t use cookies to track you, so you won’t see a cookie banner on this site.",
    body: [
      {
        type: "paragraph",
        text: "[Draft for legal review. Last updated: date to be set on publication.]",
      },
      { type: "heading", text: "What we use" },
      {
        type: "list",
        items: [
          "Analytics: Vercel Web Analytics and Speed Insights measure page views and performance without cookies and without identifying you. Nothing is stored on your device.",
          "Spam protection: on the contact page, Cloudflare Turnstile may store strictly necessary information in your browser to check that a person is sending the message. It isn’t used for advertising or to track you across sites.",
          "Your browser may remember small preferences for this site, such as reduced motion. This stays on your device and isn’t sent to us.",
        ],
      },
      { type: "heading", text: "Why there’s no banner" },
      {
        type: "paragraph",
        text: "Under the UK’s Privacy and Electronic Communications Regulations, consent is needed for cookies and similar technologies that aren’t strictly necessary. We don’t use any, so there’s nothing to ask permission for. If we ever add analytics, advertising or embedded content that sets cookies, we’ll ask for your consent first and update this page.",
      },
      { type: "heading", text: "Controlling cookies" },
      {
        type: "paragraph",
        text: "You can block or delete cookies in your browser’s settings at any time. The site will keep working.",
      },
    ],
    seo: {
      title: "Cookies",
      description: "Cookies and similar technologies on the AION Consultancy website.",
    },
  },
  notFound: {
    eyebrow: "404",
    title: "This page has moved on.",
    intro: "The page you were looking for isn’t here. It may have moved when we rebuilt the site.",
    seo: { title: "Page not found", noindex: true },
  },
  error: {
    eyebrow: "Error",
    title: "Something went wrong.",
    intro: "Sorry, this page didn’t load. Try again, or come back in a moment.",
    seo: { title: "Error", noindex: true },
  },
} satisfies PagesInput;
