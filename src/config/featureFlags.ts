export const FEATURE_FLAGS = {
  legacyMode: true,
  geographicFeatures: false,
  coverageAnalytics: false,
  reporterRanking: false,
  geographicSearch: false,
  auditDashboard: false,
  revenueDashboard: false,
};

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
