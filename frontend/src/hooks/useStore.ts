import { useSyncExternalStore, useCallback } from "react";
import { subscribe, getTerminals, getTransactions, getSummary, type Summary } from "@/lib/store";

export function useTerminals() {
  return useSyncExternalStore(subscribe, getTerminals);
}

export function useTransactions() {
  return useSyncExternalStore(subscribe, getTransactions);
}

// Cache summary to avoid new object on every call
let cachedSummary: Summary | null = null;
let summaryVersion = 0;
let lastVersion = -1;

const originalSubscribe = subscribe;
const summarySubscribe = (listener: () => void) => {
  return originalSubscribe(() => {
    summaryVersion++;
    listener();
  });
};

function getCachedSummary(): Summary {
  if (!cachedSummary || lastVersion !== summaryVersion) {
    cachedSummary = getSummary();
    lastVersion = summaryVersion;
  }
  return cachedSummary;
}

export function useSummary() {
  return useSyncExternalStore(summarySubscribe, getCachedSummary);
}
