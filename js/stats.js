export {updateStats, getStats, initState}


let initState = function(what, solutionId) { 
    let resultado = [];
    let primerapos = JSON.parse(localStorage.getItem(what));
    let anonimo = function(guess){
        primerapos.guesses.push(guess);
        localStorage.setItem(what,JSON.stringify(primerapos));
    }
    resultado.push(primerapos);
    resultado.push(anonimo);
    return resultado;
}

function successRate (e){
    // YOUR CODE HERE
}

let getStats = function(what) {
    let stats = JSON.parse(localStorage.getItem(what)) || {"winDistribution" : [0,0,0,0,0,0,0,0,0],
    "gamesFailed" : 0,
    "currentStreak" : 0,
    "bestStreak" :0,
    "totalGames" : 0,
    "successRate" : 0};
    localStorage.setItem(what,JSON.stringify(stats));
     return stats;
};


function updateStats(t){
 let stats = JSON.parse(localStorage.getItem('gameStats'));
    if(t < 8){
        stats.totalGames += 1;
        stats.currentStreak += 1;
        stats.winDistribution[t] += 1;
        if(stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
        stats.successRate = parseInt(((stats.totalGames - stats.gamesFailed)/stats.totalGames)*100);
        
    } else {
        stats.totalGames += 1;
        stats.gamesFailed += 1;
        stats.currentStreak = 0;
        stats.successRate = parseInt(((stats.totalGames - stats.gamesFailed)/stats.totalGames)*100);
    }
 localStorage.setItem("gameStats",JSON.stringify(stats));
};


let stats = getStats('gameStats');

