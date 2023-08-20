import userService from "../service/user-service.js";

const getAllUser = async (req, res, next) => {
  try {
    const request = {
      name: req.query.name,
      email: req.query.email
    };
    const result = await userService.getAllUser(request);
    res.status(200).json({
      message: "Success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.userId);
    res.status(200).json({
      message: "Success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await userService.createUser(request);
    res.status(200).json({
      message: "Create User Succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const request = req.body;
    const result = await userService.updateUser(request, userId);
    res.status(200).json({
      message: "Updated Succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    res.status(200).json({
      message: "Deleted Success"
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUser,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
