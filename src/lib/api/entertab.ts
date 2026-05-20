import { apiRequest } from "@/lib/api/client";

/** Types aligned with `/api-docs.json` (Mongo `_id`). */

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin";
  password?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  status?: "pending" | "reviewed" | "resolved";
  createdAt?: string;
  updatedAt?: string;
};

export type ServiceRequestItem = {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  message: string;
  serviceType: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectInquiryItem = {
  _id: string;
  email: string;
  name: string;
  requiredService: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JourneyApplication = {
  _id: string;
  email: string;
  name: string;
  positionOrSpecialisation: string;
  yearsOfExperience: number;
  typeOfEmployment: string;
  cvUpload?: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ListResponse<T> = { success: boolean; count: number; data: T[] };
export type SingleResponse<T> = { success: boolean; data: T };
export type LoginResponse = { success: boolean; token: string; user: User };
export type OkResponse = { success: boolean; data?: Record<string, never> };

export const SERVICE_TYPES = [
  "AI Edge – AI-Powered Automation & Intelligence",
  "Digital Transformation Hub",
  "Mobile App Development",
  "Website Development",
  "Brand Building",
  "UI/UX Design",
  "Digital Marketing",
  "Marketing Content Writing",
  "Social Media Management"
] as const;

export const PROJECT_SERVICES = [
  "AI Edge – AI-Powered Automation & Intelligence",
  "Digital Transformation Hub",
  "Website Development",
  "Mobile App Development",
  "Brand Building",
  "Contact Center Solutions",
  "UI/UX Design",
  "Digital Marketing",
  "Marketing Content Writing",
  "Social Media Management"
] as const;

export async function loginAdmin(email: string, password: string) {
  return apiRequest<LoginResponse>("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export async function fetchUsers(token: string) {
  const res = await apiRequest<ListResponse<User>>("/api/users", { token });
  return res.data ?? [];
}

export async function fetchUser(token: string, id: string) {
  const res = await apiRequest<SingleResponse<User>>(`/api/users/${id}`, { token });
  return res.data;
}

export async function createUser(
  token: string,
  body: { name: string; email: string; password: string; role: "admin" }
) {
  return apiRequest<SingleResponse<User>>("/api/users", {
    method: "POST",
    token,
    body: JSON.stringify(body)
  });
}

export async function updateUser(token: string, id: string, body: { name?: string; email?: string }) {
  return apiRequest<SingleResponse<User>>(`/api/users/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body)
  });
}

export async function deleteUser(token: string, id: string) {
  return apiRequest<OkResponse>(`/api/users/${id}`, {
    method: "DELETE",
    token
  });
}

export async function fetchContactMessages(token: string) {
  const res = await apiRequest<ListResponse<ContactMessage>>("/api/contact-us", { token });
  return res.data ?? [];
}

export async function fetchContactMessage(token: string, id: string) {
  const res = await apiRequest<SingleResponse<ContactMessage>>(`/api/contact-us/${id}`, { token });
  return res.data;
}

export async function updateContactStatus(token: string, id: string, status: ContactMessage["status"]) {
  return apiRequest<SingleResponse<ContactMessage>>(`/api/contact-us/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ status })
  });
}

export async function deleteContactMessage(token: string, id: string) {
  return apiRequest<OkResponse>(`/api/contact-us/${id}`, {
    method: "DELETE",
    token
  });
}

export async function fetchServiceRequests(token: string) {
  const res = await apiRequest<ListResponse<ServiceRequestItem>>("/api/services", { token });
  return res.data ?? [];
}

export async function fetchServiceRequest(token: string, id: string) {
  const res = await apiRequest<SingleResponse<ServiceRequestItem>>(`/api/services/${id}`, { token });
  return res.data;
}

export async function updateServiceRequest(token: string, id: string, body: { name?: string; message?: string }) {
  return apiRequest<SingleResponse<ServiceRequestItem>>(`/api/services/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body)
  });
}

export async function deleteServiceRequest(token: string, id: string) {
  return apiRequest<OkResponse>(`/api/services/${id}`, {
    method: "DELETE",
    token
  });
}

export async function fetchProjectInquiries(token: string) {
  const res = await apiRequest<ListResponse<ProjectInquiryItem>>("/api/projects", { token });
  return res.data ?? [];
}

export async function fetchProjectInquiry(token: string, id: string) {
  const res = await apiRequest<SingleResponse<ProjectInquiryItem>>(`/api/projects/${id}`, { token });
  return res.data;
}

export async function updateProjectInquiry(token: string, id: string, body: { name?: string; requiredService?: string }) {
  return apiRequest<SingleResponse<ProjectInquiryItem>>(`/api/projects/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body)
  });
}

export async function deleteProjectInquiry(token: string, id: string) {
  return apiRequest<OkResponse>(`/api/projects/${id}`, {
    method: "DELETE",
    token
  });
}

export async function fetchJourneys(token: string) {
  const res = await apiRequest<ListResponse<JourneyApplication>>("/api/journeys", { token });
  return res.data ?? [];
}

export async function fetchJourney(token: string, id: string) {
  const res = await apiRequest<SingleResponse<JourneyApplication>>(`/api/journeys/${id}`, { token });
  return res.data;
}

export async function updateJourney(token: string, id: string, form: FormData) {
  return apiRequest<SingleResponse<JourneyApplication>>(`/api/journeys/${id}`, {
    method: "PUT",
    token,
    body: form
  });
}

export async function deleteJourney(token: string, id: string) {
  return apiRequest<OkResponse>(`/api/journeys/${id}`, {
    method: "DELETE",
    token
  });
}
