jest.mock("axios");
import axios from "axios";
import * as Json from "fp-ts/Json";

import { NumbersAPIAxios } from "../../../../../app/features/numberTrivia/data/axios/numbersAPIAxios";
import trivia from "../../../../testUtils/trivia.json";

describe("Numbers API", () => {
  const tNumber = 1;
  const tTriviaJson: Json.JsonRecord = trivia;

  const getSpy = jest.spyOn(axios, "get");

  const getTriviaByNumberSpy = jest.spyOn(NumbersAPIAxios, "getTriviaByNumber");
  const getRandomTriviaSpy = jest.spyOn(NumbersAPIAxios, "getRandomTrivia");

  beforeEach(() => {
    getSpy.mockClear();
    getTriviaByNumberSpy.mockClear();
    getRandomTriviaSpy.mockClear();
  });

  test("should get trivia by number", async () => {
    // arrange
    getSpy.mockImplementation(() =>
      Promise.resolve({
        data: tTriviaJson,
        status: 200,
      })
    );
    // act
    const result = await NumbersAPIAxios.getTriviaByNumber(tNumber);
    // assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(NumbersAPIAxios.getTriviaByNumber).toHaveBeenCalledTimes(1);
    expect(NumbersAPIAxios.getTriviaByNumber).toHaveBeenCalledWith(tNumber);
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject(tTriviaJson);
  });

  test("should get random trivia", async () => {
    // arrange
    getSpy.mockImplementation(() =>
      Promise.resolve({
        data: tTriviaJson,
        status: 200,
      })
    );
    // act
    const result = await NumbersAPIAxios.getRandomTrivia();
    // assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(NumbersAPIAxios.getRandomTrivia).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject(tTriviaJson);
  });
});
