import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import{autocomplete} from "./autocomplete.js";

function differenceInDays(date1) {
  var dt1 = new Date(date1);
  var dt2 = new Date();

  // To calculate the time difference of two dates
  var Difference_In_Time = Math.abs(dt2.getTime() - dt1.getTime());

  // To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  //To display the final no. of days (result)
  console.log("Total number of days between dates  "
      + dt1 + " and "
      + dt2 + " is:  "
      + parseInt(Difference_In_Days));
  return parseInt(Difference_In_Days);
}

let difference_In_Days = differenceInDays(new Date("12-18-2022"));

window.onload = function () {
  document.getElementById(
    "gamenumber"
  ).innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {
  let soluciondiaria = {};
  let index = difference_In_Days - 1;
  soluciondiaria = solutionArray[index];
  return players.filter(jug => {
      if (jug.id == soluciondiaria.id) {
        return jug;
  }}); 
}

Promise.all([fetchJSON("./json/fullplayers.json"), fetchJSON("./json/solution.json")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);
    
    console.log(game.solution);

    document.getElementById(
      "mistery"
    ).src = `https://playfootball.games/media/players/${
      game.solution[0].id % 32
    }/${game.solution[0].id}.png`;

    autocomplete(document.getElementById("myInput"), game);
  }
);
