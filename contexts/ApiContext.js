import { createContext, useContext, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import * as Sentry from "@sentry/react-native";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const { getToken, signOut } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "https://c-hub-backend.onrender.com",
    });

    // =========================
    // REQUEST INTERCEPTOR
    // =========================
    instance.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 🔥 attach request context to Sentry
        Sentry.addBreadcrumb({
          category: "api.request",
          message: config.url,
          data: {
            method: config.method,
            url: config.url,
          },
        });

        return config;
      },
      (error) => {
        Sentry.captureException(error);
        return Promise.reject(error);
      }
    );

    // =========================
    // RESPONSE INTERCEPTOR
    // =========================
    instance.interceptors.response.use(
      (res) => {
        // optional success tracking (lightweight)
        Sentry.addBreadcrumb({
          category: "api.response",
          message: res.config.url,
          data: {
            status: res.status,
          },
        });

        return res;
      },

      async (error) => {
        const status = error?.response?.status;

        // 🔥 FULL ERROR CAPTURE
        Sentry.captureException(error, {
          tags: {
            layer: "api",
            status: status || "unknown",
          },
          extra: {
            url: error?.config?.url,
            method: error?.config?.method,
            data: error?.response?.data,
          },
        });

        if (status === 401) {
          try {
            // await signOut();
          } catch (e) {
            Sentry.captureException(e);
          }

          router.replace("/(auth)");
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken, signOut]);

  return (
    <ApiContext.Provider value={{ api }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);