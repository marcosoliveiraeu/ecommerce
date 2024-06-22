import jwt from 'jsonwebtoken';


function jwtTokens( user) {

  try{
    
    const currentUser = { id: user.id, email: user.email, role: user.role}; 
    const accessToken = jwt.sign(currentUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign(currentUser, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return ({ accessToken, refreshToken });

  }catch(error){

    console.log("jwt-helper.jwtTokens.erro : " + error);
    return (error);
    
  }

  
}

export {jwtTokens};