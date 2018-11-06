const Joi = require ('joi');
const express = require ('express');
const app = express();
app.use (express.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

const courses = [
    {id:1, name:"courses1"},
    {id:2, name:"courses2"},
    {id:3, name:"courses3"},
];

app.get ('/',(req,res) => {
    res.send ("hello world");
});

app.get ('/api/courses',(req,res) =>{
    res.send (courses)
});

app.get ('/api/courses/:id',(req,res) => {
    
   const course = courses.find (c=>c.id === parseInt (req.params.id));
   if (!course) {
      return res.status(404).send ('The course with the given ID was not found'); //response not found
   }
   res.send (course)
});

app.post ('/api/courses',(req,res)=>{
    const {error} = validateCourse (req.body); // result.erro

    if (error){
        res.status(400).send (error.details[0].message)//400 bad request
        return;
    }
    
    const course = {
        id : courses.length + 1,
        name: req.body.name
    }
    courses.push (course);
    res.send (course);
});

app.put ('/api/courses/:id',(req,res) => {
    const course = courses.find (c=>c.id === parseInt (req.params.id));
   if (!course) {
      return res.status(404).send ('The course with the given ID was not found'); //response not found
       
   } 

   const {error} = validateCourse (req.body); // result.erro

    if (error){
        res.status(400).send (error.details[0].message)//400 bad request
        return;
    }

    course.name = req.body.name;
    res.send (course);
    })

app.delete ('/api/courses/:id',(req,res)=>{
    //look up the course
    //not existing, return 404
    const course = courses.find (c=>c.id === parseInt (req.params.id));
    if (!course) {
      return  res.status(404).send ('The course with the given ID was not found'); //response not found
    } 
    //delete
    const index = courses.indexOf (course);
    courses.splice (index,1);

    res.send (course);
    
});
//PORT
const port = process.env.PORT || 3000;
app.listen (port,()=>{
   console.log (`listening on port ${port}...`) 
})


function validateCourse (course){
    const schema = {
        name : Joi.string().min(3).required()
        };
        return Joi.validate (course,schema);
}