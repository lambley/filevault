import React from "react";
import FileUpload from "./components/FileUpload";
import ThemeToggle from "./components/ThemeToggle";

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <h1>FileVault</h1>
        <ThemeToggle />
      </header>
      <FileUpload />
    </div>
  );
};

export default App;
