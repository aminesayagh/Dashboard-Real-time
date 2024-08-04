import { ApiResponse } from '@/types/api';
import { BACKEND_URL } from '@utils/env';
import qs from 'qs';

const BASE_API_URL = '/api/v1';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
};

const DEFAULT_OPTIONS = {
    headers: DEFAULT_HEADERS,
};

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';


async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.ok) {
        return response.json();
    } else {
        const error = await response.json();
        throw new Error(error.message);
    }
}

type validSendingData = Record<string, string | number | boolean | undefined>;

class Fetch {
    private _method: Method | null = null;
    private _path: string = BASE_API_URL;
    private _headers: HeadersInit = DEFAULT_HEADERS;
    private _query: string = '';
    private _body: validSendingData = {};

    get method(): Method {
        if (this._method === null) {
            throw new Error('Method not set');
        }
        return this._method;
    }
    set method(value: Method) {
        if (this._method !== null) {
            throw new Error('Method already set');
        }
        this._method = value;
    }
    get path() {
        return this._path;
    }
    set path(value: string) {
        if (this._path !== BASE_API_URL) {
            throw new Error('Path already set');
        }
        this._path += value;
    }
    set query(value: validSendingData | string) {
        if (typeof value === 'string') {
            this._query = value;
            return;
        }
        this._query = qs.stringify(value);
    }
    get query(): string {
        return this._query;
    }
    set headers(value: HeadersInit) {
        this._headers = value;
    }
    get headers(): HeadersInit {
        return this._headers;
    }
    set body(value: validSendingData) {
        this._body = value;
    }
    get body(): validSendingData {
        return this._body;
    }
    private async request<T>(options: RequestInit): Promise<ApiResponse<T>> {
        const url = new URL(`${BACKEND_URL}${BASE_API_URL}${this._path}`);

        if (this.method === 'GET') {
            throw new Error('Cannot send body with GET request');
        }

        // Append query parameters
        Object.keys(this._query).forEach(key => {
            url.searchParams.append(key, (this._query as any)[key]);
        });

        const requestOptions: RequestInit = {
            method: this.method,
            ...DEFAULT_OPTIONS,
            headers: {
                ...DEFAULT_HEADERS,
                ...this._headers,
                ...options?.headers,
            },
            ...options,
            ...(this._method !== 'GET' && { body: JSON.stringify(this.query) })
        };

        if (this._method !== "GET") {
            requestOptions.body = JSON.stringify(this.body);
        }

        try {
            const response = await fetch(url.toString(), requestOptions);
            return await handleResponse<T>(response);
        } catch (error) {
            console.error('Fetch request error:', error);
            throw error;
        }
    }
    public create(path: string) {
        this._path = BASE_API_URL + path;
        this._method = null;
        this._headers = DEFAULT_HEADERS;
        this._query = '';
        this._body = {};
    }
    public get<T>(path: string, query: string|validSendingData, options: RequestInit = {}) {
        this.create(path);
        this.method = 'GET';
        this.query = query;
        return this.request<T>(options);
    }
    public post<T>(path: string, body: validSendingData, options: RequestInit = {}): Promise<ApiResponse<T>> {
        this.create(path);
        this.method = 'POST';
        this.body = body;
        return this.request<T>(options);
    }
    public put<T>(path: string, body: validSendingData, options: RequestInit = {}): Promise<ApiResponse<T>> {
        this.create(path);
        this.method = 'PUT';
        this.body = body;
        return this.request<T>(options);
    }
    public delete<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        this.create(path);
        this.method = 'DELETE';
        return this.request<T>(options);
    }
    public patch<T>(path: string, body: validSendingData, options: RequestInit = {}): Promise<ApiResponse<T>> {
        this.create(path);
        this.method = 'PATCH';
        this.body = body;
        return this.request<T>(options);
    }
}

// every time this const is called, a new instance of Fetch is created

function f (): InstanceType<typeof Fetch>;
function f <T>(method: Method, path: string, query: string|validSendingData, options: RequestInit = {}): Promise<ApiResponse<T>>;

function f() {
    return new Fetch();
}

function f<T>(method: Method, path: string, query: string|validSendingData, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const fetch = new Fetch();
    return fetch.get<T>(path, query, options);
}

export default f;