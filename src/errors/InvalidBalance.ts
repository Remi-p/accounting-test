import HttpErrors from 'http-errors';

export class InvalidBalanceError extends HttpErrors.UnprocessableEntity {}
