import authService from "../service/auth-service.js";

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req);
    res.status(200).json({
      status: 200,
      message: "Login Successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const result = await authService.me(req);
    res.status(200).json({
      status: 200,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req);
    res.status(200).json({
      status: 200,
      message: "Logout Success"
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  logout,
  me
};
