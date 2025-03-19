// resources/js/types/auth.d.ts (or wherever you keep shared types)
export interface User {
    id: number
    name: string
    email: string
  }

  export interface AuthProps {
    user?: User | null
  }
