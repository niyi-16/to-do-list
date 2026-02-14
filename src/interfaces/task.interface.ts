export interface Task {
    id: number;
    name: string;
    completed: boolean;
    description: string;
    edit?: boolean;
    deleted?: boolean;
    createdAt?: string;
    dateDue?: string;
}
