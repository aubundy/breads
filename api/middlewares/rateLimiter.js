import rateLimit from "express-rate-limit";

export const placeDetailsLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // per window
  message: "You have exceeded the 50 API calls per day limit",
  keyGenerator: () => "global_rate_limit_bucket", // a single bucket for all users
});
