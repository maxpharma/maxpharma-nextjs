const saveUser = (data: any) => {
    return localStorage.setItem("max-pharma-admin", JSON.stringify(data));
};

const removeUser = () => {
    return localStorage.removeItem("max-pharma-admin");
};

const getUser = () => {
    if (typeof window === "undefined") return null; // ✅ Prevents server-side access
    const user = localStorage.getItem("max-pharma-admin");
    return user ? JSON.parse(user) : null;
};

const generatePassword = () => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
};

const convertDateTime = (dateStr: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const [time, period] = minutes.split(" ");
    let hourIn24: number = parseInt(hours, 10);
    if (period === "PM" && hourIn24 !== 12) {
        hourIn24 += 12;
    } else if (period === "AM" && hourIn24 === 12) {
        hourIn24 = 0;
    }
    const dateTimeStr = `${dateStr} ${String(hourIn24).padStart(
        2,
        "0"
    )}:${time.padStart(2, "0")}:00`;
    return dateTimeStr;
};

const getFileUrl = (path?: string): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }
    if (
        path.startsWith("/images/") ||
        path.startsWith("/icons/") ||
        path.startsWith("/logo") ||
        path.startsWith("/favicon")
    ) {
        return path;
    }
    const bucketUrl = (process.env.NEXT_PUBLIC_BUCKET_URL || "").replace(/\/+$/, "");
    const cleanPath = path.replace(/^\/+/, "");
    return bucketUrl ? `${bucketUrl}/${cleanPath}` : `/${cleanPath}`;
};

const helpers = {
    saveUser,
    removeUser,
    getUser,
    generatePassword,
    convertDateTime,
    getFileUrl,
};

export default helpers;

