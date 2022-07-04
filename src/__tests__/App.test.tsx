import { render } from "./testUtils";
import { App } from "../app/App";

describe("App", () => {
  test("should render correctly", () => {
    const wrapper = render(<App />);
    const app = wrapper.getByTestId("app");
  });
});
