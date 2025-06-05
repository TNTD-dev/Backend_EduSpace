const { where } = require("sequelize");
const db = require("../models/index");
const { errorResponse, successResponse } = require("../utils/responseHelper");
console.log(
  "DB object state when moduleResourcesControllers is required:",
  Object.keys(db)
);

class ModuleResourcesController {
  getAllDocumentations = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      if (!courseId || !moduleId) {
        return errorResponse(res, "Missing values", 400);
      }

      const resources = await db.Resources.findAll({
        where: {
          courseId: courseId,
          moduleId: moduleId,
        },
      });

      if (!resources || resources.length === 0) {
        return errorResponse(res, "No documentations found", 404);
      }

      return successResponse(
        res,
        resources,
        "Successfully found all documentations",
        200
      );
    } catch (err) {
      console.error("Error occured in getAllDocumentation: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getSingleDocumentation = async (req, res) => {
    try {
      const { courseId, moduleId, documentationId } = req.params;
      if (!courseId || !moduleId || !documentationId) {
        return errorResponse(res, "Missing values", 400);
      }

      const resource = await db.Resources.findOne({
        where: {
          courseId: courseId,
          moduleId: moduleId,
          id: documentationId,
        },
      });

      if (!resource) {
        return errorResponse(res, "Could not find documentation", 404);
      }

      return successResponse(
        res,
        resource,
        "Found documentation successfully",
        200
      );
    } catch (err) {
      console.error("Error occured in getSingleDocumentation: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  createNewDocumentation = async (req, res) => {
    try {
      const { moduleId, courseId } = req.params;
      const { title, description } = req.body;
      const file = req.file;

      if (!moduleId || !courseId || !title || !description) {
        return errorResponse(res, "Missing values", 400);
      }

      const now = new Date();

      const documentation = await db.Resources.create({
        moduleId: moduleId,
        courseId: courseId,
        title: title,
        description: description,
        fileURL: file ? file.path : null,
        fileName: file ? file.originalname : null,
        mimeType: file ? file.mimetype : null,
        fileSize: file ? file.size : null,
        uploadedAt: now,
      });

      return successResponse(
        res,
        documentation,
        "Successfull created new documentation",
        200
      );
    } catch (err) {
      console.error("Error occured in createNewDocumentation: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
  updateDocumentation = async (req, res) => {
    try {
      const { courseId, moduleId, documentationId } = req.params;
      const { title, description } = req.body;
      const file = req.file;

      if (!courseId || !moduleId || !documentationId) {
        return errorResponse(res, "Missing values", 400);
      }

      const updateDocumentation = await db.Resources.findOne({
        where: {
          courseId: courseId,
          moduleId: moduleId,
          id: documentationId,
        },
      });

      if (!updateDocumentation) {
        return errorResponse(res, "Could not find documentation", 404);
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (file) {
        if (file.originalname !== undefined)
          updateData.fileName = file.originalname;
        if (file.path !== undefined) updateData.fileURL = file.path;
        if (file.mimetype !== undefined) updateData.mimeType = file.mimetype;
        if (file.size !== undefined) updateData.fileSize = file.size;
      }
      const updateDate = new Date();

      await updateDocumentation.update(updateData);

      return successResponse(
        res,
        updateDocumentation,
        "Successfully updated documentation",
        200
      );
    } catch (err) {
      console.error("Error occured in updateDocumentation: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
  deleteDocumentation = async (req, res) => {
    try {
      const { courseId, moduleId, documentationId } = req.params;

      if (!courseId || !moduleId || !documentationId) {
        return errorResponse(res, "Missing values", 400);
      }

      // Tìm tài liệu cần xóa
      const documentation = await db.Resources.findOne({
        where: {
          courseId: courseId,
          moduleId: moduleId,
          id: documentationId,
        },
      });

      if (!documentation) {
        return errorResponse(res, "Could not find documentation", 404);
      }

      // Xóa tài liệu
      await documentation.destroy();

      return successResponse(
        res,
        documentation,
        "Successfully deleted documentation",
        200
      );
    } catch (err) {
      console.error("Error occured in deleteDocumentation: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}

module.exports = new ModuleResourcesController();
