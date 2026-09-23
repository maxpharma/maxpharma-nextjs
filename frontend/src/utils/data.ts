import {
    aboutUsIcon,
    bannerIcon,
    contactIcon,
    dashboardIcon,
    documentsIcon,
    faqsIcon,
    galleryIcon,
    popUpIcon,
    portfolioIcon,
    productsIcon,
    seoIcon,
    servicesIcon,
    settingsIcon,
    shareRequestIcon,
    teamIcon,
} from "@/assets/svg";

// Define menu item structure

export const chairPerson = [
    {
        image: "/images/dipen.png",
        name: "Dipen Rai",
        position: "Spokesperson",
        contact: "9851348164",
    },
];

export const stakeHoldersLogos = [
    {
        image: "/logos/prabhu-holdings.png",
        name: "Prabhu Holdings",
        link: "https://www.holdingshydro.com",
    },
    {
        image: "/logos/prabhu-urja-krishi.png",
        name: "Steel Urja",
        link: "https://www.holdingsprabhu.com",
    },
    {
        image: "/logos/hydro-holdings.png",
        name: "Hydro Steel",
        link: null,
    },
];

export const associatesLogos = [
    {
        image: "/logos/prabhu-cable-car.png",
        name: "Prabhu Cable Car",
    },
    {
        image: "/logos/prabhu-groups.png",
        name: "Prabhu Groups",
    },
    {
        image: "/logos/prabhu-jabiddhut-bikash.png",
        name: "Prabhu Jabiddhut",
    },
    {
        image: "/logos/prabhu-aawas.png",
        name: "Prabhu Aawas",
    },
];

interface MenuItem {
    id: string;
    title: string;
    icon: string | null;
    path: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        id: "dashboard",
        title: "Dashboard",
        icon: dashboardIcon,
        path: "/admin/dashboard",
    },
    {
        id: "banner",
        title: "Banner",
        icon: bannerIcon,
        path: "/admin/banner",
    },
    { id: "popup", title: "Popup", icon: popUpIcon, path: "/admin/popup" },
    {
        id: "about",
        title: "About Us",
        icon: aboutUsIcon,
        path: "/admin/about",
    },
    {
        id: "products",
        title: "Products",
        icon: productsIcon,
        path: "/admin/products",
    },
    {
        id: "services",
        title: "Services",
        icon: servicesIcon,
        path: "/admin/service",
    },
    {
        id: "gallery",
        title: "Gallery",
        icon: galleryIcon,
        path: "/admin/gallery",
    },
    {
        id: "faqs",
        title: "FAQs",
        icon: faqsIcon,
        path: "/admin/faqs",
    },

    {
        id: "documents",
        title: "Documents & Notice",
        icon: documentsIcon,
        path: "/admin/documents&notice",
    },
    {
        id: "contact",
        title: "Contact List",
        icon: contactIcon,
        path: "/admin/contact-list",
    },
    {
        id: "inquiry",
        title: "Inquiry Request",
        icon: shareRequestIcon,
        path: "/admin/inquiry-request",
    },
    {
        id: "settings",
        title: "Settings",
        icon: settingsIcon,
        path: "/admin/settings",
    },
    {
        id: "seo",
        title: "SEO Settings",
        icon: seoIcon,
        path: "/admin/seo",
    },
];
