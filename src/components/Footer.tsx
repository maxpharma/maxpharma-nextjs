import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
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
                        <p>
                            Max Pharma Pvt. Ltd., based in Bagdurbar, Sundhara,
                            Kathmandu, has been a trusted name in Nepal’s
                            pharmaceutical industry for over 22 years. We import
                            quality medicines from India and distribute them
                            efficiently across the country, ensuring access even
                            in remote areas.
                        </p>
                    </div>

                    {/* First Useful Links */}
                    <div className='flex flex-col gap-4'>
                        <h3>Useful Links</h3>
                        <nav className='flex flex-col gap-2'>
                            <Link
                                href='/'
                                className='hover:text-blue-600 transition-colors'
                            >
                                Home
                            </Link>
                            <Link
                                href='/about'
                                className='hover:text-blue-600 transition-colors'
                            >
                                About Us
                            </Link>
                            <Link
                                href='/gallery'
                                className='hover:text-blue-600 transition-colors'
                            >
                                Gallery
                            </Link>
                            <Link
                                href='/notice/downloads'
                                className='hover:text-blue-600 transition-colors'
                            >
                                Downloads
                            </Link>
                            <Link
                                href='/contact'
                                className='hover:text-blue-600 transition-colors'
                            >
                                Contact Us
                            </Link>
                        </nav>
                    </div>

                    {/* Office Information */}
                    <div className='flex flex-col gap-4'>
                        <h3>Office Information&apos;s</h3>
                        <div className='flex items-start gap-2'>
                            <MapPin size={16} className=' mt-1' />
                            <p>Regd Office: Birgunj-32, Parsa</p>
                        </div>
                        <div className='flex items-start gap-2'>
                            <MapPin size={16} className=' mt-1' />
                            <p>
                                Branch Office: Kathmandu-32 Tinkune (Near NMB
                                Bank)
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className='mt-4 flex items-center gap-4'>
                            <p>Connect with Us:</p>
                            <div className='flex gap-4 items-center'>
                                <Link
                                    href='https://www.facebook.com'
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
                                <Link
                                    href='https://www.instagram.com'
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
                                <Link
                                    href='https://www.youtube.com'
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className='mt-8 pt-4 border-t border-blue-200'>
                    <p className='text-center text-sm'>
                        © 2023. All Rights Reserved by Max Pharma Pvt. Ltd
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
