import React, { useEffect } from "react";
import Muya from "@marktext/muya";

const MarkText = () => {
  useEffect(() => {
    const container = document.querySelector("#editor") as HTMLElement;
    if (container) {
      new Muya(container);
    }
  }, []);

  return <div id="editor"></div>;
};

export default MarkText;
