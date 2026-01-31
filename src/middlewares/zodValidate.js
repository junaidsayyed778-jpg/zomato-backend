export const zodValidate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (err) {
    const issues = err?.issues || [];

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
  }
};
