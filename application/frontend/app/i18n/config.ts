import  { NestedWithoutKey } from '../../types/helpers';

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


type AllKeysWithoutPath = NestedWithoutKey<typeof ROUTER_CONFIGS, 'path'>;

