import { describe, it, expect, beforeEach } from "vitest";
import { saveOfflineDraft, getOfflineDraft, clearOfflineDraft } from "./offlineStorage";

describe("Offline Storage Utility", () => {
  const store = {};

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    globalThis.localStorage = {
      getItem: (key) => store[key] || null,
      setItem: (key, val) => { store[key] = String(val); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it("saves, retrieves, and clears offline draft data", async () => {
    const key = "test_scores_g11";
    const data = { 1: { score: 92, comments: "Excellent" } };

    const saved = await saveOfflineDraft(key, data);
    expect(saved).toBe(true);

    const retrieved = await getOfflineDraft(key);
    expect(retrieved).toEqual(data);

    await clearOfflineDraft(key);
    const cleared = await getOfflineDraft(key);
    expect(cleared).toBeNull();
  });
});
