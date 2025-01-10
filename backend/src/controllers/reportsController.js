import {
    AppDataSource
} from '../config/database.js';
import {
    formatSecondsToHMS
} from '../utils/timeUtils.js'

export const getReports = async (req, res) => {
    try {
        let searCondition = ' WHERE 1=1 ';
        const {alias, disposition, callType} = req.query; // Default to page 1
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit; // Calculate the offset for the query
        if (disposition !== 'All') {
            if (disposition === 'NOANSWER') {
                searCondition += " AND disposition IS NULL";
            } else {
                searCondition += ` AND disposition = '${disposition}'`;
            }
        }

        searCondition += callType != 'All' ? ` AND call_type='${callType}' ` : '';
        const rawQuery = `SELECT * FROM ${alias}_call_logs  ${searCondition} LIMIT ? OFFSET ?;`; // Replace with your table name
        // Query for total count
        const countQuery = `SELECT COUNT(*) AS total FROM ${alias}_call_logs ${searCondition} ;`;

        let reports = [];
        let totalCount = 0;
        try {
            // Execute both queries
            const [reportResults, totalCountResult] = await Promise.all([
                AppDataSource.query(rawQuery, [limit, offset]),
                AppDataSource.query(countQuery),
            ]);

            reports = reportResults;
            totalCount = totalCountResult[0] ?.total || 0;
        } catch (err) {
            // Handle table not found error (e.g., ER_NO_SUCH_TABLE in MySQL)
            if (err.code === 'ER_NO_SUCH_TABLE') {
                reports = [];
                totalCount = 0;
            } else {
                throw err;
            }
        }

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