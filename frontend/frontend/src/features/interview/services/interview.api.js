import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// Interceptor to attach token from localStorage if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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

/**
 * Download generated resume PDF for an interview report
 * @param {string} interviewReportId
 */
export async function downloadResumePdf(interviewReportId) {
    try {
        const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, {}, {
            responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tailored_resume_${interviewReportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Error downloading resume PDF:', err);
        throw err;
    }
}