
import User from '../models/userModel.js';
import pool from '../Config/database.js';
import validator from 'validator';


class UserService {


    constructor() {
        this.userModel = new User(pool);
    }

    async getAllUsers() {
        try {
          // Busca todos os usuários do banco de dados
          const users = await this.userModel.findAllUsers();
          return users;
        } catch (error) {
          throw error;
        }
    }

    async getUser(id) {
        try {
          // Verifica se o usuário existe
          const existingUser = await this.userModel.findById(id);
          if (!existingUser) {
            throw new Error('Usuário não encontrado');
          }
          return existingUser;
        } catch (error) {
          throw error;
        }
      }


    async createUser(userData) {
        try {

          this.validateUserData(userData);

          // Verifica se o email já está cadastrado
          const existingUser = await this.userModel.findByEmail(userData.email);
          if (existingUser) {
            throw new Error('Email já cadastrado');
          }
    
          // Cria o novo usuário no banco de dados
          const newUser = await this.userModel.createUser(userData);
          return newUser;
        } catch (error) {
          throw error;
        }
    }


    async updateUser(id, userData) {
        try {
          console.log(id);
          console.log(userData);

          this.validateUserData(userData);

          // Verifica se o usuário existe
          const existingUser = await this.userModel.findById(id);
          if (!existingUser) {
            throw new Error('Usuário não encontrado');
          }
    
          // Atualiza o usuário no banco de dados
          const updatedUser = await this.userModel.updateUser(id, userData);
          return updatedUser;
        } catch (error) {
          throw error;
        }
    }

    async deleteUser(id) {
        try {
          // Verifica se o usuário existe
          const existingUser = await this.userModel.findById(id);
          if (!existingUser) {
            throw new Error('Usuário não encontrado');
          }
    
          const deletedUser = await this.userModel.deleteUser(id);
          return deletedUser;
        } catch (error) {
          throw error;
        }
    }

    async validateUserData(userData) {
        try {
            const { email, password, firstName, lastName, roleId } = userData;

        
            // Validação de email
            if (!validator.isEmail(email)) {
            throw new Error('Formato de email inválido');
            }
            if (email.length > 100) {
            throw new Error('Email deve ter no máximo 100 caracteres');
            }
            // Validação de password
            if (!validator.isLength(password, { min: 5, max: 20 })) {
                throw new Error('Senha deve ter entre 5 e 20 caracteres');
            }
            if (!/[A-Z]/.test(password)) {
                throw new Error('Senha deve conter pelo menos uma letra maiúscula');
            }
            if (!/[a-z]/.test(password)) {
                throw new Error('Senha deve conter pelo menos uma letra minúscula');
            }
            if (!/\d/.test(password)) {
                throw new Error('Senha deve conter pelo menos um número');
            }
            if (!/[@$!%*?&]/.test(password)) {
                throw new Error('Senha deve conter pelo menos um caractere especial');
            }

            // Validação de firstName e lastName
            if (!validator.isLength(firstName, { min: 3, max: 50 })) {
                throw new Error('Primeiro nome deve ter entre 3 e 50 caracteres');
            }
            if (!validator.isLength(lastName, { min: 3, max: 50 })) {
                throw new Error('Sobrenome deve ter entre 3 e 50 caracteres');
            }
            // Verifica se a role_id existe
            const roleExists = await this.checkRoleIdExists(roleId);
            if (!roleExists) {
                throw new Error('role_id não encontrado');
            }

        } catch (error) {
            throw error;
        }

      }
    
      async checkRoleIdExists(roleId) {
        try{
            const result = await pool.query('SELECT * FROM roles WHERE id = $1', [roleId]);
            return result.rows.length > 0;
        } catch (error) {
            throw error;
        }
      }

}

export default UserService;