import { Evaluator, EvaluatorResult } from "./types";
import { launcherLogger as log } from "../logger";

export class DateCalculator implements Evaluator {
  name = "DateCalculator";

  evaluate(input: string): EvaluatorResult | null {
    const result = this.calculateDate(input);
    if (result !== null) {
      return {
        value: result,
        hint: "Press Enter to copy result"
      };
    }
    return null;
  }

  private calculateDate(input: string): string | null {
    const trimmed = input.trim().toLowerCase();
    const now = new Date();

    // Pattern: today/tomorrow/yesterday
    if (trimmed === 'today') {
      return this.formatDate(now);
    } else if (trimmed === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return this.formatDate(tomorrow);
    } else if (trimmed === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return this.formatDate(yesterday);
    }

    // Pattern: today + X days/weeks/months
    const addPattern = /^today\s*([+-])\s*(\d+)\s*(day|days|week|weeks|month|months|year|years)$/;
    let match = trimmed.match(addPattern);
    if (match) {
      const operator = match[1];
      const amount = parseInt(match[2]);
      const unit = match[3];
      return this.addToDate(now, operator === '+' ? amount : -amount, unit);
    }

    // Pattern: days until/since date
    const untilPattern = /^days?\s+(until|since|to)\s+(.+)$/;
    match = trimmed.match(untilPattern);
    if (match) {
      const preposition = match[1];
      const dateStr = match[2];
      const targetDate = this.parseDate(dateStr);
      if (targetDate) {
        const days = this.daysBetween(now, targetDate);
        if (preposition === 'since') {
          return `${Math.abs(days)} days`;
        } else {
          return days >= 0 ? `${days} days` : `${Math.abs(days)} days ago`;
        }
      }
    }

    // Pattern: next/last weekday
    const weekdayPattern = /^(next|last)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/;
    match = trimmed.match(weekdayPattern);
    if (match) {
      const direction = match[1];
      const weekday = match[2];
      return this.formatDate(this.getWeekday(weekday, direction === 'next'));
    }

    // Pattern: date in X days/weeks/months
    const inPattern = /^in\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)$/;
    match = trimmed.match(inPattern);
    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2];
      return this.addToDate(now, amount, unit);
    }

    return null;
  }

  private parseDate(dateStr: string): Date | null {
    // Handle special dates
    if (dateStr === 'christmas') {
      const year = new Date().getFullYear();
      const christmas = new Date(year, 11, 25); // December 25
      // If Christmas has passed this year, use next year
      if (christmas < new Date()) {
        christmas.setFullYear(year + 1);
      }
      return christmas;
    }
    
    if (dateStr === 'new year' || dateStr === 'new years') {
      const year = new Date().getFullYear();
      return new Date(year + 1, 0, 1); // January 1 of next year
    }

    // Try parsing various date formats
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  private addToDate(date: Date, amount: number, unit: string): string {
    const result = new Date(date);
    
    switch (unit) {
      case 'day':
      case 'days':
        result.setDate(result.getDate() + amount);
        break;
      case 'week':
      case 'weeks':
        result.setDate(result.getDate() + (amount * 7));
        break;
      case 'month':
      case 'months':
        result.setMonth(result.getMonth() + amount);
        break;
      case 'year':
      case 'years':
        result.setFullYear(result.getFullYear() + amount);
        break;
    }
    
    return this.formatDate(result);
  }

  private getWeekday(weekdayName: string, next: boolean): Date {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = weekdays.indexOf(weekdayName);
    if (targetDay === -1) return new Date();

    const today = new Date();
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;

    if (next) {
      if (daysToAdd <= 0) daysToAdd += 7;
    } else {
      if (daysToAdd >= 0) daysToAdd -= 7;
    }

    const result = new Date(today);
    result.setDate(result.getDate() + daysToAdd);
    return result;
  }

  private daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor((date2.getTime() - date1.getTime()) / oneDay);
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  getHint(): string {
    return "Calculate: today + 7 days, days until christmas, next friday";
  }
}