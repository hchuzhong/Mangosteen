export class Time {
    date: Date;
    constructor(date?: string | Date) {
        if (date === undefined) {
            this.date = new Date();
        } else if (typeof date === 'string') {
            this.date = new Date(date);
        } else {
            this.date = date;
        }
    }

    format(pattern = 'YYYY-MM-DD') {
        // The currently supported format is YYYY MM DD HH mm ss SSS
        const year = this.date.getFullYear()
        const month = this.date.getMonth() + 1
        const day = this.date.getDate()
        const hour = this.date.getHours()
        const minute = this.date.getMinutes()
        const second = this.date.getSeconds()
        const msecond = this.date.getMilliseconds()
        return pattern.replace(/YYYY/g, year.toString())
            .replace(/MM/, month.toString().padStart(2, '0'))
            .replace(/DD/, day.toString().padStart(2, '0'))
            .replace(/HH/, hour.toString().padStart(2, '0'))
            .replace(/mm/, minute.toString().padStart(2, '0'))
            .replace(/ss/, second.toString().padStart(2, '0'))
            .replace(/SSS/, msecond.toString().padStart(3, '0'))
    }
    firstDayOfMonth() {
        return new Time(new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0));
    }
    firstDayOfYear() {
        return new Time(new Date(this.date.getFullYear(), 0, 1, 0, 0, 0));
    }
    lastDayOfMonth() {
        return new Time(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 0, 0, 0));
    }
    lastDayOfYear() {
        return new Time(new Date(this.date.getFullYear() + 1, 0, 0, 0, 0, 0));
    }
    getRaw() {
        return this.date
    }
    getTimeStamp() {
        return this.date.getTime()
    }
    add(amount: number, unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond') {
        const date = new Date(this.date.getTime());
        switch (unit) {
            case 'year':
                date.setFullYear(date.getFullYear() + amount);
                break;
            case 'month':
                const d1 = date.getDate();
                date.setDate(1);
                date.setMonth(date.getMonth() + amount);
                const d2 = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0).getDate();
                date.setDate(Math.min(d1, d2));
                break;
            case 'day':
                date.setDate(date.getDate() + amount);
                break;
            case 'hour':
                date.setHours(date.getHours() + amount);
                break;
            case 'minute':
                date.setMinutes(date.getMinutes() + amount);
                break;
            case 'second':
                date.setSeconds(date.getSeconds() + amount);
                break;
            case 'millisecond':
                date.setMilliseconds(date.getMilliseconds() + amount);
                break;
            default:
                throw new Error('Time add: unknown unit')
        }
        return new Time(date)
    }
}

export const TimeFunc = {
    wrapDate: function(startDate: string, endDate: string) {
        return {
            startDate: `${startDate} 00:00:00`,
            endDate: `${endDate} 23:59:59`
        }
    },
    wrapDateDiff: function(startDate: string, endDate: string) {
        const start = new Time(`${startDate} 00:00:00`);
        const end = new Time(`${endDate} 23:59:59`);
        return end.getTimeStamp() - start.getTimeStamp();
    }
}

export const TimeConst = {
    DAY_MILLISECOND: 24 * 60 * 60 * 1000,
    HOUR_MILLISECOND: 60 * 60 * 1000,
    MINUTE_MILLISECOND: 60 * 1000,
    SECOND_MILLISECOND: 1000,
}