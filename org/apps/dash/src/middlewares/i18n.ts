import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from '../app/i18n/settings'
import type { NextFetchEvent, NextRequest } from 'next/server';
import { CustomMiddleware } from './chain';

acceptLanguage.languages(languages as any);

export function middlewareI18n(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    let lng
    if (request.cookies.has(cookieName)) lng = acceptLanguage.get(request.cookies.get(cookieName)?.value)
    if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
    if (!lng) lng = fallbackLng

    // Redirect if lng in path is not supported
    if (
      !languages.some((loc: string) => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
      !request.nextUrl.pathname.startsWith('/_next')
    ) {
      return NextResponse.redirect(new URL(`/${lng}${request.nextUrl.pathname}`, request.url))
    }

    if (request.headers.has('referer')) {
      const refererUrl = new URL(request.headers.get('referer') as string)
      const lngInReferer = languages.find((l: string) => refererUrl.pathname.startsWith(`/${l}`))
      const response = NextResponse.next()
      if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
      return response
    }

    return middleware(request, event, NextResponse.next())
  }
}