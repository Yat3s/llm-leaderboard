/* eslint-disable */

import { i18nRouter } from "next-i18n-router";
import i18nConfig from "../i18n.config";

export function middleware(request: any) {
  return i18nRouter(request, i18nConfig);
}

// applies this middleware only to files in the app directory
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
