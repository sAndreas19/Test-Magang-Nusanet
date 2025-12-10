import express from 'express';
import { getScheduleRange, getShift, EMPLOYEES } from './src/shift.js';
import { exportToStream } from './src/export.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// validasi user_id
function validateUser(userId) {
    if (!userId) return true;
    const exists = EMPLOYEES.find(e => e.id === userId);
    return !!exists;
}

// validasi tanggal
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false;

    const date = new Date(dateString);
    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;

    return date.toISOString().startsWith(dateString);
}

// GET /api/schedules
app.get('/api/schedules', (req, res) => {
    const { start_date, end_date, user_id } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({
            status: "error",
            message: "start_date and end_date are required",
            http_code: 400
        });
    }

    if (!isValidDate(start_date)) {
        return res.status(400).json({
            status: "error",
            message: `Invalid start_date '${start_date}'. Date does not exist in calendar.`,
            http_code: 400
        });
    }
    if (!isValidDate(end_date)) {
        return res.status(400).json({
            status: "error",
            message: `Invalid end_date '${end_date}'. Date does not exist in calendar.`,
            http_code: 400
        });
    }

    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid date range: start_date cannot be greater than end_date",
            http_code: 400
        });
    }

    // validasi User
    if (user_id && !validateUser(user_id)) {
        return res.status(404).json({
            status: "error",
            message: `User with ID '${user_id}' not found`,
            http_code: 404
        });
    }

    try {
        const data = getScheduleRange(start_date, end_date, user_id);
        res.status(200).json({
            status: "success",
            data: data,
            http_code: 200
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// GET /api/check-schedule
app.get('/api/check-schedule', (req, res) => {
    const { user_id, date } = req.query;

    if (!user_id || !date) {
        return res.status(400).json({ status: "error", message: "user_id and date are required" });
    }

    // Validasi Tanggal Strict
    if (!isValidDate(date)) {
        return res.status(400).json({
            status: "error",
            message: `Invalid date '${date}'. Date does not exist in calendar.`,
            http_code: 400
        });
    }

    // validasi User
    const employee = EMPLOYEES.find(e => e.id === user_id);
    if (!employee) {
        return res.status(404).json({ 
            status: "error", 
            message: `User with ID '${user_id}' not found`,
            http_code: 404
        });
    }

    const shift = getShift(employee, date);

    res.status(200).json({
        status: "success",
        data: {
            id: employee.id,
            name: employee.name,
            date: date,
            shift: shift
        },
        http_code: 200
    });
});

// GET /api/export-schedules
app.get('/api/export-schedules', async (req, res) => {
    const { start_date, end_date, user_id } = req.query;

    // validasi Parameter
    if (!start_date || !end_date) {
        return res.status(400).json({ 
            status: "error", 
            message: "start_date and end_date are required",
            http_code: 400
        });
    }

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid date provided. Please check the calendar.",
            http_code: 400
        });
    }

    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid date range: start_date cannot be greater than end_date",
            http_code: 400
        });
    }

    // validasi User
    if (user_id && !validateUser(user_id)) {
        return res.status(404).json({
            status: "error",
            message: `Cannot export: User with ID '${user_id}' not found`,
            http_code: 404
        });
    }

    try {
        await exportToStream(res, start_date, end_date, user_id);
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ status: "error", message: "Internal Server Error generating Excel" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`API Server berjalan di http://localhost:${PORT}`);
});