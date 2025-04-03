import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className='bg-light-blue py-8 mt-32'>
            <div className='custom-container mx-auto px-4'>
                <div className='flex flex-col md:flex-row justify-between gap-8'>
                    {/* Logo Section */}
                    <div className='flex flex-col gap-4 md:max-w-1/4'>
                        <Image
                            src='/images/logo.png'
                            alt='Prabhu Steels and Hydro Investment Company Ltd.'
                            width={300}
                            height={100}
                        />
                        <div className='flex items-start gap-2'>
                            <Clock size={16} className=' mt-1' />
                            <div>
                                <p>Opening Hours:</p>
                                <p>Sun-Fri: 10:00am to 6:00pm</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Phone size={16} className='' />
                            <Link
                                href='tel:01-5913729'
                                className='hover:text-blue-600 transition-colors'
                            >
                                01-5913729 | 01-5913728
                            </Link>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Mail size={16} className='' />
                            <Link
                                href='mailto:Contact@prabhusteel.com'
                                className='hover:text-blue-600 transition-colors'
                            >
                                Contact@prabhusteel.com
                            </Link>
                        </div>
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
                                        src={'/svg/facebook.svg'}
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
                                        src={'/svg/instagram.svg'}
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
                                        src={'/svg/youtube.svg'}
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
                        © 2023. All Rights Reserved by Prabhu Steels and Hydro
                        Investment Company Limited.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
