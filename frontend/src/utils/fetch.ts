import GeneralSettings from '@/api/generalSettings';

export const fetchByKey = async (key: string) => {
    try {
        const result = await GeneralSettings.getByKey(key, key);
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};
