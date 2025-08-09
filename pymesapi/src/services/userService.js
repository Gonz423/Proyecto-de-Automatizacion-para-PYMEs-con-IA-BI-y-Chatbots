import userModel from '../models/userModel.js';

export const userService = {
    async getAllusers() {
        return userModel.getAll();
    },

    async getuserById(userId) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('user not found');
        }
        return user;
    },

    async createuser(newuser) {
        const { userId, title, description, date } = newuser;
        const sanitizeduser = {
            userId,
            title: title.trim(),
            description: description.trim(),
            date: new Date(date)
        };
        const createduser = await userModel.create(sanitizeduser);
        return { createduser };
    },

    async updateuser(userId, newValues) {
        return {};
    },

    async deleteuser(userId) {
        return {message: 'Te fuiste borrado pa'}
    }
}

export default userService;