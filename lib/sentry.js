// import * as Sentry from "@sentry/react-native";

// Sentry.init({
//   dsn: "https://df6883549ffcef996a3efa124d556367@o4510996521418752.ingest.us.sentry.io/4510996523450368",

//   environment: __DEV__ ? "development" : "production",

//   tracesSampleRate: 0.1,

//   sendDefaultPii: true,

//   enableAutoSessionTracking: true,

//   integrations: [
//     Sentry.reactNativeTracingIntegration(),

//     // 🔥 THIS IS WHAT YOU WERE MISSING
//     Sentry.reactNativeReplayIntegration({
//       maskAllText: false,   // set true if you want privacy mode
//       maskAllImages: false, // hides images if true
//     }),
//   ],

//   // 🔥 SESSION REPLAY SETTINGS (IMPORTANT)
//   replaysSessionSampleRate: 0.1, // 10% of sessions
//   replaysOnErrorSampleRate: 1.0, // 100% of error sessions
// });

import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://df6883549ffcef996a3efa124d556367@o4510996521418752.ingest.us.sentry.io/4510996523450368",

  environment: __DEV__ ? "development" : "production",

  tracesSampleRate: __DEV__ ? 1.0 : 0.1,

  sendDefaultPii: false,

  enableAutoSessionTracking: true,

  integrations: [
    Sentry.reactNativeTracingIntegration(),
  ],
});