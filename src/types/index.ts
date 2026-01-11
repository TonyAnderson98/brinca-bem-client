export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface Toy {
    id: number;
    title: string;
    description: string;
    category: string;
    condition: 'new' | 'used';
    status: 'pending' | 'available' | 'donated';
    images: string[];
    user_id: number;
    created_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}