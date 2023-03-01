const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleSchemaValidationErrors } = require("../helpers");
const transactionsType = ["income", "expenses"];
const transactionsCategory = [
    "Transport",
    "Products",
    "Health",
    "Alcohol",
    "Entertainment",
    "Housing",
    "Technique",
    "Communal, communication",
    "Sports, hobbies",
    "Education",
    "Hobbies",
    "Other",
    "Salary",
    "Add.Income"
];

const transactionsSchema = Schema({
    transactionsType: {
        type: String,
        required: [true, 'Set transactions type'],
        enum: transactionsType,
    },
    date: {
        type: String,
        required: [true, 'Set transactions date'],
    },
    description: {
        type: String,
        default: "",
    },
    category: {
        type: String,
        required: [true, 'Set transactions category'],
        enum: transactionsCategory,
    },
    sum: {
        type: Number,
        required: [true, "Set transactions sum"],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, { versionKey: false, timestamps: true });

transactionsSchema.post("save", handleSchemaValidationErrors)

const transactionJoiSchemaPost = Joi.object({
    transactionsType: Joi.string()
        .valid(...transactionsType)
        .required(),
    date: Joi.string()
        .required(),
    category: Joi.string()
        .required(),
    sum: Joi.number()
        .required(),
    description: Joi.string()
        .required(),
});

const Transaction = model("transaction", transactionsSchema);

module.exports = {
    Transaction,
    transactionJoiSchemaPost,
};

