import Notices from "@/features/Notices";
import React from "react";

const page = () => {
    return (
        <div>
            <Notices limit={9} />
        </div>
    );
};

export default page;
