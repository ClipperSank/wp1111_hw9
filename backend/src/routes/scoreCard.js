import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();
router.delete("/cards", async(req, res) => {
    try {
        await ScoreCard.deleteMany({});
        console.log("Database deleted");
    } 
    catch (e) { throw new Error("Database deletion failed"); }
    res.json({message: 'Database cleared'})
});

router.post("/card", async(req, res) => {
    const existing = await ScoreCard.findOne({ name: req.body.name, subject:req.body.subject})
    if (existing) {
        const filter = {name:req.body.name, subject:req.body.subject}
        await ScoreCard.updateOne(filter, {name:req.body.name, subject:req.body.subject, score:req.body.score})
        res.send({message:`Updating (${req.body.name}, ${req.body.subject}, ${req.body.score})`, card : true})
    }
    else{
        try {
            const newUser = new ScoreCard({name : req.body.name, subject: req.body.subject, score:req.body.score});
            console.log("Created user", newUser);
            newUser.save();
            res.send({message:`Adding (${req.body.name}, ${req.body.subject}, ${req.body.score})`, card : true})
        } 
        catch (e) { throw new Error("User creation error: " + e); }        
    }
});

router.get("/cards", async(req, res) => {
    const type = req.query.type
    const filter = req.query.queryString
    var data;
    if(type === 'name'){
      data = await ScoreCard.find({name: filter}, {"name": 1, "subject": 1, "score": 1, "_id": 0})
    }
    else{
      data = await ScoreCard.find({subject: filter}, {"name": 1, "subject": 1, "score": 1, "_id": 0});
    }

    let ret = []
    for (let i = 0; i < data.length; i++){
      ret.push(`(${data[i].name}, ${data[i].subject}, ${data[i].score})`)
    }
    if (ret.length > 0){
      res.json({messages: ret, message: 'message'})
    }
    else {
      res.json({message:`${type}(${filter}) not found!`})
    }
});

export default router;