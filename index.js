const ball = document.getElementById("ball");
const scoreEl = document.getElementById("scoreBoard");

let cancelFrame;
let pos = 0;
let SPEED = 70;
const VIRUS_SPEED = 5;
let count = 0;
let virusCount = 0;
const arrayOfEl = [];
let startTime;
const arrayOfVirus = [];
let onloadSpoke = false;
let afterEveryOneMinute;
let totalScore = 0;
let totalHumansKilledScore = 0;
let vacineActivated = false;
const arrayOfVoieMsgs = [
  "Your First Shot fired. Enemies are ahead. Shoot them all",
  "Excelent shot",
  "Shoot them hard",
  "Keep firing at enemies",
  "Enamies are ahead",
  "Wear the mask",
  "enemies down",
  "enemies on",
];
const totalVirusesKilledArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const virusBkColors = ["pink", "yellow", "blue", "green", "maroon", "red"];
const scaleVirus = [0.2, 0.4, 0.8, 0.9, 1, 1.5];
const virusRotationDeg = [10, 20, 30, 40, 45, 60, 90, 120, 360];
let isSoundOn = true;
const numberOfVirusGeneration = 50;
let bombActivated = false;
let multipleFire = false;
const audioSounds = [
  {
    name: "camera-beep",
    filePath: "assets/camera-beep.mp3",
  },
  {
    name: "gun-sound",
    filePath: "assets/gunsound.mp3",
  },
];
function runRequestFrameAnimation(now) {
  fire();
  executeAfterEverySeond(now);
  executeAfterEveryMinute(now);
  cancelFrame = requestAnimationFrame(runRequestFrameAnimation);
}
function executeAfterEverySeond(now) {
  startTime = startTime || now;
  afterEveryOneMinute = afterEveryOneMinute || now;
  if (now - startTime >= 500) {
    if (document.querySelectorAll(".virus").length <= numberOfVirusGeneration) {
      generateVirusAndHumans();
    }
    startTime = now;
    moveViruses();
    //removeTheExplosion();
  }
}
function removeTheExplosion() {
  document.querySelectorAll(".explosion").forEach((item) => {
    item.remove();
  });
}
function executeAfterEveryMinute(now) {
  afterEveryOneMinute = afterEveryOneMinute || now;
  if (now - afterEveryOneMinute >= 20000) {
    const randomNum =
      Math.floor(Math.random() * arrayOfVoieMsgs.length - 1) + 1;
    textToSpeech(arrayOfVoieMsgs[randomNum]);
    afterEveryOneMinute = now;
  }
}
function fire() {
  if (arrayOfEl.length) {
    for (let i = 0; i < arrayOfEl.length; i++) {
      const el = document.getElementById(arrayOfEl[i]);
      const viruses = document.querySelectorAll(".virus");
      let bottom;
      el &&
        (bottom = parseInt(getElPos(el,'bottom')
        ));

      el && (el.style.bottom = bottom + SPEED + "px");

      if (bottom > window.innerHeight - 100) {
        arrayOfEl.shift();
        el.remove();
      }
      for (let virusI = 0; virusI < viruses.length; virusI++) {
        if (checkForVirusBullteCollision(el, viruses[virusI])) {
          viruses[virusI].remove();
          if (viruses[virusI].classList.contains("human")) {
            updateHumansKilledScore();
          } else {
            updateVirusScore();
          }
        }
      }
      // viruses.forEach(virus => {
      //    if(checkForVirusBullteCollision(el,virus)) {
      //       // addExplosionImage(virus);
      //        virus.remove();
      //        updateScore();

      //       // textToSpeech(arrayOfVoieMsgs[1]);
      //    }
      // })
    }
  }
}
function addExplosionImage(virus) {
  const el = document.createElement("img");
  el.setAttribute("id", "el" + Math.random());
  el.setAttribute("class", "explosion");
  el.src = "assets/explosion.png";
  document.body.appendChild(el);
  el.style.left = getElPos(virus, "left") + "px";
  el.style.top = getElPos(virus, "top") + "px";
  el.style.transform = "scale(" + 2.5 + ")";
  setTimeout(() => {
    el.remove();
  }, 100);
}
function updateVirusScore() {
  totalScore += 1;
  scoreEl.innerHTML = totalScore;
  const msg = `congrats, you have killed ${totalScore} viruses`;
  totalVirusesKilledArray.includes(totalScore) && textToSpeech(msg);
}
function updateHumansKilledScore() {
  totalHumansKilledScore += 1;
  document.getElementById(
    "humansKilledScoreCard"
  ).innerHTML = totalHumansKilledScore;
  //textToSpeech("fuck you, you have killed human");
}
function getElPos(el, pos) {
  if (el) {
    try {
      return parseInt(window.getComputedStyle(el).getPropertyValue(pos));
    } catch (e) {
      console.log(el);
      console.log(e);
    }
  }
}

function checkForVirusBullteCollision(bullete, vir) {
  const bulleteLeft = getElPos(bullete, "left");
  const bulleteTop = getElPos(bullete, "top");
  const virLeft = getElPos(vir, "left");
  const virTop = getElPos(vir, "top");
  // const virBottom = parseInt(window.getComputedStyle(vir).getPropertyValue("bottom"));

  const virBottom = virTop - 60;
  //console.log(bulleteTop,virTop,bulleteTop, virBottom);

  if (
    bulleteLeft === virLeft ||
    (bulleteLeft + 20 >= virLeft && bulleteLeft + 20 <= virLeft + 60)
  ) {
    if (bulleteTop <= virTop && bulleteTop >= virBottom) {
      //    console.log(bulleteTop,virTop,bulleteTop, virBottom);
      addExplosionImage(vir);
      return true;
    } else {
      // console.log("failedd");
      return false;
    }
  } else {
    return false;
  }
}
function moveViruses() {
  if (arrayOfVirus.length) {
    for (let i = 0; i < arrayOfVirus.length; i++) {
      const el = document.getElementById(arrayOfVirus[i]);
      if (el) {
        let top = getElPos(el, "top");
        let left = getElPos(el, "left");
        const scaleValueRandomly =
          scaleVirus[Math.floor(Math.random() * scaleVirus.length)];
        const roateRandomly =
          virusRotationDeg[Math.floor(Math.random() * virusRotationDeg.length)];
        if (Math.floor(Math.random() * 2)) {
          el.style.transform = "scale(" + scaleValueRandomly + ")";
          // el.style.left = left-20+"px";
        } else {
          //  el.style.transform = ("rotate("+roateRandomly+"deg)");
          //el.style.left = left+20+"px";
        }

        const vaccineElement = document.getElementById("vaccine");
        let vaccineTopPos =
          vacineActivated &&
          parseInt(
            window.getComputedStyle(vaccineElement).getPropertyValue("top")
          );
        el && (el.style.top = top + VIRUS_SPEED + "px");
        // el && (el.style.left = Math.floor(Math.random()*window.innerWidth-10)+"px");
        if (top > window.innerHeight - 50) {
          arrayOfVirus.shift();
          el.remove();
        } else if (vacineActivated && top >= vaccineTopPos) {
          arrayOfVirus.shift();
          el.remove();
        }
      }
    }
  }
}
function textToSpeech(text) {
  var msg = new SpeechSynthesisUtterance();
  var voices = speechSynthesis.getVoices();
  msg.voice = voices[4];
  msg.text = text;
  speechSynthesis.speak(msg);
}
requestAnimationFrame(runRequestFrameAnimation);

function enterKeyPressed(e) {
  if (e.key === "ArrowLeft") {
    moveLeftSide();
  } else if (e.key === "ArrowRight") {
    moveRightSide();
  } else {
    createBullete();
    //moveElToRiht();
  }
}
function activateTheBomb() {
  bombActivated = !bombActivated;
  const bomb = document.getElementById("bombId");
  bombActivated
    ? ((SPEED = 10), (bomb.style.color = "red"))
    : ((SPEED = 50), (bomb.style.color = "grey"));
}
function createBullete() {
  if (!onloadSpoke) {
    textToSpeech(arrayOfVoieMsgs[0]);
    onloadSpoke = true;
  }
  const el = document.createElement("img");
  const el2 = multipleFire && document.createElement("img");

  el.setAttribute("id", "el" + count);
  el.setAttribute("class", "bullete");

  multipleFire && el2.setAttribute("id", "el" + count + 1);
  multipleFire && el2.setAttribute("class", "bullete");

  el.src = bombActivated ? "assets/bomb.png" : "assets/bullete.png";

  el2.src = bombActivated ? "assets/bomb.png" : "assets/bullete.png";
  // el.setAttribute('class','ball');
  arrayOfEl.push("el" + count);
  multipleFire && arrayOfEl.push("el" + count + 1);

  count++;
  document.body.appendChild(el);
  multipleFire && document.body.appendChild(el2);

  var left = getElPos(ball, "left");
  el.style.left = (multipleFire && left + "px") || left + 40 + "px";
  multipleFire && (el2.style.left = left + 80 + "px");
  playGunSound(audioSounds[1]["filePath"]);
}
function playGunSoundOnOf() {
  isSoundOn = !isSoundOn;
  const id = document.getElementById("valumeId");

  if (isSoundOn) {
    textToSpeech("valume on");
    id.style.color = "red";
  } else {
    textToSpeech("valume off");
    id.style.color = "grey";
  }
}
function playGunSound(soundPath) {
  if (isSoundOn) {
    var audio = new Audio(soundPath);
    audio.play();
  } else {
  }
}
function ge() {
  if (!onloadSpoke) {
    textToSpeech(arrayOfVoieMsgs[0]);
    onloadSpoke = true;
  }
  const el = document.createElement("div");
  el.setAttribute("id", "el" + count);
  el.setAttribute("class", "ball");
  arrayOfEl.push("el" + count);
  count++;
  document.body.appendChild(el);
  var left = getElPos(ball, "left");
  el.style.left = left + "px";
  var audio = new Audio("assets/gunsound.mp3");
  audio.play();
}
function addTheBomb() {
  alert("bomibng them");
}
function moveTheBomb() {
  alert("granade");
}
function moveRightSide() {
  //  playGunSound('assets/vibrate.mp3');
  var left = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));
  ball.style.left = left + 20 + "px";
}
function moveLeftSide() {
  // playGunSound('assets/vibrate.mp3');
  var left = parseInt(window.getComputedStyle(ball).getPropertyValue("left"));
  ball.style.left = left - 20 + "px";
}
function generateHumans(el) {
  el.setAttribute("class", "fa");
  el.classList.add("fa-user-alt");
  el.style.color = "black";
  el.style.fontSize = "50px";
  const content = document.createTextNode("Humans");
  const name = "human";
  return {
    el,
    content,
    name,
  };
}
function generateVirus(el) {
  const content = document.createTextNode("corona virus");
  el.setAttribute("class", "fa");
  el.classList.add("fa-virus");
  el.style.color = "black";
  el.style.fontSize = "50px";
  const name = "corona";

  return {
    el,
    content,
    name,
  };
}
function generateVirusAndHumans() {
  const virus = document.createElement("div");
  const i = document.createElement("i");

  let newEl;

  if (Math.floor(Math.random() * 2)) {
    newEl = generateVirus(i);
  } else {
    //newEl = generateHumans(i);
    newEl = generateVirus(i);
  }
  const { el, content, name } = newEl;
  virus.appendChild(el);
  virus.setAttribute("class", "virus");
  const bkColor =
    virusBkColors[Math.floor(Math.random() * virusBkColors.length)];
  // virus.classList.add(bkColor);
  virus.classList.add(name);
  //virus.setAttribute('id','virus'+count);
  virus.setAttribute("id", "virus" + count);
  el.style.color = bkColor;

  //virus.appendChild(content);
  document.body.appendChild(virus);
  arrayOfVirus.push("virus" + count);
  virusCount++;
  count++;
  let randomLeft = Math.floor(Math.random() * window.innerWidth - 200 + 100);
  if (randomLeft <= 0) {
    randomLeft = 100;
  }
  virus.style.left = randomLeft + "px";
  //setTimeout(generateVirus,2000);
}
function activateVaccine() {
  vacineActivated ? removeVaccine() : injectVaccine();
}
function removeVaccine() {
  vacineActivated = false;
  document.getElementById("vaccine").remove();
  playGunSound(audioSounds[0]["filePath"]);
}
function injectVaccine() {
  const vaccineEl = document.createElement("div");
  vaccineEl.setAttribute("id", "vaccine");
  vaccineEl.setAttribute("class", "vaccineClass");
  vaccineEl.innerText = "Vaccine Applied";
  document.body.appendChild(vaccineEl);
  vacineActivated = true;
  //textToSpeech('vaccine injected. Now cool');
  playGunSound(audioSounds[0]["filePath"]);
}
function stopAndResumeGame() {
  cancelAnimationFrame(cancelFrame);
  requestAnimationFrame(runRequestFrameAnimation);
}
function activateMultipleFire() {
  const twoBullete = document.getElementById("twobullete");
  multipleFire = !multipleFire;
  twoBullete.style.color = (multipleFire && "maroon") || "grey";
}
generateVirusAndHumans();

document.addEventListener("keydown", enterKeyPressed);
//document.addEventListener('click',enterKeyPressed);
