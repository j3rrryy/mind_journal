"use server";

import { fetchServer } from "@/lib/server/fetch";
import type { Dashboard, RecordList, Analytics, Recommendations, Metrics } from "@/types";
import { withActionResult, withResult } from "./error-handler";

export async function upsertRecordAction(date: string, metrics: Metrics) {
  return withActionResult(async () => {
    await fetchServer<void>("/v1/wellness/records", "POST", { date, metrics });
  }, "Failed to save record");
}

export async function getRecordsAction(year: number, month: number) {
  return withResult(
    () => fetchServer<RecordList>(`/v1/wellness/records/${year}/${month}`),
    "Failed to load records"
  );
}

export async function deleteAllRecordsAction() {
  return withActionResult(async () => {
    await fetchServer<void>("/v1/wellness/records/all", "DELETE");
  }, "Failed to delete records");
}

export async function getDashboardAction(date: string) {
  return withResult(
    () => fetchServer<Dashboard>(`/v1/wellness/dashboard/${date}`),
    "Failed to load dashboard"
  );
}

export async function getAnalyticsAction() {
  return withResult(
    () => fetchServer<Analytics>("/v1/wellness/analytics"),
    "Failed to load analytics"
  );
}

export async function getRecommendationsAction() {
  return withResult(
    () => fetchServer<Recommendations>("/v1/wellness/recommendations"),
    "Failed to load recommendations"
  );
}
