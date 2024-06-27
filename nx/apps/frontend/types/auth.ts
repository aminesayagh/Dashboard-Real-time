import { SessionContextValue } from 'next-auth/react';

export type Session<T extends boolean = false> = SessionContextValue<T>['data'];
