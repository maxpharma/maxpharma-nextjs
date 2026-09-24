import ContactService from "../contacts/service";
import GalleryService from "../galleries/service";
import DocumentService from "../services/service";
import SettingService from "../generalSettings/service";
import ApplyService from "../apply/service";
import ProductService from "../products/service";
import InquiryService from "../inquiries/service"
import NoticeService from "../notices/service"
import Services from "../services/service"


const getMainDashboard = async (params:any) => {
    const totalInquiry = await InquiryService.count()
    const totalContact  = await ContactService.count()
    const totalProduct  = await ProductService.count()
    const totalApply = await ApplyService.count()

    const totalServices = await Services.count()

    const totalNotices = await NoticeService.count()
    const totalGallery  = await GalleryService.count()
    const totalSetting  = await SettingService.count({
        type: "PopUp"
    })


    const inquiryData = await InquiryService.list({
        limit:5,
        page:1
    })
    const applyData = await  ApplyService.list({
        limit: 5,
        page: 1
    })

    return {
        totalApply,
        totalGallery,
        totalContact,
        totalServices,
        totalSetting, 
        totalNotices,  
        totalProduct,
        totalInquiry,

        inquiryData,
        applyData,
    }
}

const get = async (params:any) => {
    try{
        if(params.type === 'dashboard'){
           return await getMainDashboard(params)
        } 
    }
    catch(err:any){
        throw new Error(err)
    }
}
export default {
    get 
}