import React from "react";
import { createRoot } from "react-dom/client";
import App from '@/App'

// const App = () => <h1>Hello Astra CLI ✨</h1>;

const root = createRoot(document.getElementById("root"));
root.render(<App />);
