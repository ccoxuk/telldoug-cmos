import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeModeProvider } from "../helpers/themeMode";
import { AIChatStateProvider } from "../helpers/useAIChatState";
import { TooltipProvider } from "./Tooltip";
import { SonnerToaster } from "./SonnerToaster";
import { ScrollToHashElement } from "./ScrollToHashElement";
import { AIChatPanel } from "./AIChatPanel";
import { AuthGate } from "./AuthGate";

const AI_FEATURES_ENABLED = false;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute “fresh” window
    },
  },
});

export const GlobalContextProviders = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <ScrollToHashElement />
        <TooltipProvider>
          <AIChatStateProvider>
            <AuthGate>{children}</AuthGate>
            <SonnerToaster />
            {AI_FEATURES_ENABLED ? <AIChatPanel /> : null}
          </AIChatStateProvider>
        </TooltipProvider>
      </ThemeModeProvider>
    </QueryClientProvider>
  );
};
