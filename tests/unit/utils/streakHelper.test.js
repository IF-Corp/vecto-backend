const { calculateNewStreak } = require('../../../src/utils/streakHelper');
const { parseISO } = require('date-fns');

describe('streakHelper', () => {
    describe('calculateNewStreak', () => {
        const dailyHabit = {
            frequency: 'DAILY',
            current_streak: 5,
            best_streak: 10,
        };

        const weeklyHabit = {
            frequency: 'WEEKLY',
            current_streak: 2,
            best_streak: 5,
        };

        test('should reset streak to 0 if status is FAILED', () => {
            const result = calculateNewStreak(dailyHabit, new Date(), 'FAILED', []);
            expect(result.newStreak).toBe(0);
            expect(result.bestStreak).toBe(10);
        });

        test('should not increase streak if status is not DONE/completed', () => {
            const result = calculateNewStreak(dailyHabit, new Date(), 'SKIPPED', []);
            expect(result.newStreak).toBe(5);
        });

        test('should increase streak for daily habit on consecutive day', () => {
            const history = [{ execution_date: '2026-02-22T10:00:00Z', status: 'DONE' }];
            const logDate = '2026-02-23T10:00:00Z';
            const result = calculateNewStreak(dailyHabit, logDate, 'DONE', history);
            expect(result.newStreak).toBe(6);
            expect(result.bestStreak).toBe(10);
        });

        test('should NOT increase streak for daily habit on same day', () => {
            const history = [{ execution_date: '2026-02-23T08:00:00Z', status: 'DONE' }];
            const logDate = '2026-02-23T15:00:00Z';
            const result = calculateNewStreak(dailyHabit, logDate, 'DONE', history);
            expect(result.newStreak).toBe(5);
        });

        test('should reset streak to 1 for daily habit if day missed', () => {
            const history = [{ execution_date: '2026-02-20T10:00:00Z', status: 'DONE' }];
            const logDate = '2026-02-23T10:00:00Z'; // Missed 21st and 22nd
            const result = calculateNewStreak(dailyHabit, logDate, 'DONE', history);
            expect(result.newStreak).toBe(1);
        });

        test('should increase streak for weekly habit on consecutive week', () => {
            const history = [
                { execution_date: '2026-02-11T10:00:00Z', status: 'DONE' }, // Wednesday, week 7
            ];
            const logDate = '2026-02-18T10:00:00Z'; // Wednesday, week 8
            const result = calculateNewStreak(weeklyHabit, logDate, 'DONE', history);
            expect(result.newStreak).toBe(3);
        });

        test('should NOT increase streak for weekly habit in same week', () => {
            const history = [
                { execution_date: '2026-02-16T10:00:00Z', status: 'DONE' }, // Monday, week 8
            ];
            const logDate = '2026-02-18T10:00:00Z'; // Wednesday, week 8
            const result = calculateNewStreak(weeklyHabit, logDate, 'DONE', history);
            expect(result.newStreak).toBe(2);
        });

        test('should update best streak if new streak exceeds it', () => {
            const habit = { ...dailyHabit, current_streak: 10, best_streak: 10 };
            const history = [{ execution_date: '2026-02-22T10:00:00Z', status: 'DONE' }];
            const logDate = '2026-02-23T10:00:00Z';
            const result = calculateNewStreak(habit, logDate, 'DONE', history);
            expect(result.newStreak).toBe(11);
            expect(result.bestStreak).toBe(11);
        });

        test('should handle string dates correctly', () => {
            const history = [{ execution_date: '2026-02-22', status: 'DONE' }];
            const logDate = '2026-02-23';
            const result = calculateNewStreak(dailyHabit, logDate, 'DONE', history);
            expect(result.newStreak).toBe(6);
        });
    });
});
