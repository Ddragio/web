const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
    token?: string;
}

async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('gs_token');
        if (stored) headers['Authorization'] = `Bearer ${stored}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, { ...fetchOptions, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API request failed');
    return data;
}

export const api = {
    // Auth
    register: (body: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => apiFetch('/auth/me'),
    forgotPassword: (email: string) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

    // Courses
    getCourses: (params?: string) => apiFetch(`/courses${params ? `?${params}` : ''}`),
    getCourse: (id: string) => apiFetch(`/courses/${id}`),
    createCourse: (body: any) => apiFetch('/courses', { method: 'POST', body: JSON.stringify(body) }),
    updateCourse: (id: string, body: any) => apiFetch(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteCourse: (id: string) => apiFetch(`/courses/${id}`, { method: 'DELETE' }),

    // Enrollments
    createOrder: (courseId: string) => apiFetch('/enrollments/create-order', { method: 'POST', body: JSON.stringify({ courseId }) }),
    verifyPayment: (body: any) => apiFetch('/enrollments/verify-payment', { method: 'POST', body: JSON.stringify(body) }),
    getMyEnrollments: () => apiFetch('/enrollments/my'),

    // Progress
    markComplete: (lectureId: string) => apiFetch('/progress', { method: 'POST', body: JSON.stringify({ lectureId }) }),
    getCourseProgress: (courseId: string) => apiFetch(`/progress/${courseId}`),

    // Admin
    getAdminStats: () => apiFetch('/admin/stats'),
    getAdminStudents: () => apiFetch('/admin/students'),
    updateStudentAccess: (userId: string, body: any) => apiFetch(`/admin/students/${userId}/access`, { method: 'PUT', body: JSON.stringify(body) }),
    getAdminPayments: () => apiFetch('/admin/payments'),
    sendNotification: (body: any) => apiFetch('/admin/send-notification', { method: 'POST', body: JSON.stringify(body) }),

    // Test Series
    getTestSeries: () => apiFetch('/test-series'),
    createTestSeries: (body: any) => apiFetch('/test-series', { method: 'POST', body: JSON.stringify(body) }),
    submitTestAttempt: (body: any) => apiFetch('/test-series/attempts', { method: 'POST', body: JSON.stringify(body) }),
    getMyAttempts: () => apiFetch('/test-series/attempts/my'),

    // Resources
    getResources: () => apiFetch('/resources'),
    createResource: (body: any) => apiFetch('/resources', { method: 'POST', body: JSON.stringify(body) }),

    // Lectures
    getSignedUrl: (lectureId: string) => apiFetch(`/lectures/${lectureId}/signed-url`),
};

export default api;
