import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localeCookie: {
    name: "user_locale",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax" as const,
  },
  localePrefix: "always",
});

export const config = {
  matcher: ["/", "/(ru|en)/:path*"],
};
