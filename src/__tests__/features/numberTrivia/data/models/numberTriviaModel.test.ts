import * as Json from "fp-ts/Json";
import { CastException } from "../../../../../app/core/error/exceptions";

import { NumberTriviaModel } from "../../../../../app/features/numberTrivia/data/models/numberTriviaModel";
import { NumberTrivia } from "../../../../../app/features/numberTrivia/domain/entities/numberTrivia";

import trivia from "../../../../testUtils/trivia.json";

describe("NumberTriviaModel", () => {
  const tNumber = 1;
  const tText = "Test text";
  const tNumberTriviaModel = new NumberTriviaModel(tText, tNumber);
  const tNotProperJson: Json.JsonRecord = {};
  const tCastException = new CastException();

  test("should be a subclass of NumberTrivia entity", () => {
    // assert
    expect(tNumberTriviaModel).toBeInstanceOf(NumberTrivia);
  });

  describe("fromJson", () => {
    test("should return valid model from json record", () => {
      // act
      const result = NumberTriviaModel.fromJson(trivia);
      // assert
      expect(result).toMatchObject(tNumberTriviaModel);
    });

    test("should throw cast exception when json is not proper", async () => {
      // act
      // assert
      expect(() => NumberTriviaModel.fromJson(tNotProperJson)).toThrowError(
        tCastException
      );
    });
  });

  describe("toJson", () => {
    test("should return a json record containing the proper data", () => {
      // arrange
      const expectedJson: Json.JsonRecord = {
        number: tNumber,
        text: tText,
      };
      // act
      const result = tNumberTriviaModel.toJson();
      // assert
      expect(result).toMatchObject(expectedJson);
    });
  });
});
