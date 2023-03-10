const { Schema, model, Types } = require('mongoose');

const date = require('moment');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: [280, 'Reaction must be less than 280 characters']
        },
        username: {
            type: String,

        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => date(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: [1, 'Thought must be at least 1 character long'],
            maxlength: [280, 'Thought must be less than 280 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => date(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
        },
        username: {
            type: String,


        },

        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

const Thought = model('Thought', ThoughtSchema);


module.exports = Thought;