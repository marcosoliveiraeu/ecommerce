
import AuthService from '../Services/authService.js';
import pool from '../Config/database.js';

class AuthController{

  constructor() {
    this.authService = new AuthService(pool);
  }


  async login(req, res) {
    try {

      const { email, password } = req.body;

      const tokens = await this.authService.login(email, password);

      res.cookie('refresh_token', tokens.refreshToken, {
        ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      
      res.json({login: true , ...tokens});
      
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(401).json({ error: error.message || 'Erro interno ao fazer login' } );
    }
  }


  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;
      const tokens = await this.authService.refreshToken(refreshToken);
      
      res.cookie('refresh_token', tokens.refreshToken, {
        ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
        httpOnly: true,
        sameSite: 'none',
        secure: true
      });
      
      res.json(tokens);     

      
    } catch (error) {
      console.error('Erro em refresh token:', error);
      res.status(403).json({ error: error.message ||'Erro interno em refresh token' });
    }
  }

  async clearToken(req, res) {
    try {      
      res.clearCookie('refresh_token');
      res.status(200).json("Refresh token apagado");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


}

export default AuthController;




/*



export const login = async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }


    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }


     //JWT
     let tokens = jwtTokens(user);//Gets access and refresh tokens
     
     res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
     
     res.json(tokens);

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
};

export const refreshToken = async (req, res) => {

    try {
        const refreshToken = req.cookies.refresh_token;
        
        if (refreshToken === null) return res.sendStatus(401);
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {

          if (error) return res.status(403).json({error:error.message});
          
          let tokens = jwtTokens(user);
          res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
          
          return res.json(tokens);

        });
      
    } catch (error) {
        res.status(500).json({error: error.message});
    }

}

export const clearToken = async (req, res) => {

    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({message:'Refresh token apagado.'});
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

*/