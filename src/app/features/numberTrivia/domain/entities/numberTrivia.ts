import { Entity } from "../../../../core/entities/entity";

export class NumberTrivia extends Entity {
  constructor(public text: string, public number: number) {
    super();
  }
}
