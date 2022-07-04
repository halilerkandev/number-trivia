import * as Json from "fp-ts/Json";
import axios, { AxiosRequestConfig } from "axios";

export class NumbersAPIAxios {
  static async getTriviaByNumber(number: number) {
    const config: AxiosRequestConfig = {
      baseURL: "http://numbersapi.com",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.get(`${number}?json&notfound=floor`, config);
    return { data: result.data as Json.JsonRecord, status: result.status };
  }

  static async getRandomTrivia() {
    const config: AxiosRequestConfig = {
      baseURL: "http://numbersapi.com",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.get("random/trivia?json", config);
    return { data: result.data as Json.JsonRecord, status: result.status };
  }
}
