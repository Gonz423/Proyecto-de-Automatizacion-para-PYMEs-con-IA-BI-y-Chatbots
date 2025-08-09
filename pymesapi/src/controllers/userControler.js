import { userService } from '../services/userService.js';

export const userController = {
    async getAllusers(req, res) {
        try {
            const users = await userService.getAllusers();
            res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async getuserById(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const user = await userService.getuserById(userId);
            res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async createuser(req, res) {
        try {
            // El servicio devuelve un objeto { createduser }, por lo que lo desestructuramos
            const { createduser } = await userService.createuser(req.body);
            console.log("Body recibido:", req.body);
            res.status(201).json(createduser);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async updateuser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const updateduser = await userService.updateuser(userId, req.body);
            res.status(200).json(updateduser);
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async deleteuser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            await userService.deleteuser(userId);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
}

export default userController;