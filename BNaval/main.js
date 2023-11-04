//Program by Pierre Mariani the 04/11/2023


// Number of player and AI attempts
let nb=0;
let nb2=0;
// Ambient sounds
var IhitSound;
var hehitSound;
var missSound;
var victorysound;
var losesound;
// Coordinates
var cx11,cx12,cy11,cy12,cx21,cx22,cy21,cy22,cx31,cx32,cy31,cy32;

// Associate sounds with their variables
document.addEventListener("DOMContentLoaded", function() {
  IhitSound = document.getElementById("iHit-sound");
  hehitSound = document.getElementById("heHit-sound");
  missSound = document.getElementById("miss-sound");
  victorysound = document.getElementById("victory-sound");
  losesound = document.getElementById("lose-sound");
});

class Case {
  //x , y are the coordinates. Empty to check if the box is empty. Miss to check if the box was targeted and it was empty. Destroyed if the box was targeted and was not empty
  constructor(x, y, empty = true,miss = false,destroyed = false) {
    this.x = x;
    this.y = y;
    this.empty = empty;
    this.miss = miss;
    this.destroyed = destroyed;
  }

  getX() {
    return this.x;
  }

  setX(x) {
    this.x = x;
  }

  getY() {
    return this.y;
  }

  setY(y) {
    this.y = y;
  }

  isEmpty() {
    return this.empty;
  }

  isMissing() {
    return this.miss;
  }

  setEmpty(empty) {
    this.empty = empty;
  }

  getDestroyed() {
    return this.destroyed;
  }
}
  



class Plateau {
  //The player’s board, enemy and display . The list of player’s and enemy’s boats
  constructor(board = []) {
    this.board = board;
    this.tab = new Array(5).fill(null).map(() => new Array(5).fill(null));
    this.tab2 = new Array(5).fill(null).map(() => new Array(5).fill(null));
    this.tabmodele = new Array(5).fill(null).map(() => new Array(5).fill(null));
    this.allships = [];
    this.myallships = [];
  }
  //Table creation and initialization to empty boxes for the Player
  create() {
    for (let i = 0; i < this.tab.length; i++) {
      for (let j = 0; j < this.tab.length; j++) {
        this.tab[i][j] = new Case(i,j, true);
      }
    }
  }
  //Table creation and initialization to empty boxes for the Enemy
  create2() {
    for (let i = 0; i < this.tab2.length; i++) {
      for (let j = 0; j < this.tab2.length; j++) {
        this.tab2[i][j] = new Case(i, j, true);
      }
    }
  }
  //Table creation and initialization to empty boxes
  createmodele () {
    for (let i = 0; i < this.tabmodele.length; i++) {
      for (let j = 0; j < this.tabmodele.length; j++) {
        this.tabmodele[i][j] = new Case(i, j, true);
      }
    }
  }
  //Allows AI boats to be placed linearly
  autocorrect (x1,y1,x2,y2) {
    const saisie = new Array(4);
    if (x2 > x1) {
      x2 = x1 + 1;
      y2 = y1;
    } else if (x2 < x1) {
      x2 = x1 - 1;
      y2 = y1;
    } else if (y2 < y1) {
      y2 = y1 - 1;
      x2 = x1;
    } else if (y2 > y1) {
      y2 = y1 + 1;
      x2 = x1;
    }
    saisie[0] = x1;
    saisie[1] = y1;
    saisie[2] = x2;
    saisie[3] = y2;
    return saisie;
  }
  //Creation and addition of AI boats randomly
  autoShipSetup() {
    const saisie = new Array(4);
    for (let j =0; j < 3 ; j++) {
      for (let i = 0; i < 4;i++) {
        let r = Math.floor(Math.random() * 5);
        saisie[i] = r;
        console.log(`IA : " ${r}`);
      }
      let myTab = this.autocorrect(saisie[0],saisie[1],saisie[2],saisie[3]);
      const s2 = new Ship(myTab[0],myTab[1],myTab[2],myTab[3], this.tab,this.tab2);
      if (s2.checkShip2(myTab[0], myTab[1], myTab[2], myTab[3])) {
        this.allships.push(s2);
        console.log(`Bateau numéro ${j} a été ajouté `);
        this.tab2 = s2.changeP2(myTab[0], myTab[1], myTab[2], myTab[3]);
        console.log(this.showTabIA());
      } else {
        console.log("Saisie incorrecte");
        j--;
      }
    }
    document.body.innerHTML = this.toString2();
  }

    

  //Create and add player’s boats using filled fields 
  shipSetup() {
    let start = true;
    const x1 = parseInt(document.getElementById('a1').value, 10);
    const y1 = parseInt(document.getElementById('b1').value, 10);
    const x2 = parseInt(document.getElementById('a2').value, 10);
    const y2 = parseInt(document.getElementById('b2').value, 10);
    const x12 = parseInt(document.getElementById('c1').value, 10);
    const y12 = parseInt(document.getElementById('d1').value, 10);
    const x22 = parseInt(document.getElementById('c2').value, 10);
    const y22 = parseInt(document.getElementById('d2').value, 10);
    const x13 = parseInt(document.getElementById('e1').value, 10);
    const y13 = parseInt(document.getElementById('f1').value, 10);
    const x23 = parseInt(document.getElementById('e2').value, 10);
    const y23 = parseInt(document.getElementById('f2').value, 10);

    cx11 = x1;
    cx12 = x2;
    cy11 = y1;
    cy12 = y2;
    cx21 = x12;
    cx22 = x22;
    cy21 = y12;
    cy22 = y22;
    cx31 = x13;
    cx32 = x23;
    cy31 = y13;
    cy32 = y23;

    const s1 = new Ship(x1,y1,x2,y2,this.tab);
    const s2 = new Ship(x12,y12,x22,y22, this.tab);
    const s3 = new Ship(x13,y13,x23,y23, this.tab);
    if (s1.checkShip()) {
      if (PlayerShipValid(x1,y1,x2,y2)) {
        this.myallships.push(s1);
        this.tab = s1.changeP();
        console.log(this.showTab());
      }
      else {
        start = false;
        console.log("Bateau numéro 1 mal ajusté");
      }
    } else {
      console.log("Saisie incorrecte pour le premier bateau");
    }
    if (s2.checkShip()) {
      if (PlayerShipValid(x12,y12,x22,y22)) {
        this.myallships.push(s2);
        this.tab = s2.changeP();
        console.log(this.showTab());
      }
      else {
        start = false;
        console.log("Bateau numéro 2 mal ajusté");
      }
    } else {
      console.log("Saisie incorrecte pour le second bateau");
    }
    if (s3.checkShip()) {
      if (PlayerShipValid(x13,y13,x23,y23)) {
        this.myallships.push(s3);
        this.tab = s3.changeP();
        console.log(this.showTab());
      }
      else {
        start = false;
        console.log("Bateau numéro 3 mal ajusté");
      }
    } else {
      console.log("Saisie incorrecte pour le 3e bateau");
    }
    if (start) {
      this.autoShipSetup(); 
    }
  }
  //Adding and creating player’s boats using old transmitted data 
  retrySetup() {
    this.allships.splice(0, this.allships.length);
    this.myallships.splice(0,this.myallships.length);
    const s1 = new Ship(cx11,cy11,cx12,cy12,this.tab);
    const s2 = new Ship(cx21,cy21,cx22,cy22, this.tab);
    const s3 = new Ship(cx31,cy31,cx32,cy32, this.tab);
    if (s1.checkShip()) {
      this.myallships.push(s1);
      this.tab = s1.changeP();
      console.log(this.showTab());
    } else {
      console.log("Saisie incorrecte pour le premier bateau");
    }
    if (s2.checkShip()) {
      this.myallships.push(s2);
      this.tab = s2.changeP();
      console.log(this.showTab());
    } else {
      console.log("Saisie incorrecte pour le second bateau");
    }
    if (s3.checkShip()) {
      this.myallships.push(s3);
      this.tab = s3.changeP();
      console.log(this.showTab());
    } else {
      console.log("Saisie incorrecte pour le 3e bateau");
    }
    this.autoShipSetup();
  }
    // Check the enemy’s ship coordinates
    verifallship () {
      for (let i = 0; i < this.allships.length; i++) {
        console.log(`Bateau ${i + 1}: X1=${this.allships[i].getX1() }, Y1=${this.allships[i].getY1()}, X2=${this.allships[i].getX2()}, Y2=${this.allships[i].getY2()}`);
      }
    }
    // Check whether according to the transmitted coordinates and the coordinates of enemy boats if the player has hit
    isAttacked (a1,b1) {
      for (let i =0 ; i < this.allships.length;i++) {
        console.log (this.allships[i].getX1());
        console.log (this.allships[i].getY1());
        if (this.allships[i].getX1() == a1 && this.allships[i].getY1() == b1 ) {
          console.log("touché à l'avant");
          return true;
        }
        if (this.allships[i].getX2() == a1 && this.allships[i].getY2() == b1 ) {
            console.log ("touché à l'arrière");
            return true;
        }
      }
      console.log(this.verifallship());
      return false;
    }
    // Check whether according to the transmitted coordinates and the coordinates of the player’s boats if the enemy has hit
    IamAttacked (a1,b1) {
      for (let i =0 ; i < this.myallships.length;i++) {
        console.log (this.myallships[i].getX1());
        console.log (this.myallships[i].getY1());
        if (this.myallships[i].getX1() == a1 && this.myallships[i].getY1() == b1 ) {
          console.log("touché à l'avant");
          return true;
        }
        if (this.myallships[i].getX2() == a1 && this.myallships[i].getY2() == b1 ) {
            console.log ("touché à l'arrière");
            return true;
        }
      }
      return false;
    }
    // checks if the player still has boats
    verifwinIA () {
      for(let i = 0 ; i < this.tab.length;i++) {
        for (let j = 0; j <this.tab.length;j++) {
          if (!this.tab[i][j].isEmpty()) {
            return false;
          }
        }
      }
      return true;
    }
    // checks if the enemy still has boats
    verifwinPlayer() {
      for (let i = 0; i < this.tab2.length; i++) {
        for (let j = 0; j < this.tab2.length; j++) {
          if (this.tab2[i][j].isEmpty()) {
          } else {
            return false;
          }
        }
      }
      return true;
    }
    // Random attack on squares that have never been targeted if hit activation of a sound and visual change if not hit visual change
    autoassault() {
      let repet = true;
      let x1,y1;  
      while (repet) {
        let r = Math.floor(Math.random() * 5);
        let r1 = Math.floor(Math.random() * 5);
        x1 = r;
        y1 = r1;
        if (!this.tab[x1][y1].isMissing()) {
          if (!this.tab[x1][y1].getDestroyed()) {
            repet = false;
          }
        }
      }
      if (this.IamAttacked(x1,y1)) {
        jouerSonToucherIA();
        this.tab[x1][y1] = new Case (x1,y1,true,false,true);//On met la case vide, non raté et détruite ne pas l'attaquer de nouveau
        document.body.innerHTML =this.toString2();
      }else {
        console.log("lennemi a rate");
        console.log("l'attaque était dirigé en : "+x1+ " , "+y1);
        this.tab[x1][y1] = new Case (x1,y1,true,true,false);
        document.body.innerHTML =this.toString2();
        nb2++;
      }
      if (this.verifwinIA()) {
        console.log (" Vous avez perdu");
        document.body.innerHTML = losePage();
        losesong();
      }
    }

    // Attack on the enemy board celon the data entered by the player visual change and load sound accordingly
    assault() {
      const x1 = parseInt(document.getElementById('x1').value, 10);
      const y1 = parseInt(document.getElementById('y1').value, 10);
      if (this.isAttacked(x1,y1)) {
        jouerSonToucherJoueur();
        this.tab2[x1][y1] = new Case (x1,y1, true);
        this.tabmodele[x1][y1] = new Case (x1,y1,true,false,true);
        document.body.innerHTML =this.toString2();
      }
      else {
        Miss();
        this.tabmodele[x1][y1] = new Case (x1,y1,true,true,false);
        document.body.innerHTML =this.toString2();
      }
      if (this.verifwinPlayer()) {
        console.log(" Vous avez gagné");
        document.body.innerHTML = winPage();
        winsong();
      } else {
        this.autoassault();
        console.log("Tour suivant");
        nb++;
      }
    }
    // Console display of the enemy board
    showTabIA() {
      let s = "";
      for (let i = 0; i < this.tab2.length; i++) {
        s += "\n";
        for (let j = 0; j < this.tab2.length; j++) {
          if (this.tab2[i][j].isEmpty()) {
            s += "  _   ";
          } else {
            s += "  x   ";
          }
        }
      }
      return s;
    }
    // Console display of the Player board
    showTab() {
      let s = "";
      for (let i = 0; i < this.tab.length; i++) {
        s += "\n";
        for (let j = 0; j < this.tab.length; j++) {
          if (this.tab[i][j].isEmpty()) {
            s += "  _   ";
          } else {
            s += "  x   ";
          }
        }
      }
      return s;
    }
    // Screen display of the Player board
    showTab2() {
      let html='';
      html+= "<div class='maincontainer'><div class='container'>";
      html+="<div class='tabinfo1'>";
      html+="<p> Your board </p>";
      html+="</div>";
      html += "<table class='gametab'>";
      html+= "<tr class='toptab'>";
      html+= "<td></td><th></th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th>";
      html+="</tr>";
      for (let i = 0; i < this.tab.length; i++) {
        html += "<tr class='lefttab'>";
        html+= `<th></th><th>${i}</th>`;
        for (let j = 0; j < this.tab.length; j++) {
          if (this.tab[i][j].isEmpty()) {
            if (this.tab[i][j].isMissing()) {
              html += "<td class='miss-cell'></td>";
            }
            else if (this.tab[i][j].getDestroyed()){
              html += "<td class='destroyed-cell'></td>";
            }
            else {
              html += "<td class='empty-cell'></td>";
            }
          } else {
            html += "<td class='occupied-cell'></td>";
          }
        }
        html += "</tr>";
      }
      html += "</table>";
      html+="</div>";
      return html;
    }
    // Screen display of enemy board
    showTabmodele() {
      let html='';
      html+= "<div class='container2'>";
      html+="<div class='tabinfo2'>";
      html+="<p> Enemy board  </p>";
      html+="</div>";
      html += "<table class='gametab'>";
      html+= "<tr class='toptab'>";
      html+= "<td></td><th></th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th>";
      html+="</tr>";
      for (let i = 0; i < this.tabmodele.length; i++) {
        html += "<tr class='lefttab'>";
        html+= `<th></th><th>${i}</th>`;
        for (let j = 0; j < this.tabmodele.length; j++) {
          if (this.tabmodele[i][j].isEmpty()) {
            if (this.tabmodele[i][j].isMissing()) {
              html += "<td class='miss-cell'></td>";
            }
            else if (this.tabmodele[i][j].getDestroyed()){
              html += "<td class='destroyed-cell'></td>";
            }
            else {
              html += "<td class='empty-cell'></td>";
            }
          } else {
            html += "<td class='occupied-cell'></td>";
          }
        }
        html += "</tr>";
      }
      
      html += "</table>";
      html+='</div>';
      html+='</div>'; 
      html+='</div>'; 
      
      return html;
    }
    // Screen display of empty board
  showTabmodele2() {
    let html='';
    html+= "<div class='globalformsecondcontainer'>"
    html+= "<div class='formsecondcontainer'>"
    html+="<div class='popmessage'>";
    html+="<p> Position your ships !</p>";
    html+="</div>"; 
    html += "<table>";
    html+= "<tr class='toptab'>";
    html+= "<td></td><th></th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th>";
    html+="</tr>";
    for (let i = 0; i < this.tabmodele.length; i++) {
        html += "<tr class='lefttab'>";
        html+= `<th></th><th>${i}</th>`;
        for (let j = 0; j < this.tabmodele.length; j++) {
            if (this.tabmodele[i][j].isEmpty()) {
                if (this.tabmodele[i][j].isMissing()) {
                  html += "<td class='miss-cell'></td>";
                }
                else {
                  html += "<td class='empty-cell'></td>";
                }
            } else {
                html += "<td class='occupied-cell'></td>";
            }
        }
        html += "</tr>";
    }
    // Rules display on the right of the screen
    html += "</table>";
    html+='</div>';
    html+="<div class='bigexplaincontainer'>";
    html+="<div class='explaincontainer'>";
    html+="<p> Y means the vertical axis </p>";
    html+='</div>';
    html+="<div class='explaincontainer'>";
    html+="<p> X means the horizontal axis </p>";
    html+='</div>';
    html+="<div class='explaincontainer'>";
    html+="<p> Position 3 ships </p>";
    html+='</div>';
    html+="<div class='Caseexplaincontainer'>";
    html+="<p> 2 boxes represent a coordinate </p>";
    html+='</div>';
    html+="<div class='explaincontainer'>";
    html+="<p> Ships of 2 boxes long </p>";
    html+='</div>';
    html+="<div class='Caseexplaincontainer'>";
    html+="<p> Incorrect diagonal position </p>";
    html+='</div>';
    html+='</div>';
    html+='</div>';
    html+='</div>';
    return html;
}
  
    toString() {
      return this.showTab2();
    }


    toString2() {
      return  showAttack() + this.showTab2()+this.showTabmodele() ;
    }
  
    getBoard() {
      return this.board;
    }
  
    setBoard(board) {
      this.board = board;
    }
  
    getTab() {
      return this.tab;
    }
  
    getCase(x, y) {
      return this.tab[x][y];
    }
  
    setTab(tab) {
      this.tab = tab;
    }
    //Fields to fill in for player ship coordinates
    showcreate() {
      let html='';
      html+= '<div class="formbigcontainer">';
      html+= '<div class="formfirstcontainer">';
      html+='<form id="create-form">';
      html+='<div class="shipcontain">';
      html+='<input type="number" id="a1" placeholder="Y1" name="a1" required>';
      html+='<input type="number" id="b1" placeholder="X1" name="b1" required>';
      html+="<hr>";
      html+='<input type="number" id="a2" placeholder="Y2" name="a2" required>';
      html+='<input type="number" id="b2"placeholder="X2" name="b2" required>';
      html+='</div>';
      html+='<div class="shipcontain">';
      html+='<input type="number" id="c1" placeholder="Y1" name="c1" required>';
      html+='<input type="number" id="d1"  placeholder="X1" name="d1" required>';
      html+="<hr>";
      html+='<input type="number" id="c2" placeholder="Y2" name="c2" required>';
      html+='<input type="number" id="d2" placeholder="X2" name="d2" required>';
      html+='</div>';
      html+='<div class="shipcontain">';
      html+='<input type="number" id="e1" placeholder="Y1" name="e1" required>';
      html+='<input type="number" id="f1"  placeholder="X1" name="f1" required>';
      html+="<hr>";
      html+='<input type="number" id="e2" placeholder="Y2" name="e2" required>';
      html+='<input type="number" id="f2" placeholder="X2" name="f2" required>';
      html+='</div>';
      html+='<button type="button" onclick="plateau.shipSetup()">Start</button>';
      html+='</form>';
      html+='</div>';
      return html;
    }

    showfirstPart(){
      return this.showcreate() + this.showTabmodele2();
    }
  }

class Ship {
  constructor(x1, y1, x2, y2, tab,tab2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.tab = tab;
    this.tab2 =tab2;
  }
  // checks if the player is not trying to place a ship on a non-empty slot
  checkShip() {
    if (!this.tab[this.x1][this.y1].isEmpty() || !this.tab[this.x2][this.y2].isEmpty()) {
      return false;
    } else {
      return true;
    }
  }
  // checks if the enemy is not trying to place a boat on a non-empty slot
  checkShip2(a1, b1, a2, b2) {
    if (this.tab2 && this.tab2[a1] && this.tab2[a1][b1] && !this.tab2[a1][b1].isEmpty() ||
    this.tab2 && this.tab2[a2] && this.tab2[a2][b2] && !this.tab2[a2][b2].isEmpty()) {
      return false;
    } else {
      return true;
    }
  } 
  
  // Changes the visual of a enemy board square
  changeP2(a1,b1,a2,b2) {
    this.tab2[a1][b1] = new Case(a1, b1, false);
    this.tab2[a2][b2] = new Case(a2,b2, false);
    return this.tab2;
  }
  // Changes the visual of a player board square
  changeP() {
    this.tab[this.x1][this.y1] = new Case(this.x1, this.y1, false);
    this.tab[this.x2][this.y2] = new Case(this.x2, this.y2, false);
    return this.tab;
  }
  
  getX1() {
    return this.x1;
  }
  
  setX1(x1) {
    this.x1 = x1;
  }
  
  getY1() {
    return this.y1;
  }
  
  setY1(y1) {
    this.y1 = y1;
  }
  
  getX2() {
    return this.x2;
  }
  
  setX2(x2) {
    this.x2 = x2;
  }
  
  getY2() {
    return this.y2;
  }
  
  setY2(y2) {
    this.y2 = y2;
  }
}
//creation of the game
const plateau = new Plateau();

//Displays fields that allow the player to target a box
function showAttack() {
  let html = '';
  html+="<div class='gamemaincontainer'>";
  html+="<div class='container0'>";
  html+='<form id="attack-form">';
  html+='<input type="number" id="x1" placeholder="Y1" name="x1" required>';
  html+='<input type="number" id="y1" placeholder="X1" name="y1" required>';
  html+='<button type="button" onclick="plateau.assault()">Attack</button>';
  html+='</form>';
  html+='</div>';
  return html;
}

// Function to check if the boats are placed correctly - If boat outside the return false array, if boat placed linearly return true otherwise false
function PlayerShipValid(x1,x2,y1,y2) {
  if (x1 == 0 && x2 < x1) {
    return false;
  }
  else if (x1 == 4 && x2 > x1 ) {
    return false;
  }
  else if (y1 == 0 && y2 < y1 ) {
    return false;
  }
  else if (y1 == 4 && y2 > y1) {
    return false;
  }
  else if (x2 == x1+1 && y2 == y1) {
    return true;
  }
  else if (x2 == x1-1 && y2 == y1 ) {
    return true;
  }
  else if (y2 == y1+1 && x1 == x2) {
    return true;
  }
  else if (y2 == y1-1 && x1 == x2) {
    return true;
  }
  else {
    return false;
  }
}

function jouerSonToucherJoueur() {
  IhitSound.play();
}

function jouerSonToucherIA() {
  hehitSound.play();
}

function Miss() {
  missSound.play();
}

function winsong() {
  victorysound.play();
}

function losesong() {
  losesound.play();
}
// Display of the page if the player wins. Depending on his number of tentavie a different message appears
function winPage () {
  let html = '';
  html += "<div class='containerwin'>";
  html += "<div class='containerwin1'>";
  html+= "<p> Congratulations ! </p>";
  html+='</div>';
  html += "<div class='containerwin2'>";
  if (nb < 10 ){
    html+="<div class='mess1'>";
    html+="<p> You are incredibly strong! This kind of performance happens less than 5% of the time! </p>";
    html+="</div>";
  }
  else if (nb < 14 ){
    html+="<div class='mess1'>";
    html+="<p> You delivered an honorable performance! This kind of performance happens less than 40% of the time! </p>";
    html+="</div>";
  }
  else {
    html+="<div class='mess1'>";
    html+="<p> You provided an unimpressive performance! You are among the 60% worst players! Shame ! </p>";
    html+="</div>";
  }
  html+= `<p> You have won in ${nb} attempts ! </p>`;
  html+='</div>';
  html+="<div class='letter'>";
  if (nb < 10) {
    html+= '<img src="LetterA.svg.png">';
  }
  else if (nb < 14) {
    html+= '<img src="B.png">';
  }
  else {
    html+= '<img src="C.jpg">';
  }
  html+="</div>";
  html+="<div class='buttoncontainer'>";
  html+="<div class='buttoncontainerleft'>";
  html+="<a href ='index.html'><button>🏠</button></a>";
  html+='</div>';
  html+="<div class='buttoncontainermid'>";
  html+="<a href ='jeu.html'><button>🔄</button></a>";
  html+='</div>';
  html+="<div class='buttoncontainerright'>";
  html+='<button type="button" onclick="retry()">Retry with the same board</button>';
  html+='</div>';
  html+='</div>';
  html+='</div>';
  return html;
}
//Display of the page if the player loses. Depending on the enemy number of tentavie a different message appears
function losePage () {
  let html = '';
  html += "<div class='containerwin'>";
  html += "<div class='containerwin1'>";
  html+= "<p> You suck at this! </p>";
  html+='</div>';
  html += "<div class='containerwin2'>";
  html+="<div class='mess1'>";
  html+="<p> You managed to lose against a robot! It’s time to ask the right questions! </p>";
  html+="</div>";
  html+= `<p> You were exterminated in ${nb2} attempts! </p>`;
  html+='</div>';
  html+="<div class='buttoncontainer'>";
  html+="<div class='buttoncontainerleft'>";
  html+="<a href ='index.html'><button>🏠</button></a>";
  html+='</div>';
  html+="<div class='buttoncontainermid'>";
  html+="<a href ='jeu.html'><button>🔄</button></a>";
  html+='</div>';
  html+="<div class='buttoncontainerright'>";
  html+='<button type="button" onclick="retry()">Retry with the same board</button>';
  html+='</div>';
  html+='</div>';
  html+='</div>';
  return html;
}

// Allows to start the game and the first displays
function initGameFirstPart() {
  plateau.create();
  plateau.create2();
  plateau.createmodele();
  document.body.innerHTML = plateau.showfirstPart();
}
//Allows to restart a game without the player has replaced his ships
function retry() {
  console.log("retry appelé");
  nb = 0;
  nb2 = 0;
  plateau.create();
  plateau.create2();
  plateau.createmodele();
  plateau.retrySetup();
}
window.onload = initGameFirstPart;



