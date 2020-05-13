const express = require('express')
const app = express()
const cors = require('cors')
const rp = require('request-promise')
// this is middle ware
app.use(cors())
app.use(express.json())

// get a todo
app.get("/findRest/:cuisine", async(req, res)=>{
    let cuisine_id
    try{
        // curl -X GET --header "Accept: application/json" --header "user-key: 7f4248c5a65b72b8898d5b721b5ffb40" "https://developers.zomato.com/api/v2.1/cuisines?city_id=11"

        const {cuisine} = req.params;
        console.log(cuisine)
        const url = "https://developers.zomato.com/api/v2.1/cuisines?city_id=11"
        let requestObj = {
            method: 'GET',
            uri: url,
            headers: {
                'user-key': '7f4248c5a65b72b8898d5b721b5ffb40',
                'Accept': 'application/json'
            },
            json: true
        }
        let result
        try {
            result = await rp(requestObj)
        } catch (error) {
            console.log("Error in API 1")
            console.log(error)
        }
        result = result['cuisines']
        
        for(let data of result){
            if(data['cuisine']['cuisine_name'].toLowerCase() == cuisine.toLowerCase()){
                
                cuisine_id = data['cuisine']['cuisine_id']
                break
            }
        }
        // console.log(cuisine_id['restaurants'])
        
    }catch(e){
        console.error(e)
    }
   
        // request for 5 to resturent
        // curl -X GET --header "Accept: application/json" --header "user-key: 7f4248c5a65b72b8898d5b721b5ffb40" "https://developers.zomato.com/api/v2.1/search?entity_id=11&count=5&cuisines=25&sort=rating&order=asc"

        const url = `https://developers.zomato.com/api/v2.1/search?entity_id=11&count=5&cuisines=${cuisine_id}&sort=rating&order=asc`
        let requestObj = {
            method: 'GET',
            uri: url,
            headers: {
                'user-key': '7f4248c5a65b72b8898d5b721b5ffb40',
                'Accept': 'application/json'
            },
            json: true
        }
        let result
        try {
            result = await rp(requestObj)
        } catch (error) {
            console.log("Error in API 2")
            console.log(error)
        }
        let listRes = []
        for(let data of result['restaurants']){
            listRes.push(data['restaurant']['name'])
        }
        
        console.log(listRes)
        res.send(listRes)
    
})
app.listen(5000, ()=>{
    console.log("this serer is running at 5000 port")
})
