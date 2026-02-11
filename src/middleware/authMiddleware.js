const GetUserByToken = require("../core/use-cases/user/GetUserByToken");
const SequelizeUserRepository = require("../infrastructure/repositories/SequelizeUserRepository");

const userRepo = new SequelizeUserRepository();
const getUserByToken = new GetUserByToken(userRepo);

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const parts = authHeader.split(" ");
  let token;

  if (parts.length === 2 && parts[0] === "Bearer") {
    token = parts[1];
  } else {
    token = parts[0];
  }

  if (!token) {
    return res.status(401).json({ error: "Token inválido ou mal formatado." });
  }

  try {
    const user = await getUserByToken.execute(token);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado ou token expirado." });
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Falha na autenticação: " + error.message });
  }
};

module.exports = authMiddleware;
