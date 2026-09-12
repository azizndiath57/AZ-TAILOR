const fs = require('fs');
const path = require('path');

const frPath = path.join(__dirname, 'messages', 'fr.json');
const woPath = path.join(__dirname, 'messages', 'wo.json');

const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const woData = JSON.parse(fs.readFileSync(woPath, 'utf8'));

frData.Landing.Navbar = {
  solutions: "Fonctionnalités",
  tarifs: "Tarifs",
  ateliers: "Ateliers",
  blog: "Blog",
  login: "Connexion",
  startFree: "Commencer gratuitement"
};

woData.Landing.Navbar = {
  solutions: "Melokaan yi",
  tarifs: "Njëg yi",
  ateliers: "Atelye yi",
  blog: "Xibaar yi",
  login: "Duggu",
  startFree: "Tambali ci lu amul njëg"
};

fs.writeFileSync(frPath, JSON.stringify(frData, null, 2));
fs.writeFileSync(woPath, JSON.stringify(woData, null, 2));

console.log("Navbar keys fixed.");
