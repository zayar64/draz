export const MONTH_NAMES = [
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
    "December"
];

export const normalizeDate = (
    date: string | Date,
    fullMonthName: boolean = true
): string => {
    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) throw new TypeError("Invalid Date!");

        return `${
            fullMonthName
                ? MONTH_NAMES[parsedDate.getMonth()]
                : MONTH_NAMES[parsedDate.getMonth()].slice(0, 3)
        } ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
    } catch {
        return String(date);
    }
};

export const getDaysInMonth = (date: string | Date): number => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) throw new TypeError("Invalid Date!");
    return new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth() + 1,
        0
    ).getDate();
};

export interface Period {
    years: number;
    months: number;
    days: number;
}

export function calculatePeriod(
    startDate: string | Date,
    endDate?: string | Date
): Period {
    let start = new Date(startDate);
    let end = endDate ? new Date(endDate) : new Date();

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    const startIsGreaterThanEnd = start > end;

    if (startIsGreaterThanEnd) {
        const tmp = start;
        start = end;
        end = tmp;
    }

    const startTotalDays = getDaysInMonth(start);
    const endTotalDays = getDaysInMonth(end);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);

    if (days < 0) {
        months--;
        days += previousMonth.getDate();

        if (
            start.getDate() === startTotalDays &&
            end.getDate() === endTotalDays
        ) {
            months++;
            days = 0;
        } else if (days < 0) {
            days = startTotalDays - start.getDate() + 1;
        }
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    if (startIsGreaterThanEnd) {
        return {
            years: -years,
            months: -months,
            days: -days
        };
    }

    return {
        years,
        months,
        days
    };
}

export const normalizePeriod = (period: Period): string => {
    const { days, months, years } = period;

    return (
        (years ? `${years} နှစ် ` : "") +
            (months ? `${months} လ ` : "") +
            ((years || months) && days ? " နှင့် " : "") +
            (days === 0.5 ? "လဝက်" : days ? `${days} ရက်` : "") || "0 ရက်"
    );
};
