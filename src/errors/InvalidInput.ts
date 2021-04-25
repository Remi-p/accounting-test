import HttpErrors from 'http-errors';

export class InvalidInputError extends HttpErrors.UnprocessableEntity {}
