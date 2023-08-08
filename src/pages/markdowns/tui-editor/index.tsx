/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import mermaid from "mermaid";
import uml from "@toast-ui/editor-plugin-uml";

const Tui = () => {
  // function latexPlugin() {
  //   const toHTMLRenderers = {
  //     latex(node: any) {
  //       const generator = new latexjs.HtmlGenerator({ hyphenate: false });
  //       const { body } = latexjs
  //         .parse(node.literal, { generator })
  //         .htmlDocument();

  //       return [
  //         { type: "openTag", tagName: "div", outerNewLine: true },
  //         { type: "html", content: body.innerHTML },
  //         { type: "closeTag", tagName: "div", outerNewLine: true },
  //       ];
  //     },
  //   };

  //   return { toHTMLRenderers };
  // }

  mermaid.initialize({ startOnLoad: false });

  const mermaidPlugin = (context: any, options: any) => {
    console.log("mermaidPlugin context", context);
    const toHTMLRenderers = {
      async codeBlock(node: any, context: { origin: any; entering: any }) {
        const { origin, entering } = context;
        console.log("mermaid node", node);
        if (node.info !== "mermaid") {
          return origin();
        }
        const { svg } = await mermaid.render("mermaid", node.literal);
        console.log("svg ", svg);
        // const container = document.createElement("div");
        // container.innerHTML = svg;
        const result = [
          { type: "openTag", tagName: "div", outerNewLine: true },
          { type: "html", content: '<div>111</div>' },
          { type: "closeTag", tagName: "div", outerNewLine: true },
        ];
        console.log("result ", result);
        return result;
      },
      htmlInline(node: any) {
        console.log("mermaid htmlInline node", node);
        return [
          { type: "openTag", tagName: "div", outerNewLine: true },
          { type: "html", content: node.literal },
          { type: "closeTag", tagName: "div", outerNewLine: true },
        ];
      },
      htmlBlock(node: any) {
        console.log("mermaid htmlBlock node", node);
        return [
          { type: "openTag", tagName: "div", outerNewLine: true },
          { type: "html", content: '<input type="range" />' },
          { type: "closeTag", tagName: "div", outerNewLine: true },
        ];
      },
    };

    return { toHTMLRenderers };
  };

  return (
    <Editor
      initialValue="hello react editor world!"
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
      plugins={[uml]}
      customHTMLRenderer={
        {
          // htmlInline: {
          //   code(node: any) {
          //     console.log("mermaid node", node);
          //     return [
          //       { type: "openTag", tagName: "div", outerNewLine: true },
          //       { type: "html", content: node.literal },
          //       { type: "closeTag", tagName: "div", outerNewLine: true },
          //     ];
          //   },
          //   pre(node: any) {
          //     console.log("mermaid node", node);
          //     return [
          //       { type: "openTag", tagName: "div", outerNewLine: true },
          //       { type: "html", content: node.literal },
          //       { type: "closeTag", tagName: "div", outerNewLine: true },
          //     ];
          //   },
          // },
          // htmlInline: {
          //   mermaid(node: any, { entering }: any) {
          //     console.log(node, { entering });
          //   },
          // },
          async codeBlock(node: any, context: { origin: any; entering: any }) {
            const { origin, entering } = context;
            console.log("mermaid node", node);
            console.log(origin())
            if (node.info !== "mermaid") {
              return origin();
            }
            const { svg } = await mermaid.render("mermaid", node.literal);
            console.log("svg ", svg);
            // const container = document.createElement("div");
            // container.innerHTML = svg;
            const result = [
              { type: "openTag", tagName: "div", outerNewLine: true },
              { type: "html", content: '<div>111</div>' },
              { type: "closeTag", tagName: "div", outerNewLine: true },
            ];
            console.log("result 1", result);
            return result;
          }
        }
      }
    />
  );
};

export default Tui;
