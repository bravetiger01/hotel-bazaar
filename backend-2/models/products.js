const mongo = require("mongoose");
const User = require("./user");

const productSchema = new mongo.Schema(
    {
        name: String,
        description: String,
        price: Number,
        category: String,
        stock: Number,
        orderedBy: {
            type: [mongo.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        image: { type: String, default: "" }
    }
);

const Product = new mongo.model("product", productSchema);

module.exports = Product;