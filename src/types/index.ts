export type Subject = {
    id: number;
    name: string;
    code: string;
    description: string;
    departmentId: number;
    createdAt?: string;
};

export type ListResponse<T = unknown> = {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateResponse<T = unknown> = {
    data?: T;
};

export type GetOneResponse<T = unknown> = {
    data?: T;
};

declare global {
    interface CloudinaryUploadWidgetResults {
        event: string;
        info: {
            secure_url: string;
            public_id: string;
            delete_token?: string;
            resource_type: string;
            original_filename: string;
        };
    }

    interface CloudinaryWidget {
        open: () => void;
    }

    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (
                    error: unknown,
                    result: CloudinaryUploadWidgetResults
                ) => void
            ) => CloudinaryWidget;
        };
    }
}

export interface UploadWidgetValue {
    url: string;
    publicId: string;
}

export interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (value: UploadWidgetValue | null) => void;
    disabled?: boolean;
}

export enum UserRole {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin",
}

export type User = {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    name: string;
    bio?: string;
    role: UserRole;
    phoneNumber?: string;
    image?: string;
    imageCldPubId?: string;
    department?: string;
    address?: string;
    age?: string;
    gender?: string;
    joiningDate?: string;
    classes?: ClassDetails[];
    departments?: Department[];
};

export type Schedule = {
    day: string;
    startTime: string;
    endTime: string;
};

export type Department = {
    id: number;
    name: string;
    description: string;
    bannerUrl?: string;
    bannerCldPubId?: string;
    headTeacherId?: string;
    headTeacher?: User;
    teachers?: User[];
    level?: number;
    parentDepartmentId?: number;
    parentDepartment?: Department;
    sections?: Department[];
};

export type ClassDetails = {
    id: number;
    name: string;
    description: string;
    status: "active" | "inactive";
    capacity: number;
    courseCode: string;
    courseName: string;
    bannerUrl?: string;
    bannerCldPubId?: string;
    subject?: Subject;
    teacher?: User;
    department?: Department;
    schedules: Schedule[];
    inviteCode?: string;
    totalStudents?: number;
};

export type SignUpPayload = {
    email: string;
    name: string;
    password: string;
    image?: string;
    imageCldPubId?: string;
    role: UserRole;
};

export type Attendance = {
    id: number;
    classId: number;
    studentId: number;
    date: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
    createdAt?: string;
    updatedAt?: string;
    class?: {
        id: number;
        name: string;
    };
    student?: {
        id: number;
        name: string;
        rollNumber?: string;
    };
};
