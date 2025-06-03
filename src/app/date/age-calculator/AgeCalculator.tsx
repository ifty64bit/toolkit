"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Clock } from "lucide-react";
import { getZodiacSign } from "../../../lib/functions";

dayjs.extend(duration);
dayjs.extend(advancedFormat);

function getAge(birthday: { years: number; months: number; days: number }) {
    const birthDate = dayjs()
        .set("year", birthday.years)
        .set("month", birthday.months - 1)
        .set("date", birthday.days);
    const today = dayjs();

    if (!birthDate.isValid() || birthDate.isAfter(today)) {
        return null;
    }

    const years = today.diff(birthDate, "year");
    const months = today.diff(birthDate.add(years, "year"), "month");
    const days = today.diff(
        birthDate.add(years, "year").add(months, "month"),
        "day"
    );
    const totalDays = today.diff(birthDate, "day");
    const totalHours = today.diff(birthDate, "hour");
    const totalMinutes = today.diff(birthDate, "minute");
    const zodiacSign = getZodiacSign(birthday.months, birthday.days);

    return {
        years,
        months,
        days,
        totalDays,
        totalHours,
        totalMinutes,
        zodiacSign,
    };
}

function AgeCalculator() {
    const [birthday, setBirthday] = useState<{
        years: number;
        months: number;
        days: number;
    }>({
        years: 1998,
        months: 11,
        days: 7,
    });

    const age = birthday ? getAge(birthday) : null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-evenly gap-4 max-w-7xl mx-auto">
            <div className="flex gap-4 flex-wrap">
                <div>
                    <label htmlFor="year">Select year</label>
                    <Select
                        defaultValue="1998"
                        onValueChange={(value) => {
                            setBirthday((prev) => {
                                if (prev) {
                                    return {
                                        ...prev,
                                        years: parseInt(value),
                                    };
                                } else {
                                    return {
                                        years: parseInt(value),
                                        months: 0,
                                        days: 0,
                                    };
                                }
                            });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {Array.from({ length: 100 }, (_, i) => (
                                <SelectItem
                                    key={i}
                                    value={(
                                        new Date().getFullYear() - i
                                    ).toString()}
                                >
                                    {new Date().getFullYear() - i}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="month">Select month</label>
                    <Select
                        defaultValue="11"
                        onValueChange={(value) => {
                            setBirthday((prev) => {
                                if (prev) {
                                    return {
                                        ...prev,
                                        months: parseInt(value),
                                    };
                                } else {
                                    return {
                                        years: 0,
                                        months: parseInt(value),
                                        days: 0,
                                    };
                                }
                            });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i} value={(i + 1).toString()}>
                                    {new Date(0, i).toLocaleString("default", {
                                        month: "long",
                                    })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="day">Select day</label>
                    <Select
                        defaultValue="7"
                        onValueChange={(value) => {
                            setBirthday((prev) => {
                                if (prev) {
                                    return {
                                        ...prev,
                                        days: parseInt(value),
                                    };
                                } else {
                                    return {
                                        years: 0,
                                        months: 0,
                                        days: parseInt(value),
                                    };
                                }
                            });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {Array.from({ length: 31 }, (_, i) => (
                                <SelectItem key={i} value={(i + 1).toString()}>
                                    {i + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <div className="mt-8 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Your Age
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {age?.years}
                            </div>
                            <div className="text-sm text-gray-600">Years</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {age?.months}
                            </div>
                            <div className="text-sm text-gray-600">Months</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {age?.days}
                            </div>
                            <div className="text-sm text-gray-600">Days</div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border">
                        <div className="text-center">
                            <div className="text-4xl mb-2">
                                {age?.zodiacSign.emoji}
                            </div>
                            <div className="text-xl font-semibold text-indigo-700 mb-1">
                                {age?.zodiacSign.sign}
                            </div>
                            <div className="text-sm text-indigo-600">
                                {age?.zodiacSign.dates}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-700">
                                {age?.totalDays.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                                Total Days
                            </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-700">
                                {age?.totalHours.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                                Total Hours
                            </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-700">
                                {age?.totalMinutes.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                                Total Minutes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AgeCalculator;
