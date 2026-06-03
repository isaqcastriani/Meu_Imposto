/** Erro de aplicacao com status HTTP. Lance com `throw new ApiError(404, 'msg')`. */
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Envolve um handler async e encaminha erros para o middleware de erro. */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/** Valida o corpo/params com um schema Zod e devolve os dados ja parseados. */
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
