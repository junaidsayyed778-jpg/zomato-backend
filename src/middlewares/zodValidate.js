export const zodValidate = (schema) => (req, res, next) => {
  try {
    // First, try validating the plain body (the most common pattern)
    const bodyResult = schema.safeParse(req.body);
    if (bodyResult.success) {
      return next();
    }

    // Fallback: validate against an object containing body, params and query
    const fullResult = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (fullResult.success) {
      return next();
    }

    // Prefer errors from the fullResult, otherwise from bodyResult
    const issues = fullResult.error?.issues || bodyResult.error?.issues || [];

    console.error(
      "ZOD ERROR 👉",
      issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }))
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  } catch (err) {
    console.error("ZOD VALIDATION ERROR:", err);
    return res.status(500).json({ success: false, message: "Validation error" });
  }
};
