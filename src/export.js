import ExcelJS from 'exceljs';
import { getShift, EMPLOYEES } from './shift.js';

export async function exportToStream(res, startDate, endDate, userId = null) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Jadwal Shift');

    let targets = EMPLOYEES;
    if (userId) {
        targets = EMPLOYEES.filter(e => e.id === userId);
    }

    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
    }

    const columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nama', key: 'name', width: 20 },
    ];
    dates.forEach(date => {
        columns.push({ header: date, key: date, width: 5, style: { alignment: { horizontal: 'center' } } });
    });
    sheet.columns = columns;

    // mengisi data
    targets.forEach(emp => {
        const rowData = { id: emp.id, name: emp.name };
        dates.forEach(date => {
            rowData[date] = getShift(emp, date);
        });
        sheet.addRow(rowData);
    });

    // mengirim ke response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + `Schedule_${startDate}_to_${endDate}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
}