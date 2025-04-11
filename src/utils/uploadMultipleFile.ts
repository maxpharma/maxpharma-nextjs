import removeFile from "./removeFile"
import uploadImage from "./uploadImage"

const uploadProductImage = async(items:any[],dynamicPath:string, oldImages?:any[]) => {
    const data = await Promise.all(
      items?.map(async(value:any, index:number) => {
        if(!!value?.base64){
            if(!!oldImages){
              await removeFile({filePath: oldImages[index]})
            }
            const finalImage = await uploadImage({
              filePath:dynamicPath,
              fileName:`${Date.now()}-${index}-${dynamicPath}.${value?.extension}`,
              base64: value?.base64
            })
            console.log(finalImage,'final image')
            return finalImage
        } else {
          return items
        }
      })
    )
    console.log(data,'list of image upload')
    return data
  }