export const testSeeder = {
    createUserDto() {
        return {
            login: 'test',
            password: '12345678',
            email: 'test@gmail.com'
        }
    },

    async mockSendMail(email: string, login: string, subject: string, code: string): Promise<boolean> {
        return true;
    },

    getRefreshToken(cookies: string) {
        let refreshToken;
        for (const cookie of cookies) {
            if (cookie.startsWith('refreshToken')) {
                const refreshTokenMatch = /refreshToken=(\w+)/.exec(cookie);
                if (refreshTokenMatch) {
                    refreshToken = refreshTokenMatch[1];
                    break;
                }
            }
        }
        return refreshToken;
    }
}


