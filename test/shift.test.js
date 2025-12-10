import { getShift, EMPLOYEES, getScheduleRange } from '../src/shift.js';

describe('Testing Logika Shift Nusanet (Full Coverage)', () => {

    // Validasi Start Date
    test('Ahmad pada Start Date (26 Des 2024) harus Shift S', () => {
        const ahmad = EMPLOYEES.find(e => e.id === '001');
        expect(getShift(ahmad, '2024-12-26')).toBe('S');
    });

    // 2. Soal Pilihan Ganda 1
    // Shift apa yang akan yohan dapati jika dia masuk ditanggal 17 Maret 2028?
    test('Soal 1: Yohan tanggal 17 Maret 2028 harus Shift S', () => {
        const yohan = EMPLOYEES.find(e => e.id === '004');
        expect(getShift(yohan, '2028-03-17')).toBe('S');
    });

    // 3. Soal Pilihan Ganda 3 (Pernyataan yang benar)
    // Widi dan Yohan Sama-sama masuk Siang (S) di tanggal 2028-10-03
    test('Soal 3: Widi dan Yohan sama-sama Shift S pada 03 Okt 2028', () => {
        const widi = EMPLOYEES.find(e => e.id === '002');
        const yohan = EMPLOYEES.find(e => e.id === '004');
        
        expect(getShift(widi, '2028-10-03')).toBe('S');
        expect(getShift(yohan, '2028-10-03')).toBe('S');
    });

    // 4. Soal Pilihan Ganda 4
    // Siapa Yang Masuk Malam Pada tanggal 2028-11-14
    test('Soal 4: Yono tanggal 14 Nov 2028 harus Shift M', () => {
        const yono = EMPLOYEES.find(e => e.id === '003');
        expect(getShift(yono, '2028-11-14')).toBe('M');
    });

    // Test Fungsi List Jadwal (range)

    test('Soal 2: Pola Jadwal Yohan 03-09 Juni 2028 (Rentang 7 Hari)', () => {
        const hasilRange = getScheduleRange('2028-06-03', '2028-06-09');
        const dataYohan = hasilRange.filter(item => item.employeeId === '004');
        
        const polaShiftYohan = dataYohan.map(item => item.shift);
        const kunciJawaban = ['S', 'P', 'L', 'P', 'P', 'P', 'S'];

        // validasi apakah hasil kodingan sama dengan kunci jawaban
        expect(polaShiftYohan).toEqual(kunciJawaban);
    });

});