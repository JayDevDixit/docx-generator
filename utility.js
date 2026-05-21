import path from "path";
import fs from 'fs/promises'
export const getDay = () =>{
    const date = new Date()

    return date.toLocaleDateString("en-GB",{
        day: "numeric",
        month: "short"
    }).replace(' ','-')
} 

export const patch_dir = "C:\\Users\\jddixit\\Documents\\Axway\\patching";

export const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg']

export const isImage = (filename) =>{
    const ext = path.extname(filename).toLowerCase()
    return IMAGE_EXTENSIONS.includes(ext)
}

export const MAX_WIDTH = 650

export const isdir = async (filename) =>{
    const stat = await fs.stat(filename)
    return stat.isDirectory()
}