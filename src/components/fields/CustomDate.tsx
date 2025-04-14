import { FC, useState, useRef, useEffect } from "react";
import { Field, FieldProps, FormikProps } from "formik";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Define months for both calendar systems
const nepaliMonths = [
    "Baishakh",
    "Jestha",
    "Ashadh",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra",
];

const englishMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// Define days in Nepali and English
const nepaliDays = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];
const englishDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Define days in each month for 2080 BS (approximate, actual varies by year)
const daysInMonth2080 = [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30];

// Get days in a month for AD calendar
const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

// Get the day of week the month starts on (0 = Sunday, 6 = Saturday)
const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

type CalendarType = "AD" | "BS";

interface CustomDateProps {
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    name: string;
    disabled?: boolean;
    className?: string;
    calendarType?: CalendarType; // Made optional
    disableFutureDates?: boolean; // New prop to disable future dates
}

const CustomDate: FC<CustomDateProps> = ({
    label,
    name,
    onChange,
    className = "",
    calendarType = "AD", // Default value
    disableFutureDates = true, // Default to false
    ...restProps
}) => {
    // Get current date values
    const today = new Date();
    const currentADYear = today.getFullYear();
    const currentADMonth = today.getMonth();
    const currentADDay = today.getDate();
    const currentBSYear = currentADYear + 56; // Approximate conversion

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(
        calendarType === "AD" ? currentADMonth : 0
    );
    const [selectedYear, setSelectedYear] = useState(
        calendarType === "AD" ? currentADYear : currentBSYear
    );
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

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
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

    // Function to check if a date is in the future
    const isDateInFuture = (
        year: number,
        month: number,
        day: number
    ): boolean => {
        if (calendarType === "AD") {
            const selectedDate = new Date(year, month, day);
            const currentDate = new Date(
                currentADYear,
                currentADMonth,
                currentADDay
            );
            // Set time to 00:00:00 for accurate date comparison
            selectedDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            return selectedDate > currentDate;
        } else {
            // For BS calendar - first do a simple check
            if (year > currentBSYear) return true;
            if (year === currentBSYear && month > currentADMonth) return true;
            if (
                year === currentBSYear &&
                month === currentADMonth &&
                day > currentADDay
            )
                return true;
            return false;
        }
    };

    const handleDateSelect = <T extends object>(
        form: FormikProps<T>,
        day: number
    ) => {
        // Don't select if the date is in the future and disableFutureDates is true
        if (
            disableFutureDates &&
            isDateInFuture(selectedYear, selectedMonth, day)
        ) {
            return;
        }

        const formattedDate = `${selectedYear}-${String(
            selectedMonth + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        handleChange(form, formattedDate);
        setShowCalendar(false);
    };

    const renderCalendarDays = <T extends object>(
        form: FormikProps<T>,
        value: string
    ) => {
        const days = [];
        const maxDays =
            calendarType === "AD"
                ? getDaysInMonth(selectedYear, selectedMonth)
                : daysInMonth2080[selectedMonth];

        // Add empty cells for proper day alignment
        const firstDayOfMonth =
            calendarType === "AD"
                ? getFirstDayOfMonth(selectedYear, selectedMonth)
                : 0; // Simplified for BS calendar, would need actual calculation

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className='p-2'></div>);
        }

        // Add days of the month
        for (let day = 1; day <= maxDays; day++) {
            const dateString = `${selectedYear}-${String(
                selectedMonth + 1
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = value === dateString;

            // Check if day is today
            const isToday =
                calendarType === "AD" &&
                day === today.getDate() &&
                selectedMonth === today.getMonth() &&
                selectedYear === today.getFullYear();

            // Check if date is in the future
            const isFuture =
                disableFutureDates &&
                isDateInFuture(selectedYear, selectedMonth, day);

            days.push(
                <div
                    key={day}
                    onClick={() => !isFuture && handleDateSelect(form, day)}
                    className={`
            w-8 h-8 mx-auto flex items-center justify-center text-sm
            ${
                !isFuture ? "cursor-pointer" : "cursor-not-allowed"
            } rounded-full transition-all duration-200
            ${
                isSelected
                    ? "bg-primary text-white font-medium hover:bg-blue-500"
                    : isToday
                    ? "border border-indigo-400 text-primary hover:bg-indigo-50"
                    : isFuture
                    ? "text-gray-300"
                    : "hover:bg-gray-100"
            }
          `}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    const goToPreviousMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(calendarType === "AD" ? 11 : 11);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const goToNextMonth = () => {
        // If disableFutureDates is true, don't allow navigation to future months
        if (disableFutureDates) {
            const isNextMonthInFuture =
                calendarType === "AD"
                    ? selectedYear > currentADYear ||
                      (selectedYear === currentADYear &&
                          selectedMonth >= currentADMonth)
                    : selectedYear > currentBSYear ||
                      (selectedYear === currentBSYear &&
                          selectedMonth >= currentADMonth);

            if (isNextMonthInFuture) {
                return;
            }
        }

        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    const months = calendarType === "AD" ? englishMonths : nepaliMonths;
    const days = calendarType === "AD" ? englishDays : nepaliDays;

    const goToToday = <T extends object>(form: FormikProps<T>) => {
        if (calendarType === "AD") {
            const formattedDate = `${currentADYear}-${String(
                currentADMonth + 1
            ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            handleChange(form, formattedDate);
            setSelectedYear(currentADYear);
            setSelectedMonth(currentADMonth);
        } else {
            // This is a simplified conversion - in a real app you'd need a proper AD to BS conversion
            const formattedDate = `${currentBSYear}-${String(
                currentADMonth + 1
            ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            handleChange(form, formattedDate);
            setSelectedYear(currentBSYear);
            setSelectedMonth(currentADMonth);
        }
        setShowCalendar(false);
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return "";

        const [year, month, day] = dateString
            .split("-")
            .map((part) => parseInt(part, 10));
        const monthName = months[month - 1];

        return `${day} ${monthName}, ${year}`;
    };

    // Determine if the next month navigation should be disabled
    const isNextMonthNavigationDisabled =
        disableFutureDates &&
        (calendarType === "AD"
            ? selectedYear > currentADYear ||
              (selectedYear === currentADYear &&
                  selectedMonth >= currentADMonth)
            : selectedYear > currentBSYear ||
              (selectedYear === currentBSYear &&
                  selectedMonth >= currentADMonth));

    return (
        <div className={className}>
            <Field name={name}>
                {({ field, meta, form }: FieldProps) => {
                    const hasError = meta.touched && meta.error;
                    const displayValue = field.value
                        ? formatDisplayDate(field.value)
                        : "";

                    return (
                        <div className='mb-4'>
                            {!!label && (
                                <label
                                    htmlFor={name}
                                    className={`block text-sm font-medium mb-1.5 ${
                                        hasError
                                            ? "text-red-500"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {label}
                                </label>
                            )}
                            <div className='relative'>
                                <input
                                    id={name}
                                    type='text'
                                    value={displayValue}
                                    onChange={() => {}} // Controlled input
                                    readOnly
                                    className={`
                    w-full px-4 py-2.5 pr-10 text-sm
                    border rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    cursor-pointer shadow-sm
                    ${
                        hasError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-primary focus:ring-indigo-200"
                    } 
                    ${
                        restProps.disabled
                            ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                            : "bg-white hover:border-gray-400"
                    }
                  `}
                                    onClick={toggleCalendar}
                                    placeholder={
                                        restProps.placeholder ||
                                        `Select ${calendarType} date`
                                    }
                                    {...restProps}
                                />
                                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                                    <button
                                        type='button'
                                        className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
                                        onClick={toggleCalendar}
                                        aria-label='Toggle calendar'
                                    >
                                        <Calendar className='w-5 h-5' />
                                    </button>
                                </div>

                                {showCalendar && (
                                    <div
                                        ref={calendarRef}
                                        className='absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72 animate-fadeIn'
                                        style={{
                                            animation: "fadeIn 0.2s ease-out",
                                        }}
                                    >
                                        <div className='flex justify-between items-center mb-4'>
                                            <button
                                                type='button'
                                                onClick={goToPreviousMonth}
                                                className='p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200'
                                                aria-label='Previous month'
                                            >
                                                <ChevronLeft className='w-4 h-4 text-gray-600' />
                                            </button>

                                            <div className='flex flex-col items-center'>
                                                <div className='text-sm font-medium text-gray-900'>
                                                    {months[selectedMonth]}
                                                </div>
                                                <div className='text-xs text-gray-500'>
                                                    {selectedYear}
                                                </div>
                                            </div>

                                            <button
                                                type='button'
                                                onClick={goToNextMonth}
                                                className={`p-1.5 rounded-full transition-colors duration-200 ${
                                                    isNextMonthNavigationDisabled
                                                        ? "text-gray-300 cursor-not-allowed"
                                                        : "hover:bg-gray-100 text-gray-600"
                                                }`}
                                                aria-label='Next month'
                                                disabled={
                                                    isNextMonthNavigationDisabled
                                                }
                                            >
                                                <ChevronRight className='w-4 h-4' />
                                            </button>
                                        </div>

                                        <div className='grid grid-cols-7 gap-1 mb-2'>
                                            {days.map((day) => (
                                                <div
                                                    key={day}
                                                    className='text-center text-xs font-medium text-gray-500 h-6 flex items-center justify-center'
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

                                        <div className='flex justify-between items-center mt-4 pt-3 border-t border-gray-100'>
                                            <span className='text-xs font-medium text-gray-500'>
                                                {calendarType} Calendar
                                            </span>
                                            <button
                                                type='button'
                                                className='text-xs font-medium text-primary hover:text-indigo-800 transition-colors'
                                                onClick={() => goToToday(form)}
                                            >
                                                Today
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!!hasError && (
                                <p className='mt-1.5 text-xs text-red-500'>
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

export default CustomDate;
