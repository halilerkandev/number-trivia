import * as Json from "fp-ts/Json";
import { CastException } from "../../../../core/error/exceptions";
import { NumberTrivia } from "../../domain/entities/numberTrivia";

export class NumberTriviaModel extends NumberTrivia {
  constructor(public text: string, public number: number) {
    super(text, number);
  }

  static fromJson(json: Json.JsonRecord) {
    if (
      json["text"] &&
      json["number"] &&
      typeof json["text"] === "string" &&
      typeof json["number"] === "number"
    ) {
      return new NumberTriviaModel(
        json["text"].valueOf(),
        json["number"].valueOf()
      );
    }
    throw new CastException();
  }

  toJson(): Json.JsonRecord {
    return {
      text: this.text,
      number: this.number,
    };
  }
}
