// It's a custom error class to take care in handler layer and make client side anwser friendly
export class BadRequestError {
  constructor(readonly message: string) {}
}
