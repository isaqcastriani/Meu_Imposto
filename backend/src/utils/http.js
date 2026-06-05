export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function validate(schema, data) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => ({
      campo: i.path.join('.'),
      erro: i.message,
    }));
    throw new ApiError(422, 'Dados invalidos', details);
  }
  return parsed.data;
}
