"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ViewMode = "auto" | "mobile" | "desktop";

type ViewModeContextValue = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
};

const ViewModeContext = createContext<ViewModeContextValue>({
  mode: "auto",
  setMode: () => {},
});

const STORAGE_KEY = "bijyou-view-mode";

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>("auto");

  // 前回選んだ表示モードを復元する
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (saved === "auto" || saved === "mobile" || saved === "desktop") {
      setModeState(saved);
    }
  }, []);

  const setMode = (next: ViewMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return <ViewModeContext.Provider value={{ mode, setMode }}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
