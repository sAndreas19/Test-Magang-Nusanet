export const EMPLOYEES = [
    { id: '001', name: 'Ahmad', pattern: ['P', 'P', 'S', 'S', 'M', 'M', 'L'] },
    { id: '002', name: 'Widi', pattern: ['S', 'S', 'M', 'M', 'L', 'P', 'S'] },
    { id: '003', name: 'Yono', pattern: ['M', 'M', 'P', 'L', 'P', 'P', 'M'] },
    { id: '004', name: 'Yohan', pattern: ['L', 'P', 'P', 'P', 'S', 'S', 'P', 'L', 'S', 'S', 'P', 'S', 'S', 'P'] }
]; // -> Pola shift karyawan

const START_DATE_STR = '2024-12-26'; // hari pertama adalah kamis

export function getShift(employee, targetDateStr) {
    const startDate = new Date(START_DATE_STR);
    const targetDate = new Date(targetDateStr);
    const diffTime = targetDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;

    const startDayOffset = 3; // Kamis
    const totalIndex = startDayOffset + diffDays;
    const patternIndex = totalIndex % employee.pattern.length;

    return employee.pattern[patternIndex];
}

export function getScheduleRange(startDateStr, endDateStr, userId = null) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    let targets = EMPLOYEES;
    if (userId) {
        targets = EMPLOYEES.filter(e => e.id === userId);
    }

    if (targets.length === 0) return [];

    // menyiapkan Struktur Data JSON sesuai permintaan API
    const result = targets.map(emp => ({
        id: emp.id,
        name: emp.name,
        schedule: {} 
    }));

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        result.forEach((resItem, index) => {
            // index sama karena urutan targets dan result sama
            const employee = targets[index]; 
            const shift = getShift(employee, dateStr);
            resItem.schedule[dateStr] = shift;
        });
    }

    return result;
}