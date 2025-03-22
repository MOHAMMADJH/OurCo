import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/blog.css";
import "./styles/prism.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// تغيير هنا: استخدام "/" كـ basename بدلاً من import.meta.env.BASE_URL
// لأن BASE_URL قد تكون غير محددة بشكل صحيح في بيئة التطوير

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
