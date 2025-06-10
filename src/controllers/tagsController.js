const { where, Op } = require("sequelize");
const db = require("../models/index");
const { errorResponse, successResponse } = require("../utils/responseHelper");

class TagsController {
  getAll = async (req, res) => {
    try {
      const userId = req.user.id;

      const tags = await db.Tags.findAll({
        where: {
          userId: userId,
        },
      });

      return successResponse(res, tags, "Successfully found tags", 200);
    } catch (err) {
      console.error("Error occurred in /tagsController/getAll: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getSingle = async (req, res) => {
    try {
      const userId = req.user.id;
      const { tagId } = req.params;

      if (!tagId) {
        return errorResponse(res, "Missing tag ID", 400);
      }

      const singleTag = await db.Tags.findOne({
        where: {
          userId: userId,
          id: tagId,
        },
      });

      if (!singleTag) {
        return errorResponse(res, "Tag not found", 404);
      }

      return successResponse(res, singleTag, "Successfully found tag", 200);
    } catch (err) {
      console.error("Error occurred in /tagsController/getSingle: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  create = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, bgColor, textColor, borderColor } = req.body;

      if (!name) {
        return errorResponse(res, "Tag name is required", 400);
      }

      // Check if tag with same name exists for this user
      const existingTag = await db.Tags.findOne({
        where: {
          userId: userId,
          name: name,
        },
      });

      if (existingTag) {
        return errorResponse(res, "Tag with this name already exists", 400);
      }

      const newTag = await db.Tags.create({
        name: name,
        userId: userId,
        bgColor: bgColor || null,
        textColor: textColor || null,
        borderColor: borderColor || null,
      });

      return successResponse(res, newTag, "Successfully created new tag", 201);
    } catch (err) {
      console.error("Error occurred in /tagsController/create: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  update = async (req, res) => {
    try {
      const { tagId } = req.params;
      const userId = req.user.id;
      const { id, name, bgColor, textColor, borderColor } = req.body;

      if (!tagId) {
        return errorResponse(res, "Missing tag ID", 400);
      }

      const tag = await db.Tags.findOne({
        where: {
          id: tagId,
          userId: userId,
        },
      });

      if (!tag) {
        return errorResponse(res, "Tag not found", 404);
      }

      // If name is being updated, check for duplicates
      if (name && name !== tag.name) {
        const existingTag = await db.Tags.findOne({
          where: {
            userId: userId,
            name: name,
            id: { [Op.ne]: tagId }, // Not equal to current tag id
          },
        });

        if (existingTag) {
          return errorResponse(res, "Tag with this name already exists", 400);
        }
      }

      const updateData = {
        name: name,
        bgColor: bgColor,
        textColor: textColor,
        borderColor: borderColor
      };

      await tag.update(updateData);
      
      // Fetch the updated tag
      const updatedTag = await db.Tags.findOne({
        where: {
          id: tagId,
          userId: userId,
        },
      });

      return successResponse(res, updatedTag, "Successfully updated tag", 200);
    } catch (err) {
      console.error("Error occurred in /tagsController/update: ", err);
      return errorResponse(res, err.message || "Internal Server Error", 500);
    }
  };

  delete = async (req, res) => {
    try {
      const { tagId } = req.params;
      const userId = req.user.id;

      if (!tagId) {
        return errorResponse(res, "Missing tag ID", 400);
      }

      const tag = await db.Tags.findOne({
        where: {
          id: tagId,
          userId: userId,
        },
      });

      if (!tag) {
        return errorResponse(res, "Tag not found", 404);
      }

      await tag.destroy();

      return successResponse(res, null, "Successfully deleted tag", 200);
    } catch (err) {
      console.error("Error occurred in /tagsController/delete: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}

module.exports = new TagsController();