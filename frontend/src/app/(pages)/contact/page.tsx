import ScrollReveal from "@/components/animation/ScrollReveal";
import ContactUs from "@/features/ContactUs";
import React from "react";

const page = () => {
    return (
        <ScrollReveal>
            <div className='custom-container'>
                <ContactUs />
            </div>
        </ScrollReveal>
    );
};

export default page;
