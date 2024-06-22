import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User  from '../models/userModel.js';
import pool from '../Config/database.js';
import { jwtTokens } from '../utils/jwt-helper.js';

class AuthService {

    constructor() {
        this.userModel = new User(pool);
    }

    async login(email,password){

        try {
            
            const user = await this.userModel.findByEmail(email);
            
            if (!user) {
              throw new Error('Email ou senha inválidos.');
            }
            
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
              throw new Error('Email ou senha inválidos.');
            }
            
      
            const tokens = jwtTokens(user);
            return tokens;

          } catch (error) {
            throw new Error(error.message);
          }

    }

    async refreshToken(req,res){

        try {
            if (!refreshToken) {
                throw new Error('Token de refresh não fornecido.');
            }

            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const tokens = jwtTokens(user);
            return tokens;

        } 
        catch (error) {
            throw new Error(error.message);
        }

    }

}

export default AuthService;