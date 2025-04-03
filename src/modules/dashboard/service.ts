import ApplicationService from "../applications/service";
import ContactService from "../contacts/service";
import GalleryService from "../galleries/service";
import DocumentService from "../documents/service";
import SettingService from "../generalSettings/service";
import PortfolioService from "../portfolios/service";
import TeamService from "../teams/service";
const getMainDashboard = async (params:any) => {
    const totalApplications = await ApplicationService.count()
    const totalGallery  = await GalleryService.count()
    const totalContact  = await ContactService.count()
    const totalDocuments  = await DocumentService.count()
    const totalSetting  = await SettingService.count({
        type: ""
    })
    const totalPortfolio  = await PortfolioService.count()
    const totalTeam = await TeamService.count()
    const totalShareRequest = await ApplicationService.list({
        limit:5,
        page:1
    })
    const totalInquiry = await ContactService.list({
        limit: 5,
        page: 1
    })

    return {
        totalApplications,
        totalGallery,
        totalContact,
        totalDocuments,
        totalSetting,   
        totalPortfolio,
        totalTeam,
        totalShareRequest,
        totalInquiry
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