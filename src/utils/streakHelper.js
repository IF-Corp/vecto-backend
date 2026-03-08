const { isSameDay, subDays, isSameWeek, subWeeks, parseISO, startOfDay } = require('date-fns');

const parseDate = (d) => {
    if (d instanceof Date) return startOfDay(d);
    if (typeof d === 'string') {
        // If it's a date-only string like '2026-02-22', parseISO handles it better as a local date
        return startOfDay(parseISO(d));
    }
    return startOfDay(new Date(d));
};

/**
 * Calculates the new streak for a habit or routine based on frequency and history.
 *
 * @param {Object} item - The Habit or Routine object (must have current_streak, frequency, etc.)
 * @param {Date|String} logDate - The date of the current execution
 * @param {String} status - The status of the execution ('DONE' or 'completed')
 * @param {Array} history - Array of previous logs/executions (sorted by date DESC)
 * @returns {Object} - { newStreak: Number, bestStreak: Number }
 */
const calculateNewStreak = (item, logDate, status, history = []) => {
    const executionDate = parseDate(logDate);
    const { frequency, current_streak, best_streak } = item;

    // If FAILED/FAILED status, streak resets to 0
    if (status === 'FAILED' || status === 'failed') {
        return { newStreak: 0, bestStreak: best_streak };
    }

    if (status !== 'DONE' && status !== 'completed') {
        return { newStreak: current_streak, bestStreak: best_streak };
    }

    // Filter out the current execution date from history to check previous state correctly
    // or just assume history passed doesn't include the record we are currently creating/updating
    // For safety, let's filter history to only include items BEFORE the current executionDate
    const previousLogs = history
        .map((h) => ({ ...h, date: parseDate(h.execution_date || h.date) }))
        .filter((h) => h.status === 'DONE' || h.status === 'completed')
        .sort((a, b) => b.date - a.date);

    // Check if there's already a log for the same period (to prevent cheating)
    const hasLogForSamePeriod = previousLogs.some((log) => {
        if (frequency === 'DAILY') {
            return isSameDay(log.date, executionDate);
        } else if (frequency === 'WEEKLY') {
            return isSameWeek(log.date, executionDate, { weekStartsOn: 1 }); // Assuming Monday start
        }
        // For CUSTOM, we might need more complex logic, but for now let's treat it like DAILY
        // if it's supposed to be marked on specific days.
        return isSameDay(log.date, executionDate);
    });

    if (hasLogForSamePeriod) {
        // Already completed in this period, don't increase streak
        return { newStreak: current_streak, bestStreak: best_streak };
    }

    // Now calculate if it's consecutive
    let isConsecutive = false;
    if (previousLogs.length === 0) {
        isConsecutive = true; // First time logging
    } else {
        const lastLogDate = previousLogs[0].date;

        if (frequency === 'DAILY') {
            const yesterday = subDays(executionDate, 1);
            isConsecutive = isSameDay(lastLogDate, yesterday);
        } else if (frequency === 'WEEKLY') {
            const lastWeek = subWeeks(executionDate, 1);
            isConsecutive = isSameWeek(lastLogDate, lastWeek, { weekStartsOn: 1 });
        } else {
            // CUSTOM or anything else, fallback to DAILY logic for now
            const yesterday = subDays(executionDate, 1);
            isConsecutive = isSameDay(lastLogDate, yesterday);
        }
    }

    const newStreak = isConsecutive ? current_streak + 1 : 1;
    const newBestStreak = Math.max(best_streak, newStreak);

    return { newStreak, bestStreak: newBestStreak };
};

module.exports = {
    calculateNewStreak,
};
