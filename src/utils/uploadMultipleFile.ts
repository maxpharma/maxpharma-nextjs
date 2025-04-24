import removeFile from "./removeFile"
import uploadImage from "./uploadImage"

const uploadMultipleImage = async(items:any[],dynamicPath:string, oldImages?:any[]) => {
    const data = await Promise.all(
      items?.map(async(value:any, index:number) => {
        if(!!value?.base64){
            if(!!oldImages?.length && !!oldImages[index]){
              await removeFile({filePath: oldImages[index]})
            }
            const finalImage = await uploadImage({
              filePath:dynamicPath,
              fileName:`${Date.now()}-${index}-${dynamicPath}.${value?.extension}`,
              base64: value?.base64
            })
            return finalImage
        } else {
          return value
        }
      })
    )
    console.log(data,'list of image upload')
    return data
}

export default uploadMultipleImage
