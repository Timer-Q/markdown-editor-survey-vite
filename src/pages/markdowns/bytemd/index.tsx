import { useState } from "react";
import gfm from "@bytemd/plugin-gfm";
import { Editor } from "@bytemd/react";
import mermaid from "@bytemd/plugin-mermaid";
import math from "@bytemd/plugin-math";
import highlight from "@bytemd/plugin-highlight";
import frontmatter from "@bytemd/plugin-frontmatter";
import "bytemd/dist/index.min.css";
import deepmerge from 'deepmerge'
import type { BytemdPlugin } from "bytemd";

function imageComparePlugin(...args: any[]): BytemdPlugin {
  console.log(args);
  return {
    // to be implement
    // remark: (processor) => {
    //   processor.use()
    // },
    viewerEffect: (ctx) => {
      console.log(ctx);
    },
  };
}

const plugins = [
  gfm(),
  mermaid(),
  math(),
  highlight(),
  frontmatter(),
  imageComparePlugin(),
  // Add more plugins here
];

const ByteMD = () => {
  const [value, setValue] = useState(
    `<iframe src="https://km.netease.com/image-compare#imgs=http://pfp.ps.netease.com/kmpvt/file/64cca8516d863369916f0b9apEDOJhlg01?sign=6tqyR-S61FnVj2fLJp_OnmIBgRM=&amp;expire=1691135833,http://pfp.ps.netease.com/kmpvt/file/64cca85369a95f76673f7277gJ5pAdcm01?sign=LIoofNDrY5e-yHstXzRcfSCCj-8=&amp;expire=1691135835" class="embed-image-compare" width="2250" height="2250" style="width: 2250px; height: 2250px;"></iframe>`
  );

  const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("image", file);
    });
    const res = await fetch("https://httpbin.org/post", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.files.image;
  };

  return (
    <Editor
      value={value}
      plugins={plugins}
      onChange={(v) => {
        setValue(v);
      }}
      sanitize={(schema) => {
        schema.tagNames?.push("iframe");
        schema.tagNames?.push("hello-world");
        return deepmerge(schema, {attributes: {'iframe': ['src', 'class', 'width', 'height', 'style']}})
      }}
      uploadImages={uploadImages}
    />
  );
};

export default ByteMD;
