import { handlers } from "@/lib/auth";

// Force Node.js runtime for SQLite compatibility
export const runtime = 'nodejs';

export const { GET, POST } = handlers
