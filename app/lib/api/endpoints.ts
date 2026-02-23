
export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/users/profile',
        PROFILE_STATS: '/api/users/profile/stats',
        UPDATEPROFILE: '/api/users/profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,

    },
    WALLET: {
        SUMMARY: '/api/wallet/summary',
        TRANSACTIONS: '/api/wallet/transactions',
        DAILY_BONUS: '/api/wallet/daily-bonus',
        CONTEST_JOIN: '/api/wallet/contest-join',
    },
    LEADERBOARD: {
        CONTESTS: '/api/leaderboard/contests',
        MY_ENTRIES: '/api/leaderboard/my-entries',
        CONTEST_BY_MATCH: (matchId: string) => `/api/leaderboard/contests/${matchId}`,
        SUBMIT_ENTRY: (matchId: string) => `/api/leaderboard/contests/${matchId}/entry`,
    },
    MATCHES: {
        LIST: '/api/matches',
        COMPLETE: (matchId: string) => `/api/matches/${matchId}/complete`,
    },
    ADMIN: {
        MATCHES: '/api/admin/matches',
        MATCH_LEADERBOARD: (matchId: string) => `/api/admin/matches/${matchId}/leaderboard`,
        LOCK_MATCH: (matchId: string) => `/api/admin/matches/${matchId}/lock`,
        COMPLETE_MATCH: (matchId: string) => `/api/admin/matches/${matchId}/complete`,
    },
}
