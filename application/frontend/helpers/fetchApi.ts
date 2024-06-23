
type Breakpoint = 'mobile' | 'tablet' | 'desktop';
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export async function fetchServiceApi<T>(breakpoint: Breakpoint, method: Method, query: object, options?: any): Promise<T> {
    const res = await fetch(`/api/v1/${breakpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
        ...options,
    }) as ResponseApi<T>;
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    return await res.json();
}