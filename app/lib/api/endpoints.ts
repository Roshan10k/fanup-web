
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
}
