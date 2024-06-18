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
import path from 'path';
import { signOut } from 'next-auth/react';


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
  'home': {
    path: '/',
  },
  'login': {
    path: '/auth/login',
  },
  'register': {
    path: '/auth/register',
  },
  '404': {
    path: '/404',
  },
  'dash': {
    path: '/dash'
  }
} as const;

const ROUTER_CONFIGS = {
  'home': {
    path: '/'
  },
  auth: {
    'login': {
      path: '/auth/login'
    },
    'register': {
      path: '/auth/register'
    },
    'profile': {
      path: '/auth/profile'
    }
  },
  'dash': {
    'account': {
      'profile': {
        path: '/dash/account/profile'
      },
      logout: {
        path: '/auth/logout'
      }
    },
    'nav': {
      'dashboard': {
        path: '/dash'
      },
      'department': {
        path: '/dash/department'
      }
    },
    'taxonomies': {
      'category': {
        path: '/dash/taxonomies/category'
      }
    },
    'user': {
      'student': {
        path: '/dash/user/student'
      },
      'teacher': {
        path: '/dash/user/teacher'
      }
    },
  }
} as const;

type TPathNames = keyof typeof ROUTER_CONFIG;
const pathNames = Object.keys(ROUTER_CONFIG) as TPathNames[];

export function generatePageUrl(lng: Lang, path: LooseAutocomplete<TPathNames>): string {
  const isOnRoute = pathNames.includes(path as TPathNames);
  if (isOnRoute) {
    return `/${lng}${(ROUTER_CONFIG[path as TPathNames]).path}`
  }
  return `/${lng}/${path}`
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