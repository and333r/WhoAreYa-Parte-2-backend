export { fetchJSON };

async function fetchJSON(file) {
    let jsonObj = {};
    await fetch(file).then(r => r.json()).then(r =>{
        jsonObj = r
    });
    return jsonObj;
}
