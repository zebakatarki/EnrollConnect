const {faker} = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");
 
const {v4 : uuidv4}=require('uuid');

app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'sql_project',
    password:'Zeba_98',
});

//Welcome Page..
app.get("/",(req,res)=>{
    res.render("welcome.ejs");
})

//Add Admin
app.get("/Newadmin",(req,res)=>{
    res.render("Newadmin.ejs");
});

//Secret Key
app.get("/skey",(req,res)=>{
    let q='select * from secretkey';
    try
    {
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let info=result[0];
        // console.log(info);
        res.render("secretkey.ejs",{info});
    });
    } catch(err){
        console.log(err);
    }
    
})

app.post("/skey/:id",(req,res)=>{
    // let{id,key}=req.body;
    let{id}=req.params;
    let{key}=req.body;
    // console.log(id);
    // console.log(key);
    let q=`select * from secretkey where id='${id}'`;
    try
    {
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let finalsk=result[0];
        if(finalsk.skey==key){
            res.render("adminchoice.ejs");
        }
        else{
            res.render("incorrectkey.ejs");
        }
    });
    } catch(err){
        console.log(err);
    }
})

app.post("/Newadmin",(req,res)=>{
    let newid=uuidv4();
    let {name,email,password}=req.body;
    let q="insert into admin(id,name,email,password) values(?,?,?,?)";
    let admin=[newid,name,email,password];
    try
    {
    connection.query(q, admin,(err,res)=>{
        if(err) throw err;
        console.log(res);
    });
    } catch(err){
        console.log(err);
    }
    res.redirect("/admin");
})

//Admin Table
app.get("/admin",(req,res)=>{
    let q=`select * from admin`;
    try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        // console.log(result);
        res.render("admin.ejs",{result});
    })
    } catch(err){
        console.log(err);
        res.send("some error in database");
    }  
});

app.get("/admin/:id",(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let q=`select * from admin where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // console.log(result);
            let user=result[0];
            // console.log(user);
            res.render("adminpassword.ejs",{user});
        })
        } catch(err){
            console.log(err);
            res.send("some error in database");
        }  
})

app.post("/admin/:id",(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let {enteredpw,enteredemail}=req.body;
    console.log(enteredpw);
    let q=`select * from admin where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            console.log(user);
            console.log(user.email);
            if(user.password==enteredpw && user.email==enteredemail)
            {
                // res.render("database.ejs");
                res.redirect("/userreg/db");
            }
            else{
                res.render("incorrectpw.ejs");
            }
        })
        } catch(err){
            console.log(err);
            res.send("some error in database");
        }  

})

app.get("/adminchoice",(req,res)=>{
    res.render("adminchoice.ejs");
})

//User Registering
app.get("/userreg",(req,res)=>{
    res.render("register.ejs");
})

app.post("/userreg",(req,res)=>{
    let newid=uuidv4();
    let {username,email,phone,bd,password}=req.body;

    let q="insert into userreg(id,username,email,phone,birthdate,password) values(?,?,?,?,?,?)";

    let users=[newid,username,email,phone,bd,password];
    
    connection.query(q, users,(err,result)=>{
        if(err) {
            console.error(err);
            if(err.code === 'ER_DUP_ENTRY'){
                return res.render("error.ejs",{error: "User Already Existed."});
            }else{
                return res.render("error.ejs",{error: "An error occurred during registeration."});
            }
        }
        console.log(result);
        res.render("Thankyou.ejs");
});
});

//view DataBase
app.get("/userreg/db",(req,res)=>{                           
    let q=`select count(*) from userreg`;
    let q1=`select * from userreg`;
    connection.query(q, (err,result)=>{
        if(err) throw err;
        let count = result[0]["count(*)"];
            
        connection.query(q1, (err,users)=>{
                if(err) throw err;
                res.render("database.ejs",{count,users});
            });
    });
});

//Delete User
app.get("/userreg/:id/delete",(req,res)=>{
    let {id}=req.params;
    console.log(id);  
        let q1=`delete from userreg where id='${id}'`;
            connection.query(q1,(err,result)=>{
            console.log("Deleted:",result);
            res.redirect("/userreg/db");
    });    
})

//Server Check
app.listen("8080",()=>{
    console.log("Server is listening to 8080!");
})