import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "@/types/express";

const prisma = new PrismaClient();

/**
 * Create a new event
 */
export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      bannerURL,
      requiresPayment,
      amount,
      formFields,
      startsAt,
      endsAt,
    } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user ID." });
    }
    if (!title || !bannerURL) {
      return res
        .status(400)
        .json({ message: "Title and banner are required." });
    }

    const event = await prisma.event.create({
      data: {
        title,
        bannerURL,
        requiresPayment: !!requiresPayment,
        amount: requiresPayment ? Number(amount) : null,
        formFields,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        createdById: userId,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event." });
  }
};

/**
 * Get all events
 */
export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: { attendees: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: { attendees: true },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to fetch event." });
  }
};

/**
 * Update an event
 */
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      bannerURL,
      requiresPayment,
      amount,
      formFields,
      isClosed,
      startsAt,
      endsAt,
    } = req.body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        bannerURL,
        requiresPayment,
        amount: requiresPayment ? Number(amount) : null,
        formFields,
        isClosed,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    });

    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event." });
  }
};

/**
 * Delete an event (cascade deletes attendees, payments, tickets)
 */
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id },
    });

    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event." });
  }
};
