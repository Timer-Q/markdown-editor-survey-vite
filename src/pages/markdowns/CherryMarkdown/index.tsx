/* eslint-disable @typescript-eslint/no-namespace */
// import React from "react";
import { useEffect, useRef } from "react";
// import {createComponent} from '@lit-labs/react';
import Cherry from "cherry-markdown";
import "cherry-markdown/dist/cherry-markdown.min.css";
// import { SimpleGreeting as SimpleGreetingWC } from "../../../components/ImageCompare";
import "../../../components/ImageCompare/index.js";

// const SimpleGreeting = createComponent({
//   react: React,
//   tagName: 'simple-greeting',
//   elementClass: SimpleGreetingWC,
//   // Defines props that will be event handlers for the named events
//   events: {
//     onPop: 'pop',
//     onReset: 'reset',
//   },
// });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "hello-world": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const CherryMarkdown = () => {
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!instanceRef.current) {
      /**
       * 自定义一个语法
       */
      const CustomHookA = Cherry.createSyntaxHook(
        "codeBlock",
        Cherry.constants.HOOKS_TYPE_LIST.PAR,
        {
          beforeMakeHtml (str: any) {
            console.warn("custom hook", "hello");
            return str;
          },
          makeHtml(str: any) {
            console.warn("custom hook", "hello");
            return str;
          },
          afterMakeHtml (str: any) {
            console.warn("custom hook", "hello");
            return str;
          },
          // rule(str: any) {
          //   console.log("custom hook", "rule", new RegExp('`{3}[\\s\\S]+`{3}', "g") )
          //   return { reg: new RegExp('`{3}[\\s\\S]+`{3}', "g") };
          // },
          test(str: any) {
            console.log("custom hook", "test", str, new RegExp('`{3}[\\s\\S]+`{3}', "g").test(str) )
            return true;
          }
        }
      );
      const BlockSensitiveWordsHook = Cherry.createSyntaxHook('1codeBlock', Cherry.constants.HOOKS_TYPE_LIST.PAR, {
        // 开启缓存，用于保护内容
        needCache: true,
        // 预处理文本，避免受影响
        beforeMakeHtml(str) {
          console.log("custom hook", "beforeMakeHtml", str)
          return str.replace(this.RULE.reg, (match, code) => {
            const lineCount = (match.match(/\n/g) || []).length;
            const sign = this.$engine.md5(match);
            const html = `<div data-sign="${sign}" data-lines="${lineCount + 1}" >***</div>`;
            return this.pushCache(html, sign, lineCount);
          });
        },
        makeHtml(str, sentenceMakeFunc) {
          console.log("custom hook", "makeHtml", str)
          return str;
        },
        rule(str) {
          console.log("custom hook", "rule", str)
          return {
            reg: /sensitive words/g,
          };
        },
      });
      /**
       * 自定义一个自定义菜单
       * 点第一次时，把选中的文字变成同时加粗和斜体
       * 保持光标选区不变，点第二次时，把加粗斜体的文字变成普通文本
       */
      const customMenuA = Cherry.createMenuHook("加粗斜体", {
        iconName: "font",
        onClick: function (selection: any) {
          // 获取用户选中的文字，调用getSelection方法后，如果用户没有选中任何文字，会尝试获取光标所在位置的单词或句子
          let $selection = this.getSelection(selection) || "同时加粗斜体";
          // 如果是单选，并且选中内容的开始结束内没有加粗语法，则扩大选中范围
          if (
            !this.isSelections &&
            !/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)
          ) {
            this.getMoreSelection("***", "***", () => {
              const newSelection = this.editor.editor.getSelection();
              const isBoldItalic = /^\s*(\*\*\*)[\s\S]+(\1)/.test(newSelection);
              if (isBoldItalic) {
                $selection = newSelection;
              }
              return isBoldItalic;
            });
          }
          // 如果选中的文本中已经有加粗语法了，则去掉加粗语法
          if (/^\s*(\*\*\*)[\s\S]+(\1)/.test($selection)) {
            return $selection.replace(
              /(^)(\s*)(\*\*\*)([^\n]+)(\3)(\s*)($)/gm,
              "$1$4$7"
            );
          }
          /**
           * 注册缩小选区的规则
           *    注册后，插入“***TEXT***”，选中状态会变成“***【TEXT】***”
           *    如果不注册，插入后效果为：“【***TEXT***】”
           */
          this.registerAfterClickCb(() => {
            this.setLessSelection("***", "***");
          });
          return $selection.replace(/(^)([^\n]+)($)/gm, "$1***$2***$3");
        },
      });
      /**
       * 定义一个空壳，用于自行规划cherry已有工具栏的层级结构
       */
      const customMenuB = Cherry.createMenuHook("实验室", {
        iconName: "",
      });
      /**
       * 定义一个自带二级菜单的工具栏
       */
      const customMenuC = Cherry.createMenuHook("帮助中心", {
        iconName: "question",
        onClick: (selection: any, type: any) => {
          switch (type) {
            case "shortKey":
              return `${selection}快捷键看这里：https://codemirror.net/5/demo/sublime.html`;
            case "github":
              return `${selection}我们在这里：https://github.com/Tencent/cherry-markdown`;
            case "release":
              return `${selection}我们在这里：https://github.com/Tencent/cherry-markdown/releases`;
            default:
              return selection;
          }
        },
        subMenuConfig: [
          {
            noIcon: true,
            name: "快捷键",
            onclick: (event: any) => {
              instanceRef.current.toolbar.menus.hooks.customMenuCName.fire(
                null,
                "shortKey"
              );
            },
          },
          {
            noIcon: true,
            name: "联系我们",
            onclick: (event: any) => {
              instanceRef.current.toolbar.menus.hooks.customMenuCName.fire(
                null,
                "github"
              );
            },
          },
          {
            noIcon: true,
            name: "更新日志",
            onclick: (event: any) => {
              instanceRef.current.toolbar.menus.hooks.customMenuCName.fire(
                null,
                "release"
              );
            },
          },
        ],
      });

      const basicConfig = {
        id: "markdown-container",
        externals: {
          echarts: window.echarts,
          katex: window.katex,
          MathJax: window.MathJax,
        },
        isPreviewOnly: false,
        engine: {
          global: {
            urlProcessor(url: any, srcType: any) {
              console.log(`url-processor`, url, srcType);
              return url;
            },
            htmlWhiteList: "hello-world|iframe",
          },
          syntax: {
            codeBlock: {
              theme: "twilight",
            },
            table: {
              enableChart: false,
              // chartEngine: Engine Class
            },
            fontEmphasis: {
              allowWhitespace: false, // 是否允许首尾空格
            },
            strikethrough: {
              needWhitespace: false, // 是否必须有前后空格
            },
            mathBlock: {
              engine: "MathJax", // katex或MathJax
              src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js", // 如果使用MathJax plugins，则需要使用该url通过script标签引入
            },
            inlineMath: {
              engine: "MathJax", // katex或MathJax
            },
            emoji: {
              useUnicode: false,
              customResourceURL:
                "https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8",
              upperCase: true,
            },
            iframe: {},
            // toc: {
            //     tocStyle: 'nested'
            // }
            // 'header': {
            //   strict: false
            // }
          },
          customSyntax: {
            // SyntaxHookClass
            CustomHook: {
              syntaxClass: BlockSensitiveWordsHook,
              // force: true,
              before: "codeBlock"
              // after: "br",
            },
          },
        },
        toolbars: {
          toolbar: [
            "bold",
            "italic",
            {
              strikethrough: [
                "strikethrough",
                "underline",
                "sub",
                "sup",
                "ruby",
                "customMenuAName",
              ],
            },
            "size",
            "|",
            "color",
            "header",
            "|",
            "drawIo",
            "|",
            "ol",
            "ul",
            "checklist",
            "panel",
            "justify",
            "detail",
            "|",
            "formula",
            {
              insert: [
                "image",
                "audio",
                "video",
                "link",
                "hr",
                "br",
                "code",
                "formula",
                "toc",
                "table",
                "pdf",
                "word",
                "ruby",
              ],
            },
            "graph",
            "togglePreview",
            "settings",
            "codeTheme",
            "export",
            {
              customMenuBName: ["ruby", "audio", "video", "customMenuAName"],
            },
            "customMenuCName",
            "theme",
          ],
          toolbarRight: ["fullScreen", "|"],
          bubble: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "sub",
            "sup",
            "quote",
            "ruby",
            "|",
            "size",
            "color",
          ], // array or false
          sidebar: ["mobilePreview", "copy", "theme"],
          customMenu: {
            customMenuAName: customMenuA,
            customMenuBName: customMenuB,
            customMenuCName: customMenuC,
          },
        },
        drawioIframeUrl: "./drawio_demo.html",
        previewer: {
          // 自定义markdown预览区域class
          // className: 'markdown'
        },
        keydown: [],
        //extensions: [],
        // callback: {
        //   changeString2Pinyin: pinyin,
        // },
        editor: {
          defaultModel: "edit&preview",
          id: "cherry-text",
          name: "cherry-text",
          autoSave2Textarea: true,
        },
      };

      // fetch("./markdown/basic.md")
      //   .then((response) => response.text())
      //   .then((value) => {
      //     var config = Object.assign({}, basicConfig, { value: value });
      //     window.cherry = new Cherry(config);
      //   });

      instanceRef.current = new Cherry({
        ...basicConfig,
        value: `<hello-world></hello-world><iframe src="https://km.netease.com/image-compare#imgs=http://pfp.ps.netease.com/kmpvt/file/64cca8516d863369916f0b9apEDOJhlg01?sign=6tqyR-S61FnVj2fLJp_OnmIBgRM=&amp;expire=1691135833,http://pfp.ps.netease.com/kmpvt/file/64cca85369a95f76673f7277gJ5pAdcm01?sign=LIoofNDrY5e-yHstXzRcfSCCj-8=&amp;expire=1691135835" class="embed-image-compare" width="2250" height="2250" style="width: 2250px; height: 2250px;"></iframe>`,
      });
    }
  }, []);

  return (
    <div>
      <h2><a href="https://tencent.github.io/cherry-markdown/examples/api.html" target="_blank">CherryMarkdown</a></h2>
      {/* <SimpleGreeting></SimpleGreeting> */}
      <hello-world></hello-world>
      <div id="markdown-container"></div>
    </div>
  );
};

export default CherryMarkdown;
