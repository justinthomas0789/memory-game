import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
}

function getMeta(name: string): string {
  return (
    document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ??
    document
      .querySelector(`meta[property="${name}"]`)
      ?.getAttribute('content') ??
    ''
  );
}

function setMeta(selector: string, attr: 'content', value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const prev = {
      title: document.title,
      description: getMeta('description'),
      canonical:
        document.querySelector('link[rel="canonical"]')?.getAttribute('href') ??
        '',
      ogTitle: getMeta('og:title'),
      ogDescription: getMeta('og:description'),
      ogUrl: getMeta('og:url'),
    };

    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', meta.canonical);
    if (meta.ogTitle)
      setMeta('meta[property="og:title"]', 'content', meta.ogTitle);
    if (meta.ogDescription)
      setMeta('meta[property="og:description"]', 'content', meta.ogDescription);
    if (meta.ogUrl) setMeta('meta[property="og:url"]', 'content', meta.ogUrl);

    return () => {
      document.title = prev.title;
      setMeta('meta[name="description"]', 'content', prev.description);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', prev.canonical);
      setMeta('meta[property="og:title"]', 'content', prev.ogTitle);
      setMeta('meta[property="og:description"]', 'content', prev.ogDescription);
      setMeta('meta[property="og:url"]', 'content', prev.ogUrl);
    };
  }, []);
}
