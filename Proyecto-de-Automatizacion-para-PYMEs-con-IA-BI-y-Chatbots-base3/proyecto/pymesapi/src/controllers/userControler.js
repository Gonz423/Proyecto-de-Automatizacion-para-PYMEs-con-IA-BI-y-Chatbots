import { userService } from '../services/userService.js';

export const userController = {
  async login(req, res) {
    try {
      const result = await userService.loginUser(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message || 'Credenciales inválidas' });
    }
  },

  async getAllusers(req, res) {
    try {
      const users = await userService.getAllusers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios." });
    }
  },

  async getuserById(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await userService.getuserById(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async createuser(req, res) {
    try {
      const user = await userService.createuser(req.body);
      res.status(201).json(user);
    } catch (error) {
       // Si el servicio lanza el error de duplicado, lo enviamos como 409 (Conflicto)
      if (error.message.includes('duplicada')) {
        return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
      }
      res.status(500).json({ message: "Error al crear el usuario." });
    }
  },

  async updateuser(req, res) {
    try {
        const userId = parseInt(req.params.id, 10);
        const updatedUser = await userService.updateuser(userId, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
  },

  async deleteuser(req, res) {
    try {
        const userId = parseInt(req.params.id, 10);
        await userService.deleteuser(userId);
        res.status(204).send(); // 204 No Content es estándar para DELETE exitoso
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
  }
};
export default userController;