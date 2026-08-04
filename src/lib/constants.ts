export const APP_NAME = "Rev & Rep";
export const APP_TAGLINE = "Fuel Your Body. Rev Your Life.";
export const APP_DESCRIPTION =
  "Get your personalized Indian diet plan based on your goals, lifestyle, and eating habits. Only ₹19. Delivered within 24 hours.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://revandrep.in";

export const PRODUCT = {
  name: "Personalized Diet Plan",
  priceDisplay: "₹19",
  priceInPaise: 1900,
  deliveryHours: 24,
  includes: [
    "Personalized Indian Diet Plan",
    "Based on your questionnaire",
    "Indian food options only",
    "Delivered as PDF",
    "Mobile Friendly",
    "Delivered within 24 hours",
  ],
} as const;

export const BRAND = {
  colors: {
    red: "#c41e3a",
    dark: "#080808",
    card: "#141414",
    gray: "#a0a0a0",
    white: "#f5f5f5",
  },
  social: {
    instagram: "https://instagram.com/revandrep",
    whatsapp: "https://wa.me/919999999999",
  },
} as const;

export const FITNESS_GOALS = [
  { value: "WEIGHT_LOSS", label: "Weight Loss" },
  { value: "WEIGHT_GAIN", label: "Weight Gain" },
  { value: "MUSCLE_GAIN", label: "Muscle Gain" },
  { value: "FAT_LOSS", label: "Fat Loss" },
  { value: "HEALTHY_LIFESTYLE", label: "Healthy Lifestyle" },
  { value: "PCOS", label: "PCOS" },
  { value: "DIABETES", label: "Diabetes" },
  { value: "THYROID", label: "Thyroid" },
] as const;

export const FOOD_PREFERENCES = [
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "EGGETARIAN", label: "Eggetarian" },
  { value: "NON_VEGETARIAN", label: "Non Vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "JAIN", label: "Jain" },
] as const;

export const STAPLE_FOODS = [
  "Roti",
  "Chapati",
  "Rice",
  "Brown Rice",
  "Bajra Roti",
  "Jowar Roti",
  "Ragi",
  "Oats",
  "Poha",
  "Upma",
  "Idli",
  "Dosa",
  "Uttapam",
  "Paratha",
] as const;

export const PROTEIN_SOURCES = [
  "Paneer",
  "Tofu",
  "Dal",
  "Rajma",
  "Chole",
  "Sprouts",
  "Eggs",
  "Chicken",
  "Fish",
] as const;

export const VEGETABLES = [
  "Spinach",
  "Potato",
  "Tomato",
  "Onion",
  "Bottle Gourd",
  "Pumpkin",
  "Carrot",
  "Beetroot",
  "Lady Finger",
] as const;

export const FRUITS = [
  "Banana",
  "Apple",
  "Papaya",
  "Mango",
  "Orange",
  "Guava",
  "Pomegranate",
] as const;

export const SNACKS = [
  "Roasted Chana",
  "Makhana",
  "Khakhra",
  "Peanuts",
  "Protein Shake",
] as const;

export const DRINKS = [
  "Tea",
  "Coffee",
  "Green Tea",
  "Coconut Water",
  "Lemon Water",
] as const;

export const EXERCISE_TYPES = [
  { value: "NONE", label: "None" },
  { value: "WALKING", label: "Walking" },
  { value: "RUNNING", label: "Running" },
  { value: "GYM", label: "Gym" },
  { value: "YOGA", label: "Yoga" },
  { value: "HOME_WORKOUT", label: "Home Workout" },
] as const;

export const WORK_TYPES = [
  { value: "STUDENT", label: "Student" },
  { value: "OFFICE", label: "Office" },
  { value: "WORK_FROM_HOME", label: "Work From Home" },
] as const;

export const MEDICAL_CONDITIONS = [
  "Diabetes",
  "PCOS",
  "Thyroid",
  "Blood Pressure",
  "Cholesterol",
  "None",
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  QUESTIONNAIRE_SUBMITTED: "Questionnaire Done",
  PAYMENT_PENDING: "Payment Pending",
  PAYMENT_VERIFIED: "Payment Verified",
  PAYMENT_REJECTED: "Payment Rejected",
  DIET_IN_PROGRESS: "Diet In Progress",
  DIET_PUBLISHED: "Diet Ready",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  QUESTIONNAIRE_SUBMITTED: "info",
  PAYMENT_PENDING: "warning",
  PAYMENT_VERIFIED: "success",
  PAYMENT_REJECTED: "error",
  DIET_IN_PROGRESS: "info",
  DIET_PUBLISHED: "success",
};

// UPI Payment Details — update these with your actual UPI credentials
export const UPI_ID = "revandrep@ybl"; // ← Replace with your UPI ID
export const UPI_AMOUNT = 19; // ₹19

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPin: "/forgot-pin",
  resetPin: "/reset-pin",
  dashboard: "/dashboard",
  questionnaire: "/questionnaire",
  payment: "/payment",
  admin: "/admin",
  adminOrders: "/admin/orders",
  adminUsers: "/admin/users",
  adminRevenue: "/admin/revenue",
} as const;
