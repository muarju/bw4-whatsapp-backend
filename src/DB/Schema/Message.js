import mongoose from "mongoose";

const { Schema, model } = mongoose

const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        content: {
            text: { type: String },
            media: { type: String }
        }
    },
    { timestamps: true }
);

export default model('Message', messageSchema)