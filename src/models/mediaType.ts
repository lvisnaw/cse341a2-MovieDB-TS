import mongoose, { Schema, Document } from 'mongoose';

interface IMediaType extends Document {
    mediaType: string,
    description: string
};

const mediaTypeSchema = new Schema<IMediaType>({
    mediaType: {type: String, unique: true, required: true},
    description: {type: String}
});

const Media = mongoose.model<IMediaType>('MediaType', mediaTypeSchema);

export default Media;
export {IMediaType};