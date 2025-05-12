// types/next-auth.d.ts
import { JWT } from 'next-auth/jwt';

declare module 'next/server' {
  interface NextRequest {
    user?: JWT; // 或根据你的 JWT 数据结构自定义类型
  }
}
