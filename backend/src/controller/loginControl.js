const loginModel = require('../model/loginModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function compararUsuarioyClave(req, res) {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({ error: 'Falta el usuario y clave' });
  }

  try {
    const user = await loginModel.getUsuarioPorNombre(usuario);

    if (!user) {
      return res.status(401).json({ error: 'Datos incorrectos' });
    }

    const isPasswordCorrect = await bcrypt.compare(clave, user.clave);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Datos incorrectos' });
    }

    const { clave: userPassword, ...userSinClave } = user;

    const token = jwt.sign(
      { id: userSinClave.id_vendedor, usuario: userSinClave.usuario },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      user: userSinClave,
      token: token
    });
  } catch (error) {
    console.error('Error en la solicitud de login ', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { compararUsuarioyClave };