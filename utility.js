export const getDay = () =>{
    const date = new Date()

    return date.toLocaleDateString("en-GB",{
        day: "numeric",
        month: "short"
    }).replace(' ','-')
} 

export const patch_dir = "C:\\Users\\jddixit\\Documents\\Axway\\patching";
