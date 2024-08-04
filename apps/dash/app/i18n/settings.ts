export const fallbackLng = "en";
export const languages = [fallbackLng, "fr"] as const;
export const defaultNS = 'translation';
export const namespaces = [defaultNS, 'common', 'form', 'dash'] as const;
export const cookieName = 'i18next';
import { KeysAsDotNotation } from '@/utils/types';

export type Lang = typeof languages[number];
export type Namespace = typeof namespaces[number];

export function getOptions(lng = fallbackLng, ns = defaultNS) {
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

export const ROUTER_CONFIGS = {
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
        },
        'verify': {
            path: '/auth/verify'
        },
        'error': {
            path: '/auth/error'
        },
        'logout': {
            path: '/auth/logout'
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
                path: '/dash/nav/department'
            },
            'analysis': {
                path: '/dash/nav/analysis'
            },
            'settings': {
                path: '/dash/nav/settings'
            }
        },
        'taxonomies': {
            'category': {
                path: '/dash/taxonomy/category'
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

export type RouteSettingPath = KeysAsDotNotation<typeof ROUTER_CONFIGS, {
    path: string;
}>;

export function generatePageUrl(lng: Lang, path: RouteSettingPath): string {
    const pathArray = path.split('.') as string[];
    let url = '';
    let current: any = ROUTER_CONFIGS;
    for (let i = 0; i < pathArray.length; i++) {
        current = current[pathArray[i] as keyof typeof current];
        if (!current) {
            throw new Error(`Invalid path: ${path}`);
        }
    }

    url = current.path;
    if (url === undefined) {
        throw new Error(`Invalid path: ${path}`);
    }

    return `/${lng}${url}`;
}