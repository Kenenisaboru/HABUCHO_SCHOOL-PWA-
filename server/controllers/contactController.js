/**
 * Contact Controller
 * ------------------
 * Public message submission; admin views messages.
 */
import * as ContactModel from "../models/contactModel.js";
import { sendSuccess, sendError, getPagination } from "../utils/response.js";

export const submitMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return sendError(res, "Name, email, and message are required");
    }

    const contactMessage = await ContactModel.createMessage({ name, email, message });

    return sendSuccess(res, contactMessage, "Message sent successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit);
    const { messages, total } = await ContactModel.getAllMessages(pagination);

    return sendSuccess(res, {
      messages,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactModel.deleteMessage(req.params.id);
    if (!message) return sendError(res, "Message not found", 404);
    return sendSuccess(res, null, "Message deleted");
  } catch (error) {
    next(error);
  }
};
