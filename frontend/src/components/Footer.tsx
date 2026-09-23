"use client";

import Settings from "@/features/settings";
import WebsiteData from "@/features/theme";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    const settings = Settings();
    const theme = WebsiteData();

    return (
        <footer className='bg-light-primary py-8 mt-8'>
            <div className='custom-container mx-auto px-4'>
                <div className='flex flex-col md:flex-row justify-between gap-8'>
                    {/* Logo Section */}
                    <div className='flex flex-col gap-4 md:max-w-2/5'>
                        <Image
                            src='/images/logo.png'
                            alt='Prabhu Steels and Hydro Investment Company Ltd.'
                            width={300}
                            height={100}
                        />
                        <p>{theme?.footerText}</p>
                    </div>

                    {/* First Useful Links */}
                    <div className='flex flex-col gap-4'>
                        <h3>Useful Links</h3>
                        <nav className='flex flex-col gap-2'>
                            <Link href='/' className='hover:underline'>
                                Home
                            </Link>
                            <Link href='/about' className='hover:underline'>
                                About Us
                            </Link>
                            <Link href='/products' className='hover:underline'>
                                Products
                            </Link>
                            <Link href='/notice' className='hover:underline'>
                                Notice
                            </Link>
                            <Link href='/contact' className='hover:underline'>
                                Contact Us
                            </Link>
                        </nav>
                    </div>

                    {/* Office Information */}
                    <div className='flex flex-col gap-4'>
                        <h3>Office Information&apos;s</h3>

                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center gap-2'>
                                <Phone size={24} className='text-primary' />
                                <span>
                                    <span className='max-lg:hidden'>
                                        Call on:{" "}
                                    </span>
                                    <a href={`tel:${settings?.phoneNumber}`}>
                                        {settings?.phoneNumber}
                                    </a>
                                    {settings?.phoneNumberII && (
                                        <a
                                            href={`tel:${settings?.phoneNumberII}`}
                                            className='max-sm:hidden'
                                        >
                                            {" "}
                                            | {settings?.phoneNumberII}
                                        </a>
                                    )}
                                </span>
                            </div>
                            <div className='flex gap-2 items-center text-primary'>
                                <Mail />
                                <a href={`mailto:${settings?.mail}`}>
                                    {settings?.mail}
                                </a>
                            </div>
                            <div className='flex gap-2 items-center text-primary'>
                                <MapPin />
                                <p>{settings?.location}</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className='mt-4 flex items-center gap-4'>
                            <p>Connect with Us:</p>
                            <div className='flex gap-4 items-center'>
                                {settings?.facebookLink && (
                                    <Link
                                        href={settings.facebookLink}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Image
                                            src={"/svg/facebook.svg"}
                                            alt='facebook logo'
                                            width={32}
                                            height={32}
                                        />
                                    </Link>
                                )}
                                {settings?.instagramLink && (
                                    <Link
                                        href={settings.instagramLink}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Image
                                            src={"/svg/instagram.svg"}
                                            alt='instagram logo'
                                            width={32}
                                            height={32}
                                        />
                                    </Link>
                                )}
                                {settings?.youtubeLink && (
                                    <Link
                                        href={settings.youtubeLink}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Image
                                            src={"/svg/youtube.svg"}
                                            alt='youtube logo'
                                            width={32}
                                            height={32}
                                        />
                                    </Link>
                                )}
                                {/* Add more social icons as needed */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className='mt-8 pt-4 border-t border-blue-200'>
                    <p className='text-center text-sm'>
                        {settings?.copyrightText
                            ? settings.copyrightText
                            : "© 2023. All Rights Reserved by Max Pharma Pvt. Ltd"}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
