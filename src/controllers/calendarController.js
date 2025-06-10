const { where } = require("sequelize");
const db = require("../models/index");
const { errorResponse, successResponse } = require("../utils/responseHelper");

class CalendarController {
  getAll = async (req, res) => {
    try {
      const  userId  = req.user.id;
      if (!userId ) {
        return errorResponse(res, "Missing values", 400);
      }
      const allEvents = await db.Calendar.findAll({
        where: {
          userId: userId,
        },
        include: [{
          model: db.Tags,
          as: 'tag'
        }],
        attributes: {
          include: ['tagId']
        }
      });

      if (!allEvents || allEvents.length === 0) {
        return errorResponse(res, "No events found", 404);
      }

      return successResponse(
        res,
        allEvents,
        "Successfully found all events",
        200
      );
    } catch (err) {
      console.error("Error occured in getAll: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  getSingle = async (req, res) => {
    try {
      const userId = req.user.id;
      const { eventId } = req.params;
      if (!userId || !eventId) {
        return errorResponse(res, "Missing values", 400);
      }

      const event = await db.Calendar.findOne({
        where: {
          id: eventId,
          userId: userId,
        },
        include: [{
          model: db.Tags,
          as: 'tag'
        }],
        attributes: {
          include: ['tagId']
        }
      });

      if (!event) {
        return errorResponse(res, "Could not find event", 400);
      }

      return successResponse(res, event, "Successfully found event", 200);
    } catch (err) {
      console.error("Error occured in getSingle: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  createNew = async (req, res) => {
    try {
      const userId = req.user.id;
      const { title, description, startTime, endTime, tagId, courseId } =
        req.body;

      if (!userId || !startTime || !endTime) {
        return errorResponse(res, "Missing mandatory values", 400);
      }

      const end = new Date(endTime);
      const start = new Date(startTime);

      if (isNaN(end) || isNaN(start)) {
        return errorResponse(res, "Invalid date format", 400);
      }

      if (end < start) {
        return errorResponse(res, "Invalid end time", 400);
      }

      // Verify tagId exists if provided
      if (tagId !== undefined) {
        const tag = await db.Tags.findOne({
          where: {
            id: tagId,
            userId: userId
          }
        });
        if (!tag) {
          return errorResponse(res, "Tag not found", 404);
        }
      }

      const newData = {};
      if (title !== undefined) newData.title = title;
      if (description !== undefined) newData.description = description;
      if (tagId !== undefined) newData.tagId = tagId;
      if (courseId !== undefined) newData.courseId = courseId;
      newData.userId = userId;
      newData.startTime = start;
      newData.endTime = end;

      const newEvent = await db.Calendar.create(newData);
      
      // Fetch the created event with its tag
      const createdEvent = await db.Calendar.findOne({
        where: { id: newEvent.id },
        include: [{
          model: db.Tags,
          as: 'tag'
        }],
        attributes: {
          include: ['tagId']
        }
      });

      return successResponse(
        res,
        createdEvent,
        "Successfully created new event",
        201
      );
    } catch (err) {
      console.error("Error occured in createNew: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  update = async (req, res) => {
    try {
      const userId = req.user.id;
      const { eventId } = req.params;
      const { title, description, startTime, endTime, tagId } = req.body;
      if (!userId || !eventId) {
        return errorResponse(res, "Missing values", 400);
      }

      let start, end;
      if (startTime !== undefined) {
        start = new Date(startTime);
        if (isNaN(start)) {
          return errorResponse(res, "Invalid startTime format", 400);
        }
      }
      if (endTime !== undefined) {
        end = new Date(endTime);
        if (isNaN(end)) {
          return errorResponse(res, "Invalid endTime format", 400);
        }
      }
      if (start && end && end < start) {
        return errorResponse(res, "endTime must be after startTime", 400);
      }

      // Verify tagId exists if provided
      if (tagId !== undefined) {
        const tag = await db.Tags.findOne({
          where: {
            id: tagId,
            userId: userId
          }
        });
        if (!tag) {
          return errorResponse(res, "Tag not found", 404);
        }
      }

      const updateEvent = await db.Calendar.findOne({
        where: {
          userId: userId,
          id: eventId,
        },
      });

      if (!updateEvent) {
        return errorResponse(res, "Could not find any event", 404);
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (start !== undefined) updateData.startTime = start;
      if (end !== undefined) updateData.endTime = end;
      if (description !== undefined) updateData.description = description;
      if (tagId !== undefined) updateData.tagId = tagId;

      await updateEvent.update(updateData);

      // Fetch the updated event with its tag
      const updatedEvent = await db.Calendar.findOne({
        where: { id: eventId },
        include: [{
          model: db.Tags,
          as: 'tag'
        }],
        attributes: {
          include: ['tagId']
        }
      });

      return successResponse(
        res,
        updatedEvent,
        "Successfully updated event",
        200
      );
    } catch (err) {
      console.error("Error occured in update: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };

  delete = async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;

      if (!userId || !eventId) {
        return errorResponse(res, "Missing values", 400);
      }

      const event = await db.Calendar.findOne({
        where: {
          id: eventId,
          userId: userId,
        },
      });

      if (!event) {
        return errorResponse(res, "Could not find any event", 404);
      }

      await event.destroy();
      return successResponse(res, null, "Successfully deleted event", 200);
    } catch (err) {
      console.error("Error occured in delete: ", err);
      return errorResponse(res, "Internal Server Error", 500);
    }
  };
}

module.exports = new CalendarController();
