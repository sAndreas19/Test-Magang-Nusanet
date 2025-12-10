import { getShift, EMPLOYEES, getScheduleRange } from '../src/shift.js';

describe('Testing Logika Shift Nusanet', () => {
    
    // Test 1: Cek Hari Pertama (26 Des 2024 harus Kamis)
    // Contoh: Ahmad pola: P,P,S,S,M,M,L. Kamis adalah index ke-3 -> 'S'.
    test('Ahmad tanggal 26 Des 2024 harus Shift S (Siang)', () => {
        const ahmad = EMPLOYEES.find(e => e.name === 'Ahmad');
        expect(getShift(ahmad, '2024-12-26')).toBe('S');
    });

    // Test 2: Soal Pilihan Ganda 1
    // Shift apa yang akan yohan dapati jika dia masuk ditanggal 17 Maret 2028?
    test('Yohan tanggal 17 Maret 2028 harus Shift S', () => {
        const yohan = EMPLOYEES.find(e => e.name === 'Yohan');
        expect(getShift(yohan, '2028-03-17')).toBe('S');
    });

    // Test 3: Soal Pilihan Ganda 4
    // Siapa Yang Masuk Malam Pada tanggal 2028-11-14?
    test('Yono tanggal 14 Nov 2028 harus Shift M', () => {
        const yono = EMPLOYEES.find(e => e.name === 'Yono');
        expect(getShift(yono, '2028-11-14')).toBe('M');
    });

});