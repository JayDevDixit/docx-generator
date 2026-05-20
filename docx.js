import fs from 'fs/promises'
import path from 'path'
import { HeadingLevel, ImageRun, Packer, Paragraph, Document, AlignmentType, PageBreak } from 'docx'
import { isImage, patch_dir } from './utility.js'

const createdocx = async (customer)=>{
    let children = []
    children = await attachFiles('pre',customer,children)
    children = await attachFiles('post',customer,children)
    const doc = new Document({sections: [{children}]})
    const buffer = await Packer.toBuffer(doc)
    const outputPath = path.join(patch_dir,day,`${customer}.docx`)
    await fs.writeFile(outputPath,buffer)
}

const attachFiles = async (state,customer,children) => {

    const dir = path.join(patch_dir,day,customer,state)
    const files = await fs.readdir(dir)
    children.push(new Paragraph({text: `----------${state} Validation----------`,heading: HeadingLevel.HEADING_1,alignment:AlignmentType.CENTER}))
    for(let file of files){
        if(isImage(file)){
        const imgPath = path.join(dir,file)
        const image = await fs.readFile(imgPath)
        children.push(new Paragraph({alignment:AlignmentType.CENTER,children:[
            new ImageRun({data: image, transformation: {width: 600,height: 350}})
        ]}))
    } else {
        console.log(`Ignoring non-image file ${file}`)
    }
        
    }
    children.push(new Paragraph({children: [new PageBreak()]}))

    return children
}


console.log('--------Creating docx file----------')
const day = '4-May'
const customers = await fs.readdir(path.join(patch_dir,day))

const tasks = []
for(let customer of customers){
    tasks.push(createdocx(customer))
}

await Promise.all(tasks)
console.log('---------docx file created successfully----------')

