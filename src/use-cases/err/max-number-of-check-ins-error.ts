export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super("Limit of daily check-ins reached!");
  }
}