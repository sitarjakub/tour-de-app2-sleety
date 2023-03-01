import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    posts: {type: [{
        _id: {type: mongoose.Schema.Types.ObjectId, index: true, auto: true},
        date: {type: String, required: true},
        programmers: {type: [String], required: false},
        categories: {type: [String], required: false},
        "time-spent": {type: String, required: true},
        "programming-language": {type: String, required: true},
        rating: {type: Number, required: true},
        description: {type: String, required: true}
    }], required: true},
    categories: {type: [{
        _id: {type: mongoose.Schema.Types.ObjectId, index: true, auto: true},
        name: {type: String, required: true}
    }], required: true}
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;