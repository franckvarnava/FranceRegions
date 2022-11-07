/* FICHIER JAVASCRIPT */

// ce double slash vous permet de mettre en commentaires ce que vous voulez...

/* et la version
slash étoile pour
commenter plusieurs lignes ! */

// attend que la page HTML soit complètement "construite" avant d'appeler les fonctions qui vont remplir les listes
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM entièrement chargé et analysé");
    // crée et met à jour le header gauche avec le jour de la semaine et la date du jour
    let dateDuJour = new Date();
    // crée le jour de la semaine
    let indiceDuJourDeLaSemaine = dateDuJour.getDay();
    let jourTabFr = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    // crée la date du jour au format "local" donc français
    let dateDuJourFormat = dateDuJour.toLocaleDateString();
    document.getElementById("headerLeft").innerHTML = jourTabFr[indiceDuJourDeLaSemaine] + "<br />" + dateDuJourFormat;
    // crée et met à jour le header droite avec l'heure actuelle
    let heureDuJourFormat = dateDuJour.toLocaleTimeString();
    document.getElementById("headerRight").textContent = heureDuJourFormat;
    // lance une fonction toutes les 1000 millisecondes (donc toutes les secondes) pour rafraîchir le contenu du header droite
    // à noter que si vous mettez moins que 1000 ms en rafraîchissement, ça ne change pas la justesse de l'heure...
    var intervalID = setInterval(function() {
        let dateDuJour = new Date();
        let heureDuJourFormat = dateDuJour.toLocaleTimeString();
        document.getElementById("headerRight").textContent = heureDuJourFormat;
    }, 1000);
});

var contexte = "";
var requestURL = "";

// appelle l'API pour récupérer les data
function callAPI (contexte, requestURL) {
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var obj = request.response;
        // console.log (obj);
        if (obj != null) {
            switch (contexte) {
                case 'GET_REGION':
                remplirListe("listeRegions", populerListeDepartements, "Toutes les régions de France", obj);
                break;
                case 'GET_DEPT':
                remplirListe("listeDepartements", populerListeCommunes, "Tous les départements", obj);
                break;
                case 'GET_COMMUNE':
                remplirListe("listeCommunes", afficherCommune, "Toutes les communes", obj);
                break;
                case 'GET_DETAIL_COMMUNE':
                afficheDetailCommune(obj);
                break;
                default:
                console.log(`Le contexte est inconnu : ${contexte}.`);
            }
        }
        else {
            console.log(`Aucune réponse.`);
        }
    }
};

// crée et met à jour la liste déroulante des régions
function populerListeRegions() {
    // appelle la fonction générique qui crée et met à jour la liste déroulante des régions
    contexte = "GET_REGION";
    requestURL = 'https://geo.api.gouv.fr/regions';
    if (requestURL.length > 0) {
        callAPI (contexte, requestURL);
    }
};

// crée et met à jour la liste déroulante des départements
function populerListeDepartements() {
    // récupère la valeur de l'attribut "value" dans l'option sélectionnée de la liste des régions
    var selectList = document.getElementById("listeRegions");
    var selectElement = selectList.value;
    // appelle la fonction générique qui crée et met à jour la liste déroulante des départements
    contexte = "GET_DEPT";
    requestURL = 'https://geo.api.gouv.fr/regions/' + selectElement + '/departements';
    if (requestURL.length > 0) {
        callAPI (contexte, requestURL);
    }
};

// crée et met à jour la liste déroulante des communes
function populerListeCommunes() {
    // récupère la valeur de l'attribut "value" dans l'option sélectionnée de la liste des départements
    var selectList = document.getElementById("listeDepartements");
    var selectElement = selectList.value;
    // appelle la fonction générique qui crée et met à jour la liste déroulante des communes
    contexte = "GET_COMMUNE";
    requestURL = 'https://geo.api.gouv.fr/departements/' + selectElement + '/communes';
    if (requestURL.length > 0) {
        callAPI (contexte, requestURL);
    }
};

// fonction générique qui crée et met à jour les listes déroulantes avec 4 arguments en entrée
function remplirListe(idListe, fctOnChange, placeholderListe, dataTab) {
    var formul = document.getElementById("formul");
    // supprime les listes existantes pour les recréer ensuite
    var idListeTab = ["listeRegions", "listeDepartements", "listeCommunes"];
    for(let i = idListeTab.indexOf(idListe); i < idListeTab.length; i++) {
        if (document.getElementById(idListeTab[i])) {
            document.getElementById("formul").removeChild(document.getElementById(idListeTab[i]));
            document.getElementById("formul").removeChild(document.getElementById("para" + idListeTab[i]));
        }
    };
    // création de la liste concernée
    var select = document.createElement("select");
    select.id = idListe;
    select.onchange = fctOnChange;
    formul.appendChild(select);
    // création de l'élément option qui sert de placeholder
    var option = document.createElement("option");
    option.textContent = placeholderListe;
    select.appendChild(option);
    // création des éléments options de la liste
    for(let i = 0; i < dataTab.length; i++) {
        var option = document.createElement("option");
        option.textContent = dataTab[i].nom;
        option.value = dataTab[i].code;
        select.appendChild(option);
    };
    // création du paragraphe vide sous la liste et associé à cette liste par un id précis
    var paraVide = document.createElement("p");
    paraVide.id = "para" + idListe;
    formul.appendChild(paraVide);
};

// met à jour le panneau de droite avec la commune sélectionnée et son code postal
function afficherCommune() {
    var listeCommunes = document.getElementById("listeCommunes");
    // appelle la fonction qui met à jour la div de droite pour la commune sélectionnée
    contexte = "GET_DETAIL_COMMUNE";
    requestURL = 'https://geo.api.gouv.fr/communes/' + listeCommunes.value + '?fields=code,nom,surface,population,centre,codesPostaux';
    if (requestURL.length > 0) {
        callAPI (contexte, requestURL);
    }
};

// met à jour le panneau de droite avec la commune sélectionnée et son code postal
function afficheDetailCommune(obj) {
    console.log(obj);
    //
    var recapCommune = document.getElementById("recapCommune");
    recapCommune.textContent = obj.nom;
    //
    var recapCodePostal = document.getElementById("recapCodePostal");
    if (obj.codesPostaux.length > 1) {
        var codesPostauxListe = "Codes postaux : ";
        for(let i = 0; i < obj.codesPostaux.length; i++) {
            if(i == obj.codesPostaux.length - 1) {
                codesPostauxListe += obj.codesPostaux[i];
            } else {
                codesPostauxListe += obj.codesPostaux[i] + " / ";
            }
        }
        recapCodePostal.textContent = codesPostauxListe;
    } else {
        recapCodePostal.textContent = "Code postal : " + obj.codesPostaux[0];
    }
    //
    var recapPopulation = document.getElementById("recapPopulation");
    recapPopulation.textContent = "Population : " + obj.population + " habitants";
    //
    var recapSurface = document.getElementById("recapSurface");
    recapSurface.textContent = "Superficie : " + obj.surface + " hectares";
    //
    var recapMap = document.getElementById("recapMap");
    recapMap.textContent = "Coordonnées : " + obj.centre.coordinates;
    //
    afficheCarte(obj.centre.coordinates[1],obj.centre.coordinates[0]);
};

// affiche la carte
function afficheCarte(latitude, longitude) {
    var mapid = document.getElementById("mapid");
    if (document.getElementById("mapidChild")) {
        document.getElementById("mapid").removeChild(document.getElementById("mapidChild"));
    }
    var mapidChild = document.createElement("div");
    mapidChild.id = "mapidChild";
    mapid.appendChild(mapidChild);
    var map = L.map("mapidChild").setView([latitude, longitude], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
};
