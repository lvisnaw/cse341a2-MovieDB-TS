// import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';
import Media, {IMediaType} from "../models/mediaType";


/**
 * Get all media types
 */

export const getAllMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const media: IMediaType[] = await Media.find();
        res.json(media);
    } catch (err) {
        next(err);
      }
};

/**
 * Add a new media type
 */

export const addMediaType = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { mediaType, description } = req.body;
        
        // Validate inputs
        if (!mediaType) {
            return res.status(400).json({ error: "mediaType is required" });
        }

        const existingMediaType = await Media.findOne({ mediaType });//checks if already that name exists 
        if (existingMediaType) {
            return res.status(400).json({ error: `Media type "${mediaType}" already exists` });
        }

        const newMediaType = new Media({ mediaType, description });
        const savedMediaType = await newMediaType.save();
        res.status(201).json(savedMediaType);
    } catch (err) {
        console.error("Error adding media type:", err);
        next(err);
    }
};

/**
 * Update a media type by ID
 */
export const updateMediaType = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { mediaType, description } = req.body;
        const updatedMediaType = await Media.findByIdAndUpdate(
            req.params.id,
            { mediaType, description },
            { new: true }
        );

        if (!updatedMediaType) {
            return res.status(404).json({error: 'Media type not found'})
        }
        res.json(updatedMediaType);
    } catch (err) {
        console.error("Error updating media type:", err);
        next(err);
    }
};

/**
 * Delete a media type by ID
 */

export const deleteMediaType = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const deletedMediaType = await Media.findByIdAndDelete(req.params.id);

        if (!deletedMediaType) {
            return res.status(404).json({error: 'Media type not found'})
        }

        return res.status(200).json({ message: 'Media type deleted successfully' });
    } catch (err) {
        console.error("Error deleting media type:", err);
        next(err);
    }
};