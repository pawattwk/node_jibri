var express = require('express');
var router = express.Router();
const logger = require('../service/loggerfile');
const fs = require('fs');
const path = require('path');
const axios = require('axios')
const Onebox = require('../models/onebox')
const Users = require('../models/users')
const Historyroom = require('../models/history_rooms')
const Sessionroom = require('../models/session_room')
const Oneboxfile = require('../models/oneboxfiles')
const onebox = require('../service/onebox')
const date_time = require('../service/datetime');




router.post('/download',async function(req,res){
  const axios = require('axios')
  const header = {headers: {Authorization: process.env.ONEBOX_AUTH}}
  let download = await axios.get('https://box.one.th/onebox_uploads/api/dowloads_file?file_id=d180cdb0d65c6e65deb153ad84cb1b2a',header)
  console.log(download.data);
  res.send(download.data)
})

router.get('/saveonebox/:meetingid',async function(req,res){
  let meetingid = req.params.meetingid
  try {
    let chkmeeting = await Sessionroom.findOne({'meeting_id':meetingid},['user_id','setting.OneboxAccountid','meeting_id'])
    if (chkmeeting) {
      let user = await Users.findOne({'_id':chkmeeting.user_id},'email')
      let history_file_id = await Historyroom.findOne({'meeting_id':meetingid},'file_id')
      let getfolder =  await Onebox.findOne({'account_id': chkmeeting.setting.OneboxAccountid},['mainfolder','account_id']) 
      if (getfolder) {  
        const pathdirect = process.env.path_record
        let findfile = path.resolve(pathdirect)
        fs.readdir(findfile,async function(err, filenames) {
          if (err) {
            console.log(err)
          }
          var checkfile =  filenames.some(function (value, index, _arr) {
            return value === meetingid+".mp4";
          });
          if (checkfile) {
            let directoryPath ='',filename =`record-${date_time.datetimeformat()}.mp4`
            fs.rename(findfile+'/'+meetingid+".mp4", findfile+'/'+filename, (err) => { 
              if (err) console.log(err);
              console.log(`rename: ${findfile}=>${filename}`); 
            })
            directoryPath = path.resolve(pathdirect+filename)
            let createfolder = await onebox.createfolder(getfolder.account_id,getfolder.mainfolder,'Record_Oneconference')
            if (createfolder.status === 'OK') {
              let savefile = await onebox.savefileonebox(directoryPath,getfolder.account_id,createfolder.data.folder_id)
              if (savefile.message === 'insert data success') {
                let oneboxfile = new Oneboxfile({
                  filename : savefile.data.filename,
                  file_id : savefile.data.id,
                  user_id : chkmeeting.user_id,
                  size :  bytesToSize(savefile.data.size_file),
                  meetingid: chkmeeting.meeting_id
                })
                history_file_id.file_id = savefile.data.id
                await history_file_id.save()
                await oneboxfile.save()
                logger.info(`email: ${user.email}, message: save file record ${filename} to Onebox Successfully.`)
                await fs.unlink(directoryPath, function (err) {
                  if (err) throw err;
                  // if no error, file has been deleted successfully
                  console.log('File deleted!');
                  logger.info(`email: ${user.email}, message: delete file record ${filename} in server Successfully.`)
                  res.json(savefile)
                }); 
              }else{
                logger.error(`email: ${user.email}, message: Can't save file record ${filename}.`)
                console.log("Can't save file.");
                await movefile(filename,chkmeeting.user_id,user.email,meetingid)
                res.json({status:'error',message:"Can't save file."}) 
              }
            } 
          } else 
              res.status(400).json({status:'error',message:"This meetingid has not file record."})
        })
      }
    }else{
      res.status(400).send({status:'error',message:'Meetingid is wrong.'})
    }

  } catch (error) {
    console.log(error);
    res.send(error)
  }
})

// router.post('/test',verifyToken,async function(req,res){
//   let chkmeeting = await Historyroom.findOne({'meeting_id':'94152d51453d035bf4f86172acfc59b2-1597121749666'},["name","member","start_time"])
//   res.send(chkmeeting)
// })

function movefile(filename,user_id,email,meetingid){
  let pathdirect = process.env.path_record,
  backuprecord = process.env.path_backuprecord,
  findfile = path.resolve(backuprecord),
  currentPath = path.resolve(pathdirect+'/'+filename)
  newPath = ''
  fs.readdir(findfile,async function(err, filenames) {
    if (err) {
      console.log(err)
    }
    else{
      let getfile = filenames.some(function (value, index, _arr) {
        return value === user_id
      })
      if (getfile) {
        findfile = path.resolve(backuprecord+'/'+user_id),
        fs.readdir(findfile,async function(err, filenames) {
          if (err) {
            console.log(err)
          }
          else{
            let getname = filenames.filter(function (value, index, _arr) {
              let checkmeetid = value.includes(meetingid),arr=[]
              if (checkmeetid) {
                arr.push(value)
                return arr
              }
            });
            if (getname.length) {
              let checkfile = getname.map(function (value, index, _arr) {
                if (index == getname.length-1) {
                  let meet = value.split(".");
                  let num = meet[0].split('-');
                  let count = parseInt(num[2])
                  if(count < 9) 
                    newPath = path.resolve(`${backuprecord}/${user_id}/${meetingid}-0${count+1}.mp4`)
                  else
                    newPath = path.resolve(`${backuprecord}/${user_id}/${meetingid}-${count+1}.mp4`)
                  return newPath
                }
              })
              newPath = checkfile[getname.length-1]
            }else
              newPath = path.join(`${backuprecord}/${user_id}/${meetingid}-01.mp4`)
            
              fs.rename(currentPath, newPath, (err) => { 
                  if (err) console.log(err);
                  console.log('Move file to: '+newPath); 
                  logger.info(`email: ${email}, message: Move record file to ${newPath}.`)
              })
            }
        })
      }
      else{
        newPath = path.resolve(backuprecord+'/'+user_id)
        fs.mkdir(newPath,(err)=>{ //new folder
          if (err) console.log(err);
          else{
            newPath = path.resolve(backuprecord+'/'+user_id, meetingid+'-01.mp4') //move file
            fs.rename(currentPath, newPath, (err) => { 
              if (err) console.log(err);
              console.log('Move file to: '+newPath); 
              logger.info(`email: ${email}, message: Move record file to ${newPath}.`)
            })
          }
        }); 
      } 
 
    }
  })
}

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return (bytes / Math.pow(1024, i)).toFixed( 2 ) + ' ' + sizes[i];
}
module.exports = router;
