import {
  upsertRecordAction,
  getRecordsAction,
  deleteAllRecordsAction,
  getDashboardAction,
  getAnalyticsAction,
  getRecommendationsAction,
} from "@/app/actions/wellness";

jest.mock("@/lib/server/fetch", () => ({
  fetchServer: jest.fn(),
}));

import { fetchServer } from "@/lib/server/fetch";

describe("wellness actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("upsertRecordAction", () => {
    it("should call fetchServer with correct parameters", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const date = "2024-06-15";
      const metrics = { mood: 8, sleep_hours: 7, activity: 6, stress: 3, energy: 7, focus: 8 };

      const result = await upsertRecordAction(date, metrics);

      expect(fetchServer).toHaveBeenCalledWith("/v1/wellness/records", "POST", { date, metrics });
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when API fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await upsertRecordAction("2024-06-15", {
        mood: 8,
        sleep_hours: 7,
        activity: 6,
        stress: 3,
        energy: 7,
        focus: 8,
      });

      expect(result).toEqual({ ok: false, error: "Failed to save record" });
    });
  });

  describe("getRecordsAction", () => {
    it("should return records data", async () => {
      const mockRecords = {
        records: [
          {
            date: "2024-06-15",
            metrics: { mood: 8, sleep_hours: 7, activity: 6, stress: 3, energy: 7, focus: 8 },
          },
        ],
      };
      (fetchServer as jest.Mock).mockResolvedValue(mockRecords);

      const result = await getRecordsAction(2024, 6);

      expect(fetchServer).toHaveBeenCalledWith("/v1/wellness/records/2024/6");
      expect(result.ok).toBe(true);
      expect(result.data).toEqual(mockRecords);
    });

    it("should return failure when API fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await getRecordsAction(2024, 6);

      expect(result.ok).toBe(false);
    });
  });

  describe("deleteAllRecordsAction", () => {
    it("should call delete endpoint", async () => {
      (fetchServer as jest.Mock).mockResolvedValue(undefined);

      const result = await deleteAllRecordsAction();

      expect(fetchServer).toHaveBeenCalledWith("/v1/wellness/records/all", "DELETE");
      expect(result).toEqual({ ok: true });
    });

    it("should return failure when API fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await deleteAllRecordsAction();

      expect(result).toEqual({ ok: false, error: "Failed to delete records" });
    });
  });

  describe("getDashboardAction", () => {
    it("should return dashboard data", async () => {
      const mockDashboard = {
        today: { mood: 8, sleep_hours: 7, activity: 6, stress: 3, energy: 7, focus: 8 },
        week: { mood: 7, sleep_hours: 7, activity: 5, stress: 4, energy: 6, focus: 7, changes: {} },
      };
      (fetchServer as jest.Mock).mockResolvedValue(mockDashboard);

      const result = await getDashboardAction("2024-06-15");

      expect(fetchServer).toHaveBeenCalledWith("/v1/wellness/dashboard/2024-06-15");
      expect(result.ok).toBe(true);
      expect(result.data).toEqual(mockDashboard);
    });

    it("should return failure when API fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await getDashboardAction("2024-06-15");

      expect(result.ok).toBe(false);
    });
  });

  describe("getAnalyticsAction", () => {
    it("should return analytics data", async () => {
      const mockAnalytics = { analytics: [] };
      (fetchServer as jest.Mock).mockResolvedValue(mockAnalytics);

      const result = await getAnalyticsAction();

      expect(fetchServer).toHaveBeenCalledWith("/v1/wellness/analytics");
      expect(result.ok).toBe(true);
      expect(result.data).toEqual(mockAnalytics);
    });

    it("should return failure when API fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await getAnalyticsAction();

      expect(result.ok).toBe(false);
    });
  });

  describe("getRecommendationsAction", () => {
    it("should return recommendations data", async () => {
      const mockRecommendations = { recommendations: [], generated_at: "2024-06-15" };
      (fetchServer as jest.Mock).mockResolvedValue(mockRecommendations);

      const result = await getRecommendationsAction();

      expect(fetchServer).toHaveBeenCalledWith("/v1/wellness/recommendations");
      expect(result.ok).toBe(true);
      expect(result.data).toEqual(mockRecommendations);
    });

    it("should return failure when API fails", async () => {
      (fetchServer as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await getRecommendationsAction();

      expect(result.ok).toBe(false);
    });
  });
});
