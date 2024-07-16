import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

test("renders the root component without crashing", () => {
  const { container } = render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  expect(container).toBeDefined();
});
