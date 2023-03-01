const PORT = 5000;

require('dotenv').config()
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
const json2csv =  require('csvjson-json2csv');

import User from "./models/User";

const app = express();
app.use(cors())
app.use(express.json());
mongoose.set('strictQuery', false);

/////////////////////
////////////////Users
/////////////////////

//creates user
app.post("/users", async (req:Request, res:Response) => {
    if(req.body.firstName && req.body.lastName && req.body.username && req.body.password && req.body.email){
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        const response = await newUser.save();
        res.json(response);
    }else{
        res.statusCode = 400;
        res.json({
            error: "Send all informations"
        })
    }
})

//deletes user
app.delete("/users/:user_id", async (req: Request, res:Response) => {
    const response = User.findByIdAndDelete(req.params.user_id);
    res.json(response);
})

//updates user
app.put("/users/:user_id", async (req: Request, res:Response) => {
    if(req.body.firstName || req.body.lastName || req.body.username || req.body.password || req.body.email){
        const response = await User.findByIdAndUpdate(req.params.user_id, {
            ...(req.body.firstName) && {firstName: req.body.firstName},
            ...(req.body.lastName) && {lastName: req.body.lastName},
            ...(req.body.username) && {username: req.body.username},
            ...(req.body.password) && {password: req.body.password},
            ...(req.body.email) && {email: req.body.email}
        });
        res.json(response);
    }else{
        res.statusCode = 400;
        res.json({error: "Send all information"})
    }
})

app.get("/users/:user_id", async (req: Request, res:Response) => {
    const response = await User.findById(req.params.user_id);
    res.json(response);
})

//returns all users
app.get("/users", async (req:Request, res:Response) => {
    const response = await User.find();
    res.json(response);
})

//login
app.post("/login", async (req:Request, res:Response) => {
    if(req.body.username && req.body.password){
        const user = await User.findOne({username: req.body.username});
        if(!user || user.password !== req.body.password){
            res.statusCode = 401;
            res.json({
                error: "Wrong credentials"
            })
        }else if(user.password === req.body.password){
            if(req.body.username === "admin"){
                res.json({
                    key: user._id,
                    adminkey: user._id
                })
            }else{
                res.json({
                    key: user._id
                })
            }
        }
    }
})
/////////////////////
////////////////Posts
/////////////////////

//creates post
app.post("/users/:user_id/records", async (req:Request, res:Response) => {
    if(!req.body.date || !req.body.timeSpent || !req.body.programmingLanguage || !req.body.rating || !req.body.description){
        res.statusCode = 400;
        res.json({
            error: "All data required"
        })
    }else{
        if(req.body.rating > 5 || req.body.rating < 0){
            res.statusCode = 400;
            res.json({error: "Rating has to be between 0 and 5"})
        }
        const user = await User.findById(req.params.user_id);
        if(user){
            const newPosts = user.posts;
            newPosts.push({
                date: req.body.date,
                ...(req.body.programmers) && {programmers: req.body.programmers},
                "time-spent": req.body.timeSpent,
                "programming-language": req.body.programmingLanguage,
                rating: req.body.rating,
                description: req.body.description
            });

            const response = await User.findByIdAndUpdate(user._id, {posts: newPosts})
            res.json(response);
        }else{
            res.statusCode = 404;
            res.json({
                error: "User not found"
            })
        }
    }
})

//returns all posts
app.get("/users/:user_id/records", async (req:Request, res:Response) => {
    const user = await User.findById(req.params.user_id);
    if(user){
        res.json(user.posts);
    }else{
        res.statusCode = 404;
        res.json({
            error: "User not found"
        })
    }
})

//returns specific post
app.get("/users/:user_id/records/:record_id", async (req:Request, res:Response) => {
    const user = await User.findById(req.params.user_id);
    if(user){
        const posts = user.posts;
        const post = posts.filter(x => x._id?.toString() === req.params.record_id)[0];
        res.json(post);
    }else{
        res.statusCode = 404;
        res.json({
            error: "User not found"
        })
    }
})

//returns csv posts
app.get("/users/:user_id/export", async (req:Request, res:Response) => {
    const user = await User.findById(req.params.user_id);
    if(user){
        const posts = user.posts;
        const csv = json2csv(posts)
        if(!csv){
            res.statusCode = 500;
            res.json({error: "Chyba serveru"})
        }
        res.attachment('posts.csv').send(csv);
    }else{
        res.statusCode = 404;
        res.json({
            error: "User not found"
        })
    }
})

//deletes post
app.delete("/users/:user_id/records/:record_id", async (req:Request, res:Response) => {
    const user = await User.findById(req.params.user_id);
    if(!user){
        res.statusCode = 404;
        res.json({error: "User not found"});
    }else{
        let newPosts = user.posts;
        newPosts = newPosts.filter(x => x._id?.toString() !== req.params.record_id);
        const response = await User.findByIdAndUpdate(user._id, {posts: newPosts})
        res.json(response);
    }
})

//updates post
app.put("/users/:user_id/records/:record_id", async (req:Request, res:Response) => {
    if(req.body.date && req.body["time-spent"] && req.body["programming-language"] && req.body.rating && req.body.description){
        const user = await User.findById(req.params.user_id);
        if(!user){
            res.statusCode = 404;
            res.json({error: "User not found"});
        }else{
            let newPosts = user.posts;
            
            const postId = newPosts.find(x => x._id?.toString() === req.params.record_id)?._id;
            newPosts = newPosts.filter(x => x._id?.toString() !== req.params.record_id);
            newPosts.push({
                _id: postId,
                date: req.body.date,
                ...(req.body.programmers) && {programmers:req.body.programmers},
                ...(req.body.categories) && {categories:req.body.categories},
                "time-spent": req.body["time-spent"],
                "programming-language": req.body["programming-language"],
                rating: req.body.rating,
                description: req.body.description
            });

            const response = await User.findByIdAndUpdate(user._id, {posts: newPosts})
            res.json(response);
        }
    }else{
        res.statusCode = 400;
        res.json({
            error: "All data required"
        })
    }
})
/////////////////////
///////////Categories
/////////////////////

//creates category
app.post("/users/:user_id/categories", async (req:Request, res:Response) => {
    if(!req.body.name){
        res.statusCode = 400;
        res.json({
            error: "Name required"
        })
    }else{
        const user = await User.findById(req.params.user_id);
        if(user){
            const newCategories = user.categories;
            newCategories.push({
                name: req.body.name
            });

            const response = await User.findByIdAndUpdate(user._id, {categories: newCategories})
            res.json(response);
        }else{
            res.statusCode = 404;
            res.json({
                error: "User not found"
            })
        }
    }
})

//returns all categories
app.get("/users/:user_id/categories", async (req:Request, res:Response) => {
    const user = await User.findById(req.params.user_id);
    if(user){
        res.json(user.categories);
    }else{
        res.statusCode = 404;
        res.json({
            error: "User not found"
        })
    }
})

//deletes category
app.delete("/users/:user_id/categories/:category_id", async (req:Request, res:Response) => {
    const user = await User.findById(req.params.user_id);
    if(!user){
        res.statusCode = 404;
        res.json({error: "User not found"});
    }else{
        let newCategories = user.categories;
        newCategories = newCategories.filter(x => x._id?.toString() !== req.params.category_id);
        const response = await User.findByIdAndUpdate(user._id, {categories: newCategories})
        res.json(response);
    }
})

//updates category
app.put("/users/:user_id/categories/:category_id", async (req:Request, res:Response) => {
    if(!req.body.name){
        res.statusCode = 400;
        res.json({
            error: "Name required"
        })
    }else{
        const user = await User.findById(req.params.user_id);
        if(user){
            let newCategories = user.categories;
            const cat_id = newCategories.find(cat => cat._id?.toString() === req.params.category_id)?._id;
            if(cat_id){
                newCategories = newCategories.filter(cat => cat._id !== cat_id);
                newCategories.push({
                    _id: cat_id,
                    name: req.body.name,
                })
            }else{
                req.statusCode = 404;
                res.json({error: "Category not found"})
            }

            const response = await User.findByIdAndUpdate(user._id, {categories: newCategories})
            res.json(response);
        }else{
            res.statusCode = 404;
            res.json({
                error: "User not found"
            })
        }
    }
})

mongoose.connect(process.env.API_URL ?? "")
    .then(() => {
        console.log("Connected");
        app.listen(PORT)
    }).catch(err => {        
        console.error(err);
    })