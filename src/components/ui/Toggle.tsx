interface ToggleProps {
    label?: string;
    value: boolean; // Controlled value
    onChange?: (state: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, value, onChange }) => {
    const handleToggle = () => {
        if (onChange) {
            onChange(!value); // Just pass the toggled value
        }
    };

    return (
        <div className='flex items-center'>
            {label && (
                <span className='mr-3 text-sm font-medium text-gray-700'>
                    {label}
                </span>
            )}
            <button
                type='button'
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    value
                        ? 'bg-primary focus:ring-primary'
                        : 'bg-gray-200 focus:ring-gray-500'
                } transition-colors duration-300 ease-in-out`}
                role='switch'
                aria-checked={value}
            >
                <span className='sr-only'>Toggle</span>
                <span
                    className={`${
                        value ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out`}
                />
            </button>
        </div>
    );
};

export default Toggle;
