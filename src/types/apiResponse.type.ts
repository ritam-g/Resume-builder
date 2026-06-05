export interface ApiResponse<T = unknown> {
    message: string;
    data?: T;
    error?: unknown;
    success: boolean;
}

export interface LooginBody{
    email: string;
    password: string
}

export interface RegisterBody{
    name: string;
    email: string;
    password: string;
    mobile: number;
}
