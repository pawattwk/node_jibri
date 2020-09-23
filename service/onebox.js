const axios = require('axios')
const Users = require('../models/users')
const Rooms = require('../models/rooms')
const Roles = require('../models/roles')
const Onebox = require('../models/onebox')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function getonebox(accesstoken,oneid){
  let user = await Users.findOne({'oneid':oneid})
  let checkonbox = await Onebox.find({'oneid': oneid})
  if (!checkonbox.length) {
    const header = {headers: {Authorization: process.env.ONEBOX_AUTH}}
    const oneidToken ={ accesstoken : accesstoken }
    let getAccountOnebox = await axios.post(process.env.ONEBOX_GETACCOUNT, oneidToken, header)
    if (getAccountOnebox) {
      let dataonebox = getAccountOnebox.data.result
        dataonebox.forEach(async value => {
          let createonebox = new Onebox({
            oneid : oneid,
            account_id : value.account_id,
            account_name : value.account_name,
            branch_no : value.branch_no,
            email : value.email || user.email,
            taxid : value.taxid,
            mainfolder : '',
            storage : '',
            usage_storage : '',
            remain_storage : '',
          })
          const account_ID = { account_id: value.account_id}
          let getMainfolder = await axios.post(process.env.ONEBOX_GETMAINFOLDER, account_ID, header)
          let getStorage = await axios.post(process.env.ONEBOX_GETSTORAGE, account_ID, header)
          if (getMainfolder) {
            let mainfolder = getMainfolder.data.result
            mainfolder.forEach(element => {
              if (element.folder_name == 'Private Main Folder') {
                createonebox.mainfolder = element.folder_id
              }
            });
          }
          if (getStorage) {
            let getstorage = getStorage.data.result
            createonebox.storage = getstorage[0].storage
            createonebox.used_storage = getstorage[0].used_storage
            createonebox.remain_storage = getstorage[0].remain_storage
          }
          await createonebox.save()
        })    
    }
  }
}

async function savefileonebox(file,account_id,folder_id){
  let bodyFormData = new FormData();
  try {
  bodyFormData.append('account_id', account_id)
  bodyFormData.append('folder_id' , folder_id)
  bodyFormData.append('file' , fs.createReadStream(path.resolve(file)))
  let header_formdata = {'Content-Type': `multipart/form-data; boundary=${bodyFormData._boundary}` , Authorization: `Bearer ${process.env.ONEBOX_AUTH}`}
  // let save_onebox = await axios.post(process.env.ONEBOX_SAVEFILE, bodyFormData, header_formdata)
  let save_onebox =  await axios({
      method: 'post',
      url: process.env.ONEBOX_SAVEFILE,
      data: bodyFormData,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: header_formdata
  })
  return save_onebox.data
  } catch (error) {
    console.log(error);
  }
}

async function createfolder(account_id,folder_id,foldername){
  try {
    const header = {headers: {Authorization: process.env.ONEBOX_AUTH}},
    body = {
      account_id: account_id,
      parent_folder_id: folder_id,
      folder_name: foldername
    }
    let useronebox = await Onebox.findOne({'account_id':account_id},'recordfolder')
    if (useronebox) {
      let createfolder = await axios.post(process.env.ONEBOX_CREATEFOLDER,body,header)
      useronebox.recordfolder = createfolder.data.data.folder_id
      await useronebox.save()
      return createfolder.data
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {getonebox,savefileonebox,createfolder}