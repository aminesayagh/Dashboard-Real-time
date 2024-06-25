'use client'
import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation as useTranslationOrg } from 'react-i18next';
import { useCookies } from 'react-cookie';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages, cookieName, Lang, Namespace } from './settings';
export { generatePageUrl } from './settings';
import { } from 'shared-ts';


const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: Lang, namespace: Namespace) => import(`@public/locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : []
  })


export function useTranslation(lng: Lang, ns: Namespace, options: any = {}) {
  const [cookies, setCookie] = useCookies([cookieName])
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return
      i18n.changeLanguage(lng)
    }, [lng, i18n])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (cookies.i18next === lng) return
      setCookie(cookieName, lng, { path: '/' })
    }, [lng, cookies.i18next, setCookie])
  }
  return ret
}

// write a hook to switch language on client side and save it to cookie
export function useSwitchLanguage() {
  const [_, setCookie] = useCookies([cookieName])
  const { i18n } = useTranslationOrg()
  
  return {
    switchLanguage: (lang: Lang) => {
      const actualLang = i18n.resolvedLanguage;
      console.log('actualLang ', actualLang, 'lang ', lang);
      if (actualLang === lang) return
      const currentPath = window.location.pathname;
      const currentPathArr = currentPath.split('/');
      const currentLang = currentPathArr[1];
      const newPath = currentPath.replace(currentLang, lang);
      window.history.pushState({}, '', newPath);
      i18n.changeLanguage(lang);

      setCookie(cookieName, lang, { path: '/' })
    }
  }
}