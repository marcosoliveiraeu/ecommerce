import UserService from '../Services/userService.js';

const userService = new UserService();

class UserController {

  async createNewUser(req, res) {
    try {
      const { email, password, firstName, lastName, roleId } = req.body;
      const newUser = await userService.createUser({ email, password, firstName, lastName, roleId });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: error.message ||'Erro interno ao criar usuário' });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await userService.updateUser(id, userData);
      res.json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: error.message ||'Erro interno ao atualizar usuário' });
    }
  }



  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUser(id);
      res.json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: error.message ||'Erro interno ao buscar usuário' });
    }
  }

  async listUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: error.message ||'Erro interno ao buscar usuários' });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const deletedUser = await userService.deleteUser(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Erro ao deletar usuário' });
    }
  }


}

export default UserController;


