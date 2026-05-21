#!/usr/bin/env node
import PromptSync from "prompt-sync"
import path from 'path'
import { getDay, patch_dir } from "./utility.js"
import fs from 'fs/promises'


const prompt = PromptSync()
console.log('----------Creating Pre/Post folder structure------------')
const totalCustomers = prompt('Enter total number of customers: ')

const customers = []
for(let i=0;i<totalCustomers;i+=1){
    customers.push(prompt(`Enter name of ${i+1} customer: `))
}

const day = getDay()
const tasks = []
for(let name of customers){
    const pre = path.join(patch_dir,day,name,'pre')
    const post = path.join(patch_dir,day,name,'post')
    tasks.push(fs.mkdir(pre,{recursive:true}))
    tasks.push(fs.mkdir(post,{recursive:true}))
}

await Promise.all(tasks)
console.log('----------All Folders Created successfully--------------')