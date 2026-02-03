type SeoConfig = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  canonical?: string;
  type?: string;
};

const setMeta = (attr: "name" | "property", key: string, value: string) => {
  if (!value) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const setLink = (rel: string, href: string) => {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const setJsonLd = (id: string, payload: Record<string, unknown>) => {
  const scriptId = `jsonld-${id}`;
  let el = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = scriptId;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
};

export const applyBaseSeo = (config: SeoConfig) => {
  const { title, description, image, imageAlt, noIndex, canonical, type } = config;
  const origin = window.location.origin;
  const url = canonical ?? `${origin}${window.location.pathname}${window.location.search}`;
  const imagePath = image ?? "/og-image.svg";
  const imageUrl =
    imagePath.startsWith("http") ? imagePath : `${origin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;

  document.title = title;
  setMeta("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");
  setMeta("name", "description", description);
  setMeta("property", "og:site_name", "MuzikPick");
  setMeta("property", "og:locale", "ko_KR");
  setMeta("property", "og:type", type ?? "website");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", imageUrl);
  setMeta("property", "og:image:alt", imageAlt ?? "MuzikPick");
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:url", url);
  setMeta("name", "twitter:image", imageUrl);
  setMeta("name", "twitter:image:alt", imageAlt ?? "MuzikPick");
  setLink("canonical", url);

  setJsonLd("website", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MuzikPick",
    url: origin,
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  });
};
