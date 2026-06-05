#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import {
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Document,
  AlignmentType,
  PageBreak,
  TextRun,
  BorderStyle,
} from "docx";
import { getDay, isdir, isImage, logo_path, MAX_WIDTH, patch_dir, today } from "./utility.js";
import imageSize from "image-size";

const titlePage = async (title) =>{
    return [new Paragraph({
    alignment: AlignmentType.CENTER, spacing: {before: 2000, after: 400},children: [new TextRun({text: title,bold:true,size:44,color:'FF0000'})]
  }), new Paragraph({
    alignment: AlignmentType.CENTER, spacing: {before:200,after:1000},children: [new TextRun({text: today(),italics: true,size:38})]
  }),...await attachImage(logo_path,0.4,0.4),new Paragraph({
    alignment: AlignmentType.RIGHT, spacing: {before: 4000, after: 400},children: [new TextRun({text: '- Jay Dev Dixit',bold:true,size:32,color:'FF0000'})]
  }),new Paragraph({children: [new PageBreak()]})]
}

const createdocx = async (customer) => {
  let children = [...await titlePage(`PATCHING VALIDATION REPORT`)];
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: {after: 600},children: [new TextRun({text: `Customer: ${customer.toUpperCase()}`,bold:true,color:'FF0000',size:32})]
  }))
  const preElements = await attachFiles("pre", customer);
  const postElements = await attachFiles("post", customer);
  preElements.length <= 0 ? console.log(`Fail to find Pre validation for ${customer}`) : ''
  postElements.length <=0 ? console.log(`Fail to find Post validation for ${customer}`) : ''
  children = [...children, ...preElements, ...postElements,...await titlePage(`THE END`)]
  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(patch_dir, day, `${customer}.docx`);
  await fs.writeFile(outputPath, buffer);
};

const attachImage = async (imgPath,w=1,h=1)=>{
    const ext = path.extname(imgPath).toLocaleLowerCase().replace('.','')
    
  const image = await fs.readFile(imgPath);
  const dimensions = imageSize(image)
  let width = dimensions.width * w
  let height = dimensions.height * h
  if(width > MAX_WIDTH){
    const ratio = MAX_WIDTH / width;
    width = Math.round(width*ratio)
    height = Math.round(height*ratio)
  }
  return ([
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new ImageRun({
          data: image,
          transformation: { width, height },
          type: ext
        }),
      ],
    }),
    new Paragraph({
      text: '', border: {bottom:{style:BorderStyle.SINGLE,color:"D9D9D9",size:6}},spacing: {after:200}
    }),
  ])
}

const attachFiles = async (state, customer) => {
const children = []
  const dir = path.join(patch_dir, day, customer, state);
  const files = await fs.readdir(dir);
  files.length == 0 ? console.log(`No file found in ${dir.split('\\').slice(-2).join('\\')}`) : ''
  children.push(
    new Paragraph({
      text: `----------${state.toUpperCase()} Validation----------`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
  );
  for (let file of files) {
    if (isImage(file)) {
    const imgPath = path.join(dir, file);
      children.push(...await attachImage(imgPath))
    } else {
      console.log(`Ignoring non-image file ${file} in ${dir.split('\\').slice(-2).join('\\')}`);
    }
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  return children;
};

console.log("--------Creating docx file----------");
const day = getDay();
const customers = await fs.readdir(path.join(patch_dir, day));

const tasks = [];
for (let customer of customers) {
    await isdir(path.join(patch_dir, day,customer)) ? tasks.push(createdocx(customer)) : '';
}

await Promise.all(tasks);
console.log("---------docx file created successfully----------");
