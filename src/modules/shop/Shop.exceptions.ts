export class NoBankAccountFoundError extends Error {
  constructor() {
    super('no bank account details found against shop');
    this.name = 'NoBankAccountFoundError';
  }
}
