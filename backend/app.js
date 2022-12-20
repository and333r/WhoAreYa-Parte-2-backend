import fs from 'fs';
import fetch from 'node-fetch'
import mongojs from 'mongojs'

const writepath = 'json/leagues/'
const writepathtwo = 'json/nationalities/'
const writepaththree = 'json/teamIDs/'
const writepathfour = 'json/players/'

var myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", "2495ab3d5c1bdb300342ae3ad3765a94");
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['players','leagues','teams'])


fs.mkdirSync(writepath, {recursive:true})
fs.mkdirSync(writepathtwo, {recursive:true})
fs.mkdirSync(writepaththree, {recursive:true})
fs.mkdirSync(writepathfour, {recursive:true})

let index=0


function IdsLaLiga(){

    let ids = [];
    const data = fs.readFileSync('./fullLaliga.json', 'utf8')
    let datos = JSON.parse(data);
    datos.forEach( e =>{
        ids.push(e.newId);
    })
    ids.forEach(async e =>{
        let json = [];
        await fetch(`https://v3.football.api-sports.io/teams?id=${e}`,requestOptions).then(r => r.json()).then(r => {
            json.push(r.response[0].team);
            json.push(r.response[0].venue);
            console.log(r)
        });
        console.log(json);
        db.teams.insert(json, (err,result) =>{
            if (err){
                console.log(err);
            } else {
                console.log(`${json[0].name} introducido correctamente.`);
            }
        })
    })
}

function infoBig5(){
    const idsLigas = [140,39,135,61,78];
    idsLigas.forEach( async e =>{
        let json = [];
        await fetch(`https://v3.football.api-sports.io/leagues?id=${e}`,requestOptions).then(r => r.json()).then(r => {
            json.push(r.response[0].league);
        });
        db.leagues.insert(json, (err,result) =>{
            if (err){
                console.log(err);
            } else {
                console.log(`${json[0].name} introducido correctamente.`);
            }
        })
    })
}

function conseguirLigas() {
    try {
        // read leagues file into an array of lines
        const data = fs.readFileSync('leagues.txt', 'utf8').split("\n")
        data.forEach((elem, idx) => {
            const url = `https://playfootball.games/media/competitions/${elem}.png`
            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        res.body.pipe(fs.createWriteStream(`${writepath}${elem}.png`))
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`)
                    }
                })
                .catch(err => console.log(err))
        })
    } catch (err) {
        console.error(err);
    }
}
function conseguirBanderaJugador(){
    try {
        // read leagues file into an array of lines
        const data = fs.readFileSync('nationalities.txt', 'utf8').split("\n")
        data.forEach((elem, idx) => {
            let elemEncoded= encodeURIComponent(elem)
            elemEncoded= elemEncoded.substring(0, elemEncoded.length-3)
            // console.log(elem)
            // console.log(elemEncoded)
            const url = `https://playfootball.games/who-are-ya/media/nations/${elemEncoded}.svg`
            console.log(url)
            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        res.body.pipe(fs.createWriteStream(`${writepathtwo}${elemEncoded}.svg`))
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`)
                    }
                })
                .catch(err => console.log(err))
        })
    } catch (err) {
        console.error(err);
    }
}

function conseguirEscudoEquipo(){
    try {
        const data = fs.readFileSync('teamIDs.txt', 'utf8').split("\n")
        data.forEach((elem, idx)=> {
            //console.log(elem)
            elem= parseInt(elem)
            let remElem= parseInt(elem) % 32;
            const url = `https://cdn.sportmonks.com/images/soccer/teams/${remElem}/${elem}.png`
            console.log(url)
            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        res.body.pipe(fs.createWriteStream(`${writepaththree}${elem}.png`))
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`)
                    }
                })
                .catch(err => console.log(err))
        })
    } catch (err) {
        console.error(err);
    }
}

function conseguirPlayers(i){
    let ind=i;
    try {
        // read leagues file into an array of lines
        const data = fs.readFileSync('playerIDs.txt', 'utf8').split("\n")
        while (ind<(i+10) || ind<data.length) {
            let elem = parseInt(data[ind]);
            console.log(elem)
            const url = `https://media.api-sports.io/football/players/${elem}.png`
            console.log(url)
            fetch(url)
                .then(res => {
                    // check status
                    if (res.status === 200) {
                        res.body.pipe(fs.createWriteStream(`${writepathfour}${elem}.png`))
                    } else {
                        console.log(`status: ${res.status} line: ${ind} elem: ${elem} not found`)
                    }
                })
                .catch(err => console.log(err))
            ind += 1;
            if (ind>=data.length) clearInterval(vamosAPorPlayers)
        }
    } catch (err) {
        console.error(err);

    }
    index+=10
}


//IdsLaLiga();
infoBig5();