var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        unique: true

    },
    link:{
        type: String,
        required: true,
        trim: true,

    },
    description: {
        type: String,
        
    },
    date: {
        type: String
    },
    comments: [
		{
			// Store ObjectIds in the array
			type: Schema.Types.ObjectId,
			// The ObjectIds will refer to the ids in the Note model
			ref: "Comment"
		}
	]

});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
