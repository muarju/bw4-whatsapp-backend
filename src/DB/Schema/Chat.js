import mongoose from "mongoose";

const { Schema, model } = mongoose

const chatSchema = new Schema(
    {
        members: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
        name: { type: String },
        history: [{ type: Schema.Types.ObjectId, ref: "Message", required: true }],
        image: { type: String }
    },
    { timestamps: true }
);

export default model('Chat', chatSchema)