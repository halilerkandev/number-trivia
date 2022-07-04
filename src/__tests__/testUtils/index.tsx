import * as React from "react";
import {
  render as rntlRender,
  RenderResult,
} from "@testing-library/react-native";

type RenderOptions = {
  wrapper?: React.ComponentType<any>;
  createNodeMock?: (element: React.ReactElement) => any;
};

type CustomRenderOptions = {
  renderOptions?: Omit<RenderOptions, "wrapper">;
};

type CustomRenderResult = RenderResult;

function render(
  ui: React.ReactElement,
  { ...renderOptions }: CustomRenderOptions = {}
): CustomRenderResult {
  const Wrapper: React.FC = ({ children }) => {
    return <>{children}</>;
  };
  const renderResult = rntlRender(ui, { wrapper: Wrapper, ...renderOptions });
  return { ...renderResult };
}

export * from "@testing-library/react-native";
export { render };
