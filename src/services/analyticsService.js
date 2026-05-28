import api from './api'; // Your existing Axios instance

export const getJudgeAnalytics = async (judgeName) => {
  try {
    const response = await api.get(`/analytics/judge?name=${encodeURIComponent(judgeName)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching judge analytics:", error);
    throw error.response?.data?.error || "Failed to fetch analytics. Please try again.";
  }
};