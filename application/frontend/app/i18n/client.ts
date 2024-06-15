'use client'
import { useEffect, useState } from 'react';
import i18next from 'i18next'; 
import { initReactI18next } from 'react-i18next';
import { useTranslation as useTranslationOrg } from 'react-i18next';
import { useCookies } from 'react-cookie';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages, cookieName } from './settings';
import { Lang, Namespace } from './settings';
import { LooseAutocomplete } from '@/types/helpers';


const runsOnServerSide = typeof window === 'undefined';

// 
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

const ROUTER_CONFIG = {
  'home' : {
    path: '/',
  },
  'login' : {
    path: '/auth/login',
  },
  'register' : {
    path: '/auth/register',
  },
  '404' : {
    path: '/404',
  },
  'dash': {
    path: '/dash'
  }
} as const;

type TPathNames = keyof typeof ROUTER_CONFIG;
const pathNames = Object.keys(ROUTER_CONFIG) as TPathNames[];

export function generatePageUrl(lng: Lang, path: LooseAutocomplete<TPathNames>): string {
  const isOnRoute = pathNames.includes(path as TPathNames);
  if (runsOnServerSide) {
    if (isOnRoute) {
      return `/${lng}${(ROUTER_CONFIG[path as TPathNames]).path}`
    }
    return `/${lng}/${path}`
  }
  if (isOnRoute) {
    return (ROUTER_CONFIG[path as TPathNames]).path
  }
  return path as string;
}
