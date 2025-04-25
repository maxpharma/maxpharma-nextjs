"use client";

import websiteData from "@/features/data";
import SendInquiry from "@/features/SendInquiry";
import {
    ChevronDown,
    ChevronRight,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomImage from "./CustomImage";
import Overlay from "./Overlay";
import Settings from "@/features/settings";

const Navbar = () => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

    const setting = Settings();

    // Close mobile menu when screen size increases to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [mobileMenuOpen]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    type NavItem = {
        name: string;
        path: string;
        link?: string;
        dropdown?: {
            name: string;
            path: string;
        }[];
    };

    const navItems: NavItem[] = [
        { name: "Home", path: "/" },
        {
            name: "About Us",
            path: "/about",
        },
        {
            name: "Products",
            path: "/products",
        },

        { name: "Manufacturing", path: "/manufacturing/production-department" },
        {
            name: "Notice",
            path: "/notice/important-notice",
        },
        {
            name: "Gallery",
            path: "/gallery",
        },
        {
            name: "Contact Us",
            path: "/contact",
        },
    ];

    const handleMobileItemClick = (item: NavItem) => {
        if (item.dropdown) {
            setMobileDropdown(mobileDropdown === item.name ? null : item.name);
        } else {
            setMobileMenuOpen(false);
            if (item.link) {
                window.location.href = item.link;
            } else {
                router.push(item.path);
            }
        }
    };

    return (
        <>
            <div className='shadow-lg mb-2 md:mb-3 sticky top-0 z-50 bg-white'>
                <header className='bg-primary'>
                    <div className='custom-container text-white flex justify-between items-center font-base py-2 md:py-3 text-xs md:text-sm'>
                        <div className='flex lg:w-1/2 items-center gap-2'>
                            <Phone size={16} />
                            <span>
                                <span className='max-lg:hidden'>Call on: </span>
                                <a href={`tel:${setting?.phoneNumber}`}>
                                    {setting?.phoneNumber}
                                </a>
                                {setting?.phoneNumberII && (
                                    <a
                                        href={`tel:${setting?.phoneNumberII}`}
                                        className='max-sm:hidden'
                                    >
                                        {" "}
                                        | {setting?.phoneNumberII}
                                    </a>
                                )}
                            </span>
                        </div>
                        <div className='flex md:w-1/2 justify-between'>
                            {setting?.mail && (
                                <div className='flex gap-1 items-center flex-nowrap max-md:hidden'>
                                    <Mail size={16} />
                                    <a href={`mailto:${setting?.mail}`}>
                                        <span className='max-lg:hidden'>
                                            Mail us:
                                        </span>{" "}
                                        {setting?.mail}
                                    </a>
                                </div>
                            )}

                            {setting?.location && (
                                <div className='flex gap-1 items-center flex-nowrap'>
                                    <MapPin size={16} />
                                    <span>
                                        <span className='max-lg:hidden'>
                                            Reach us:
                                        </span>{" "}
                                        {setting?.location}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <nav className='custom-container flex items-center justify-between '>
                    <div
                        className='relative w-40 md:w-72 h-auto min-h-8 cursor-pointer'
                        onClick={() => router.push("/")}
                    >
                        <CustomImage
                            src='/images/logo.png'
                            className='w-32 h-16 md:w-48 '
                        />
                    </div>

                    <div className='flex items-center gap-10 font-extralight max-lg:hidden'>
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className='relative group font-bold text-xs md:text-sm cursor-pointer'
                            >
                                <div
                                    className='flex items-center gap-2'
                                    onMouseEnter={() =>
                                        setOpenDropdown(item.name)
                                    }
                                >
                                    <Link
                                        href={
                                            item?.link ? item?.link : item.path
                                        }
                                        className='font-normal'
                                    >
                                        {item.name}
                                    </Link>
                                    {item.dropdown && (
                                        <ChevronDown
                                            size={16}
                                            className={`text-primary transition-transform duration-300 ${
                                                openDropdown === item.name
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    )}
                                </div>
                                {item.dropdown &&
                                    openDropdown === item.name && (
                                        <div
                                            className='absolute top-4 left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10'
                                            onMouseEnter={() =>
                                                setOpenDropdown(item.name)
                                            }
                                            onMouseLeave={() =>
                                                setOpenDropdown(null)
                                            }
                                        >
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.path}
                                                    className='block px-4 py-2 hover:bg-gray-200'
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center gap-4 '>
                        <button
                            className='button'
                            onClick={() => {
                                setIsOverlayOpen(true);
                            }}
                        >
                            Send Inquiry
                        </button>
                        <button
                            className='lg:hidden text-primary'
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu - Slide from left */}
                <div
                    className={`fixed inset-0 bg-white bg-opacity-50 z-50 transition-opacity duration-300 ${
                        mobileMenuOpen
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <div
                        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white transition-transform duration-300 ease-in-out transform ${
                            mobileMenuOpen
                                ? "translate-x-0"
                                : "-translate-x-full"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex flex-col h-full w-[100vw] overflow-y-auto'>
                            <div className='flex justify-between items-center p-4 '>
                                <div className='relative w-64 h-20'>
                                    <Image
                                        src='/images/logo.png'
                                        alt='logo'
                                        fill
                                        className='object-contain'
                                    />
                                </div>
                                <button
                                    className='text-gray-500 hover:text-primary'
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className='flex flex-col py-4 items-center'>
                                {navItems.map((item) => (
                                    <div
                                        key={item.name}
                                        className=' border-gray-100'
                                    >
                                        <div
                                            className='flex items-center justify-between px-6 py-4 text-primary cursor-pointer'
                                            onClick={() =>
                                                handleMobileItemClick(item)
                                            }
                                        >
                                            <span className='font-medium'>
                                                {item.name}
                                            </span>
                                            {item.dropdown &&
                                                (mobileDropdown ===
                                                item.name ? (
                                                    <ChevronDown
                                                        size={20}
                                                        className='transform rotate-180 transition-transform duration-300'
                                                    />
                                                ) : (
                                                    <ChevronRight
                                                        size={20}
                                                        className='transition-transform duration-300'
                                                    />
                                                ))}
                                        </div>

                                        {item.dropdown &&
                                            mobileDropdown === item.name && (
                                                <div className='bg-gray-50 pl-8 pr-4 py-2'>
                                                    {item.dropdown.map(
                                                        (subItem) => (
                                                            <Link
                                                                key={
                                                                    subItem.name
                                                                }
                                                                href={
                                                                    subItem.path
                                                                }
                                                                className='block py-3 text-gray-700 hover:text-primary'
                                                                onClick={() =>
                                                                    setMobileMenuOpen(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>

                            <div className='mt-auto p-6'>
                                <button
                                    className='w-full bg-primary text-white py-3 rounded font-medium'
                                    onClick={() => {
                                        setIsOverlayOpen(true);
                                    }}
                                >
                                    Send Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOverlayOpen && (
                <Overlay isOpen={isOverlayOpen} onClose={() => false}>
                    <SendInquiry
                        varient='extra'
                        setIsOverlayOpen={setIsOverlayOpen}
                    />
                </Overlay>
            )}
        </>
    );
};

export default Navbar;
