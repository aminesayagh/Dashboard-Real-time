export const fallbackLng = "en";
export const languages = [fallbackLng, "fr"] as const;
export const defaultNS = 'translation';
export const namespaces = [defaultNS, 'common', 'form', 'dash'] as const;
export const cookieName = 'i18next';

export type Lang = typeof languages[number];
export type Namespace = typeof namespaces[number];

export function getOptions (lng = fallbackLng, ns = defaultNS) {
    return {
      // debug: true,
      supportedLngs: languages,
      fallbackLng,
      lng,
      fallbackNS: defaultNS,
      defaultNS,
      ns
    }
  }