import {
    AppDataSource
} from '../config/database.js';
import {formatSecondsToHMS} from '../utils/timeUtils.js'

export const getReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit; // Calculate the offset for the query

        const rawQuery = `SELECT * FROM Vox_call_logs  LIMIT ? OFFSET ?;`; // Replace with your table name
        // Query for total count
        const countQuery = `SELECT COUNT(*) AS total FROM Vox_call_logs;`;

        // Execute the queries
        const [reports, totalCountResult] = await Promise.all([
            AppDataSource.query(rawQuery, [limit, offset]),
            AppDataSource.query(countQuery),
        ]);


        // Extract total count from the result
        const totalCount = totalCountResult[0].total;
        const formattedReports = reports.map(report => {
            return {
                ...report,
                duration: formatSecondsToHMS(report.duration), // Format the duration field
            };
        });

        // Return paginated response
        res.json({
            data: formattedReports,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount,
        });
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.status(500).send('Database error');
    }
};