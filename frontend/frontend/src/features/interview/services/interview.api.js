import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

/**
 * Generate interview report
 * @param {FormData} formData - Contains resume file, jobDescription, and selfDescription
 */
export async function generateInterviewReport(formData) {
    try {
        const response = await api.post('/api/interview/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (err) {
        console.error('Error generating interview report:', err)
        throw err
    }
}

/**
 * Get all interview reports for the logged-in user
 */
export async function getInterviewReports() {
    try {
        const response = await api.get('/api/interview/')
        return response.data
    } catch (err) {
        console.error('Error fetching interview reports:', err)
        throw err
    }
}

/**
 * Get a specific interview report by ID
 * @param {string} id - Interview report ID
 */
export async function getInterviewReportById(id) {
    try {
const response = await api.get(`/api/interview/report/${id}`)
        return response.data
    } catch (err) {
        console.error('Error fetching interview report:', err)
        throw err
    }
}