import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "@/controllers/event.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { Router } from "express";

const eventrouter = Router();

eventrouter.post("/", isAuthenticated, createEvent); // Create event
eventrouter.get("/", isAuthenticated, getEvents); // List events
eventrouter.get("/:id", getEventById); // Get event details
eventrouter.put("/:id", isAuthenticated, updateEvent); // Update event
eventrouter.delete("/:id", isAuthenticated, deleteEvent); // Delete event

export default eventrouter;
