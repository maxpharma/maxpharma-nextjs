import { FC, useState, useRef, useEffect } from 'react';
import { Field, FieldProps, FormikProps } from 'formik';
import { Calendar, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

// Define months in Nepali
const nepaliMonths = [
    'Baishakh',
    'Jestha',
    'Ashadh',
    'Shrawan',
    'Bhadra',
    'Ashwin',
    'Kartik',
    'Mangsir',
    'Poush',
    'Magh',
    'Falgun',
    'Chaitra',
];

// Define days in Nepali (starting from Sunday)
const nepaliDays = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];

// Define days in each month for 2080 BS (approximate, actual varies by year)
const daysInMonth2080 = [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30];

interface NepaliDatePickerProps {
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    name: string;
    disabled?: boolean;
    className?: string;
}

const NepaliDatePicker: FC<NepaliDatePickerProps> = ({
    label,
    name,
    onChange,
    className = '',
    ...restProps
}) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(0); // Baishakh
    const [currentYear, setCurrentYear] = useState(2080); // Default BS year
    const calendarRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close calendar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target as Node)
            ) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = <T extends object>(
        form: FormikProps<T>,
        value: string
    ): void => {
        if (onChange) onChange(value);
        form.setFieldValue(name, value);
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleDateSelect = <T extends object>(
        form: FormikProps<T>,
        day: number
    ) => {
        const formattedDate = `${currentYear}-${String(
            currentMonth + 1
        ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        handleChange(form, formattedDate);
        setShowCalendar(false);
    };

    const renderCalendarDays = <T extends object>(
        form: FormikProps<T>,
        value: string
    ) => {
        const days = [];
        const maxDays = daysInMonth2080[currentMonth];

        // Add empty cells for proper day alignment
        const firstDayOfMonth = 1; // This would normally be calculated based on the specific month/year
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className='p-2'></div>);
        }

        // Add days of the month
        for (let day = 1; day <= maxDays; day++) {
            const dateString = `${currentYear}-${String(
                currentMonth + 1
            ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = value === dateString;

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateSelect(form, day)}
                    className={`p-2 text-center cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                        isSelected
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : ''
                    }`}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <div className={className}>
            <Field name={name}>
                {({ field, meta, form }: FieldProps) => {
                    const hasError = meta.touched && meta.error;

                    return (
                        <div className='mb-4'>
                            {!!label && (
                                <label
                                    htmlFor={name}
                                    className={`block text-sm font-medium mb-1 ${
                                        hasError
                                            ? 'text-red-500'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {label}
                                </label>
                            )}
                            <div className='relative'>
                                <input
                                    id={name}
                                    type='text'
                                    value={field?.value || ''}
                                    onChange={(event) => {
                                        handleChange(form, event.target.value);
                                    }}
                                    readOnly
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-1 focus:border-black focus:border-opacity-70 cursor-pointer
                  ${
                      hasError
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300'
                  } 
                  ${
                      restProps.disabled
                          ? 'bg-gray-100 cursor-not-allowed'
                          : 'bg-white'
                  }
                  pr-12`}
                                    onClick={toggleCalendar}
                                    placeholder={
                                        restProps.placeholder ||
                                        'Select BS date'
                                    }
                                    {...restProps}
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                    onClick={toggleCalendar}
                                    aria-label='Open calendar'
                                >
                                    <Calendar className='w-5 h-5 text-gray-500' />
                                </button>

                                {showCalendar && (
                                    <div
                                        ref={calendarRef}
                                        className='absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-64'
                                    >
                                        <div className='flex justify-between items-center mb-2'>
                                            <button
                                                type='button'
                                                onClick={goToPreviousMonth}
                                                className='p-1 hover:bg-gray-100 rounded-full'
                                            >
                                                <ChevronLeft className='w-5 h-5' />
                                            </button>
                                            <div className='text-center font-medium'>
                                                {nepaliMonths[currentMonth]}{' '}
                                                {currentYear}
                                            </div>
                                            <button
                                                type='button'
                                                onClick={goToNextMonth}
                                                className='p-1 hover:bg-gray-100 rounded-full'
                                            >
                                                <ChevronRight className='w-5 h-5' />
                                            </button>
                                        </div>

                                        <div className='grid grid-cols-7 gap-1 mb-1'>
                                            {nepaliDays.map((day) => (
                                                <div
                                                    key={day}
                                                    className='text-center text-xs font-medium text-gray-500'
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        <div className='grid grid-cols-7 gap-1'>
                                            {renderCalendarDays(
                                                form,
                                                field.value
                                            )}
                                        </div>

                                        <div className='mt-2 flex justify-end'>
                                            <button
                                                className='text-xs text-blue-500 hover:text-blue-700'
                                                onClick={() => {
                                                    // Set to current date in BS (approximate)
                                                    const today = new Date();
                                                    // This is a simplified conversion - in a real app you'd need a proper AD to BS conversion
                                                    const bsYear =
                                                        today.getFullYear() +
                                                        56; // Rough estimation
                                                    const bsMonth =
                                                        today.getMonth();
                                                    const bsDay =
                                                        today.getDate();

                                                    const formattedDate = `${bsYear}-${String(
                                                        bsMonth + 1
                                                    ).padStart(
                                                        2,
                                                        '0'
                                                    )}-${String(bsDay).padStart(
                                                        2,
                                                        '0'
                                                    )}`;
                                                    handleChange(
                                                        form,
                                                        formattedDate
                                                    );
                                                    setCurrentYear(bsYear);
                                                    setCurrentMonth(bsMonth);
                                                    setShowCalendar(false);
                                                }}
                                            >
                                                Today
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!!hasError && (
                                <p className='mt-1 text-sm text-red-500'>
                                    {meta.error}
                                </p>
                            )}
                        </div>
                    );
                }}
            </Field>
        </div>
    );
};

export default NepaliDatePicker;
