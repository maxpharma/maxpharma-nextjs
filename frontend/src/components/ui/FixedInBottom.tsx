import React, { ReactNode } from "react";

interface FixedInBottomProps {
    children: ReactNode;
    className?: string;
}

const FixedInBottom: React.FC<FixedInBottomProps> = ({
    children,
    className = "",
}) => {
    return (
        <div className={`fixed bottom-0 left-0 w-full z-50 ${className}`}>
            {children}
        </div>
    );
};

export default FixedInBottom;
