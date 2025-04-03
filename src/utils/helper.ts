const saveUser = (data: any) => {
    return localStorage.setItem('prabhusteel-admin', JSON.stringify(data));
};

const removeUser = () => {
    return localStorage.removeItem('prabhusteel-admin');
};

const getUser = () => {
    if (typeof window === 'undefined') return null; // ✅ Prevents server-side access
    const user = localStorage.getItem('prabhusteel-admin');
    return user ? JSON.parse(user) : null;
};

const generatePassword = () => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
};

const convertDateTime = (dateStr: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const [time, period] = minutes.split(' ');
    let hourIn24: number = parseInt(hours, 10);
    if (period === 'PM' && hourIn24 !== 12) {
        hourIn24 += 12;
    } else if (period === 'AM' && hourIn24 === 12) {
        hourIn24 = 0;
    }
    const dateTimeStr = `${dateStr} ${String(hourIn24).padStart(
        2,
        '0'
    )}:${time.padStart(2, '0')}:00`;
    return dateTimeStr;
};

const helpers = {
    saveUser,
    removeUser,
    getUser,
    generatePassword,
    convertDateTime,
};

export default helpers;
