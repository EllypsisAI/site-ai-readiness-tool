import { useEffect, useState } from 'react';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
}

export function useUtmParams(): UtmParams {
  const [utmParams, setUtmParams] = useState<UtmParams>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);

    const params: UtmParams = {
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined,
      utm_term: searchParams.get('utm_term') || undefined,
      utm_content: searchParams.get('utm_content') || undefined,
      referrer: document.referrer || undefined,
    };

    // Only set params that have values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    ) as UtmParams;

    setUtmParams(filteredParams);

    // Also store in sessionStorage so we don't lose them on navigation
    if (Object.keys(filteredParams).length > 0) {
      sessionStorage.setItem('utm_params', JSON.stringify(filteredParams));
    }
  }, []);

  // On mount, also check sessionStorage for previously captured params
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = sessionStorage.getItem('utm_params');
    if (stored && Object.keys(utmParams).length === 0) {
      try {
        setUtmParams(JSON.parse(stored));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  return utmParams;
}
