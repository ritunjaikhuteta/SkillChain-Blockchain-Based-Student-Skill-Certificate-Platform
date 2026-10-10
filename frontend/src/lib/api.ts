export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  role: "STUDENT" | "RECRUITER" | "ADMIN";
  enabled: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  fullName: string;
  email: string;
  role: "STUDENT" | "RECRUITER" | "ADMIN";
}

export interface SkillItem {
  id: number;
  name: string;
  category: string;
  proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  yearsOfExperience: number;
  createdAt: string;
}

export interface SkillSuggestion {
  name: string;
  category: string;
  description?: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  techStack?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  featured: boolean;
  createdAt: string;
}

export interface CertificateItem {
  id: number;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  blockchainHash?: string;
  fingerprint?: string;
  verified?: boolean;
  isRevoked?: boolean;
  revocationReason?: string;
  revokedAt?: string;
  fileName?: string;
  fileHash?: string;
  fileSize?: number;
  contentType?: string;
  storageProvider?: string;
  isSystemCredentialId?: boolean;
  hasDocument?: boolean;
  fileUrl?: string;
  createdAt: string;
}

export interface StudentProfileData {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  role: string;
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  institution?: string;
  degree?: string;
  graduationYear?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  skills: SkillItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentStats {
  skillsCount: number;
  projectsCount: number;
  certificatesCount: number;
  profileCompletionPercentage: number;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalRecruiters: number;
  totalAdmins: number;
  totalSkills: number;
  totalProjects: number;
  totalCertificates: number;
}

export interface CandidateRankDto {
  studentId: number;
  profileId: number;
  studentName: string;
  email: string;
  headline?: string;
  compositeScore: number;
  skillCoverageScore: number;
  proficiencyDepthScore: number;
  projectRelevanceScore: number;
  blockchainVerifiedScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  verifiedCertificatesCount: number;
  totalProjectsCount: number;
  explanation: string;
}

export interface BlockchainStatusDto {
  totalBlocks: number;
  latestBlockHash: string;
  latestBlockIndex: number | null;
  chainValid: boolean;
  totalRevokedCertificates: number;
  latestBlockTimestamp: string | null;
  ledgerType: string;
  disclaimer: string;
}

export interface ChainValidationResultDto {
  chainValid: boolean;
  totalBlocksAudited: number;
  corruptedBlockCount: number;
  errorMessages: string[];
  corruptedBlockIndices: number[];
}

export interface CertificateVerificationDto {
  verified: boolean;
  status: "VERIFIED" | "REVOKED" | "NOT_FOUND" | "TAMPERED" | string;
  message: string;
  blockIndex?: number | null;
  blockHash?: string | null;
  previousBlockHash?: string | null;
  credentialId?: string | null;
  certificateTitle?: string | null;
  issuingOrganization?: string | null;
  certificateFingerprint?: string | null;
  issuedOrAnchoredAt?: string | null;
  revoked: boolean;
  revocationReason?: string | null;
  revokedAt?: string | null;
  // File and verification dimensions
  hasDocument?: boolean;
  fileName?: string | null;
  fileHash?: string | null;
  fileSize?: number | null;
  contentType?: string | null;
  fileIntegrityVerified?: boolean;
  recordExists?: boolean;
  ledgerAnchored?: boolean;
  issuerDirectlyAuthenticated?: boolean;
  isSystemCredentialId?: boolean;
  verificationNotice?: string | null;
}

export interface SkillRecommendationDto {
  skillName: string;
  category: string;
  relevanceScore: number;
  reason: string;
  learningPath: string[];
  learningDistance: number;
}

export interface ShortestPathDto {
  sourceSkill: string;
  targetSkill: string;
  pathFound: boolean;
  totalDistance: number;
  pathNodes: string[];
  stepExplanations: string[];
}

export interface BlockchainBlock {
  id: number;
  blockIndex: number;
  previousHash: string;
  hash: string;
  certificateId?: number;
  credentialId?: string;
  certificateFingerprint?: string;
  certificateTitle?: string;
  issuingOrganization?: string;
  studentEmail?: string;
  issuerEmail?: string;
  revoked: boolean;
  revocationReason?: string;
  revokedAt?: string;
  revokedBy?: string;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  validationErrors?: Record<string, string>;

  constructor(status: number, message: string, validationErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.validationErrors = validationErrors;
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("skillchain_token") : null;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 204) {
      return {} as T;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const validationMsg = data?.validationErrors
        ? Object.values(data.validationErrors).join(", ")
        : null;
      const message = validationMsg || data?.message || `Request failed with status ${res.status}`;
      throw new ApiError(res.status, message, data?.validationErrors);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, err.message || "Network connection failed");
  }
}
