import bcrypt from 'bcrypt';

  class User 
  {

      constructor(pool) {
        this.pool = pool;
      }


      async findAllUsers() {
        try {
          const query = 'SELECT id, email, first_name, last_name, role_id FROM users';
          const { rows } = await this.pool.query(query);
          return rows;
        } catch (error) {
          console.log("aha")  
          console.error('Erro ao buscar todos os usuários:', error);
          throw new Error('Erro ao buscar todos os usuários: ' + error.message ); 
        }
      }


      async findByEmail(email) {
        try {
          const query = 'SELECT id, email, password, first_name, last_name, role_id FROM users WHERE email = $1';
          const values = [email];
          const { rows } = await this.pool.query(query, values);
          return rows[0];
        } catch (error) {
          console.error('Erro ao buscar usuário por email:', error);
          throw error; 
        }
      }
    
      async findById(id) {
        try {
            const query = 'SELECT id, email, first_name, last_name, role_id FROM users WHERE id = $1';
            const values = [id];
            const { rows } = await this.pool.query(query, values);
            return rows[0];
        }catch (error) {
            console.error('Erro ao buscar usuário por id:', error);
            throw error; 
        }
      }
    
      async createUser({ email, password, firstName, lastName, roleId }) {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const query = `
            INSERT INTO users (email, password, first_name, last_name, role_id, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING id, email, first_name, last_name, role_id, created_at, updated_at
          `;
          const values = [email, hashedPassword, firstName, lastName, roleId];
          const { rows } = await this.pool.query(query, values);
          return rows[0];
        } catch (error) {
          console.error('Erro ao criar novo usuário:', error);
          throw error; // Re-throw para propagar o erro para camadas superiores
        }
      }
    
      async updateUser(id, { email, password, firstName, lastName, role_id }) {
        try {
          const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
          const query = `
            UPDATE users
            SET email = COALESCE($2, email),
                password = COALESCE($3, password),
                first_name = COALESCE($4, first_name),
                last_name = COALESCE($5, last_name),
                role_id = COALESCE($6, role_id),
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, email, first_name, last_name, role_id, created_at, updated_at
          `;
          const values = [id, email, hashedPassword, firstName, lastName, role_id];
          const { rows } = await this.pool.query(query, values);
          return rows[0];
        } catch (error) {
          console.error('Erro ao atualizar usuário:', error);
          throw error; // Re-throw para propagar o erro para camadas superiores
        }
      }
    
      async deleteUser(id) {
        try {
          const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
          const values = [id];
          const { rows } = await this.pool.query(query, values);
          return rows[0];
        } catch (error) {
          console.error('Erro ao excluir usuário:', error);
          throw error; // Re-throw para propagar o erro para camadas superiores
        }
      }

  }
    
    export default User;