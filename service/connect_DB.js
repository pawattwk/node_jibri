var mongoose = require('mongoose')
const Roles = require('../models/roles')


try {
  var url = `mongodb://${process.env.databaseHost}:${process.env.databasePort_ie}/${process.env.databaseName_ie}?authSource=${process.env.database_AuthSource}`;
  var option =  {
    user: process.env.database_User,
    pass: process.env.database_Password,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    }
  mongoose.connect(url,option)
  createRole()
  console.log('DB Connect');
} 
catch (error) {
  console.log(error);
}

async function createRole(){
  try {
    let role = await Roles.find({$or:[ {'name':'admin'}, {'name':'user'} ]})
    if (!role.length) {
      let createadminrole = new Roles({
        name : "admin",
        created_at : Date.now(),
        updated_at : Date.now(),
      })
      let createuserrole = new Roles({
        name : "user",
        created_at : Date.now(),
        updated_at : Date.now(),
      })
      await createadminrole.save()
      await createuserrole.save()
      console.log('Create Roles');
    }
  } catch (error) {
   console.log(error); 
  }
}