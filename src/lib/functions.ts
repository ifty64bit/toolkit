export function getZodiacSign(
    month: number,
    day: number
): { sign: string; emoji: string; dates: string } {
    const zodiacSigns = [
        {
            sign: "Capricorn",
            emoji: "♑",
            start: [12, 22],
            end: [1, 19],
            dates: "Dec 22 - Jan 19",
        },
        {
            sign: "Aquarius",
            emoji: "♒",
            start: [1, 20],
            end: [2, 18],
            dates: "Jan 20 - Feb 18",
        },
        {
            sign: "Pisces",
            emoji: "♓",
            start: [2, 19],
            end: [3, 20],
            dates: "Feb 19 - Mar 20",
        },
        {
            sign: "Aries",
            emoji: "♈",
            start: [3, 21],
            end: [4, 19],
            dates: "Mar 21 - Apr 19",
        },
        {
            sign: "Taurus",
            emoji: "♉",
            start: [4, 20],
            end: [5, 20],
            dates: "Apr 20 - May 20",
        },
        {
            sign: "Gemini",
            emoji: "♊",
            start: [5, 21],
            end: [6, 20],
            dates: "May 21 - Jun 20",
        },
        {
            sign: "Cancer",
            emoji: "♋",
            start: [6, 21],
            end: [7, 22],
            dates: "Jun 21 - Jul 22",
        },
        {
            sign: "Leo",
            emoji: "♌",
            start: [7, 23],
            end: [8, 22],
            dates: "Jul 23 - Aug 22",
        },
        {
            sign: "Virgo",
            emoji: "♍",
            start: [8, 23],
            end: [9, 22],
            dates: "Aug 23 - Sep 22",
        },
        {
            sign: "Libra",
            emoji: "♎",
            start: [9, 23],
            end: [10, 22],
            dates: "Sep 23 - Oct 22",
        },
        {
            sign: "Scorpio",
            emoji: "♏",
            start: [10, 23],
            end: [11, 21],
            dates: "Oct 23 - Nov 21",
        },
        {
            sign: "Sagittarius",
            emoji: "♐",
            start: [11, 22],
            end: [12, 21],
            dates: "Nov 22 - Dec 21",
        },
    ];

    for (const zodiac of zodiacSigns) {
        const [startMonth, startDay] = zodiac.start;
        const [endMonth, endDay] = zodiac.end;

        if (
            (month === startMonth && day >= startDay) ||
            (month === endMonth && day <= endDay) ||
            (startMonth > endMonth &&
                (month === startMonth || month === endMonth))
        ) {
            return zodiac;
        }
    }

    return zodiacSigns[0];
}
