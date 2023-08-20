import categoryService from "../service/category-service.js";

export const createCategory = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await categoryService.createCategory(request);
    res.status(200).json({
      status: 200,
      message: "Create Category Successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const result = await categoryService.getCategory();
    res.status(200).json({
      status: 200,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await categoryService.getCategoryById(categoryId);
    res.status(200).json({
      status: 200,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updatedCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const request = req.body;
    const result = await categoryService.updateCategory(request, categoryId);
    res.status(200).json({
      status: 200,
      message: "Updated Successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deletedCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    await categoryService.deleted(categoryId);
    res.status(200).json({
      status: 200,
      message: "Deleted Success"
    });
  } catch (error) {
    next(error);
  }
};
