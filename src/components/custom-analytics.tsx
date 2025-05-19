"use client";

import { COOKIE_PREFERENCES_KEY } from "@/lib/constants";
import { CookiePreferences } from "@/views/welcome/components/cookie-consent-manager";
import { Analytics } from "@vercel/analytics/react";

export function CustomAnalystics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
        if (savedPreferences) {
          const parsedPrefs = JSON.parse(savedPreferences) as CookiePreferences;
          if (parsedPrefs.analytics) {
            return null;
          } else {
            return event;
          }
        }

        return event;
      }}
    />
  );
}
