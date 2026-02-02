type SeoConfig = {
  title: string;
  description: string;
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
  const { title, description } = config;
  const origin = window.location.origin;
  const url = `${origin}${window.location.pathname}${window.location.search}`;

  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:url", url);
  setLink("canonical", url);

  setJsonLd("website", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MuzikPick",
    url: origin,
    inLanguage: "ko-KR"
  });
};
