/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {default as addMinutes} from 'date-fns/addMinutes';
import {default as differenceInMinutes} from 'date-fns/differenceInMinutes';
import {default as formatDate} from 'date-fns/format';
import {default as parseDate} from 'date-fns/parse';

import type {ISelectOption} from './Select';

export {formatDate, parseDate};

export interface IDay {
	date: Date;
	nextMonth?: boolean;
	previousMonth?: boolean;
}

export type WeekDays = Array<IDay>;

export type Month = Array<WeekDays>;

const timezonePattern = /GMT[+-](0[0-9]|1[0-4]):?[0-5]\d/;

/**
 * Clone a date object.
 */
export function clone(date: number | Date) {
	return new Date(date instanceof Date ? date.getTime() : date);
}

export function range({end, start}: {end: number; start: number}) {
	return Array.from(
		{
			length: end - start + 1,
		},
		(_v, k) => k + start
	);
}

export function addMonths(date: number | Date, months: number) {
	date = clone(date);

	date.setMonth(date.getMonth() + months);

	return date;
}

export function setDate(
	date: Date,
	options: {
		date?: number | string;
		seconds?: number | string;
		milliseconds?: number | string;
		hours?: number | string;
		minutes?: number | string;
		year?: number | string;
	}
) {
	date = clone(date);

	return Object.keys(options).reduce((acc, key) => {
		const method = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
		// @ts-ignore
		acc[method](options[key]);

		return acc;
	}, date);
}

export function isValid(date: Date) {
	return date instanceof Date && !isNaN(date.getTime());
}

export function setMonth(
	range: Array<ISelectOption>,
	month: number,
	currentMonth: Date
) {
	const date = addMonths(currentMonth, month);
	const year = date.getFullYear();

	if (range.find((elem) => elem.value === year)) {
		return date;
	}
}

/**
 * Checks if the timezone is valid according to the expected format.
 *
 * @param timezone - The timezone string to validate.
 */
export function isTimezoneValid(
	timezone: string | undefined
): timezone is string {
	return !!timezone && timezonePattern.test(timezone);
}

/**
 * It returns a equivalent date in the specified timezone. If the given timezone is invalid, it returns the original date instead.
 *
 * @param date - The date to be converted.
 * @param timezone - The target timezone in GMT format (e.g., "GMT+02:00").
 * @returns the date adjusted to the specified timezone.
 */
export function getDateInTimezone(date: Date, timezone: string | undefined) {
	if (!isTimezoneValid(timezone)) {
		return addMinutes(date, 0);
	}

	const dateAsText = date.toString();
	const dateAsTextWithTimezone = dateAsText.replace(
		timezonePattern,
		timezone
	);

	const dateWithTimezone = new Date(dateAsTextWithTimezone);
	const offsetInMinutes = differenceInMinutes(date, dateWithTimezone);

	return addMinutes(date, offsetInMinutes);
}
