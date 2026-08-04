import {
  type OrderStatus,
  type PaymentStatus,
  type Role,
  type Gender,
  type FitnessGoal,
  type FoodPreference,
  type ExerciseType,
  type WorkType,
} from "@prisma/client";

// ── Re-export Prisma enums ─────────────────────────────────────────────────

export type {
  OrderStatus,
  PaymentStatus,
  Role,
  Gender,
  FitnessGoal,
  FoodPreference,
  ExerciseType,
  WorkType,
};

// ── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Auth Types ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name?: string | null;
  supabaseId: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

// ── Order Types ────────────────────────────────────────────────────────────

export interface OrderWithDetails {
  id: string;
  status: OrderStatus;
  amountInPaise: number;
  dietContent?: string | null;
  dietPublishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  payment?: {
    id: string;
    utrNumber: string;
    screenshotPath?: string | null;
    amountInPaise: number;
    status: PaymentStatus;
    rejectionReason?: string | null;
    createdAt: Date;
  } | null;
  questionnaire?: {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    heightCm: number;
    weightKg: number;
    city: string;
    state: string;
    fitnessGoal: FitnessGoal;
    foodPreference: FoodPreference;
    stapleFoods: string[];
    proteinSources: string[];
    vegetables: string[];
    fruits: string[];
    snacks: string[];
    drinks: string[];
    medicalConditions: string[];
    wakeUpTime: string;
    sleepTime: string;
    workTimings: string;
    workType: WorkType;
    exercise: ExerciseType;
    allergies?: string | null;
    favouriteFoods?: string | null;
    hatedFoods?: string | null;
    additionalNotes?: string | null;
  } | null;
  dietFile?: {
    id: string;
    originalFileName: string;
    uploadedAt: Date;
  } | null;
}

// ── Questionnaire Types ────────────────────────────────────────────────────

export interface QuestionnaireData {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  city: string;
  state: string;
  fitnessGoal: FitnessGoal;
  foodPreference: FoodPreference;
  stapleFoods: string[];
  proteinSources: string[];
  vegetables: string[];
  fruits: string[];
  snacks: string[];
  drinks: string[];
  medicalConditions: string[];
  wakeUpTime: string;
  sleepTime: string;
  workTimings: string;
  workType: WorkType;
  exercise: ExerciseType;
  allergies?: string;
  favouriteFoods?: string;
  hatedFoods?: string;
  additionalNotes?: string;
}

// ── Admin Types ────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  pendingVerification: number;
  dietInProgress: number;
  published: number;
  totalUsers: number;
}

export interface AdminUserItem {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  supabaseId: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    orders: number;
  };
}

// ── File Upload Types ──────────────────────────────────────────────────────

export interface UploadedFile {
  path: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
}

// ── UI State Types ─────────────────────────────────────────────────────────

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  duration?: number;
}
