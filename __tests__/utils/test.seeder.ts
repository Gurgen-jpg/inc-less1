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
    }
}
