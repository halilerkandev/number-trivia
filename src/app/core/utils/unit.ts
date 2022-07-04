export class Unit {}

export const unit = new Unit();

export function isUnit(val: any): boolean {
  return val instanceof Unit;
}
