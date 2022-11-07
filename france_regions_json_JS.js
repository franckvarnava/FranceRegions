/* FICHIER JAVASCRIPT */

// ce double slash vous permet de mettre en commentaires ce que vous voulez...

/* et la version
slash étoile pour
commenter plusieurs lignes ! */

// attend que la page HTML soit complètement "construite" avant d'appeler les fonctions qui vont remplir les listes
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM entièrement chargé et analysé");
    // populerListeRegions();
    let dateDuJour = new Date();
    // console.log(dateDuJour);
    let indiceDuJourDeLaSemaine = dateDuJour.getDay();
    let jourTabFr = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    document.getElementById("headerLeft").textContent = jourTabFr[indiceDuJourDeLaSemaine];
    // let dateDuJourFormat = dateDuJour.toUTCString();
    // console.log(dateDuJourFormat);
    let dateDuJourFormat = dateDuJour.toLocaleDateString();
    document.getElementById("headerRight").textContent = dateDuJourFormat;
});

// crée et met à jour la liste déroulante des régions
function populerListeRegions() {
    remplirListe("listeRegions", populerListeDepartements, "Toutes les régions de France", regionsTab);
};

// crée et met à jour la liste déroulante des départements
function populerListeDepartements() {
    // récupère la valeur de l'attribut "value" dans l'option sélectionnée de la liste des régions
    var selectList = document.getElementById("listeRegions");
    var selectElement = selectList.value;
    var selectData = "";
    // charge le bon fichier de données dans la variable selectData selon le code régions sélectionné
    switch (selectElement) {
        case '11':
        selectData = departementsIDFTab;
        break;
        case '32':
        selectData = departementsHDFTab;
        break;
        default:
        selectData = departementsIDFTab;
    };
    // supprime les listes existantes qui viennent après
    var idListePost = "listeCommunes";
    if (document.getElementById(idListePost)) {
        document.getElementById("formul").removeChild(document.getElementById(idListePost));
        document.getElementById("formul").removeChild(document.getElementById("para" + idListePost));
    };
    // appelle la fonction générique qui crée et met à jour la liste déroulante des départements
    remplirListe("listeDepartements", populerListeCommunes, "Tous les départements", selectData);
};

// crée et met à jour la liste déroulante des communes
function populerListeCommunes() {
    // récupère la valeur de l'attribut "value" dans l'option sélectionnée de la liste des départements
    var selectList = document.getElementById("listeDepartements");
    var selectElement = selectList.value;
    var selectData = "";
    switch (selectElement) {
        case '95':
        selectData = communesVDOTab;
        break;
        default:
        selectData = communesVDOTab;
    };
    // appelle la fonction générique qui crée et met à jour la liste déroulante des communes
    remplirListe("listeCommunes", afficherCommune, "Toutes les communes", selectData);
};

// fonction générique qui crée et met à jour les listes déroulantes avec 4 arguments en entrée
function remplirListe(idListe, fctOnChange, placeholderListe, dataTab) {
    var formul = document.getElementById("formul");
    // supprime les listes existantes pour les recréer ensuite
    if (document.getElementById(idListe)) {
        document.getElementById("formul").removeChild(document.getElementById(idListe));
        document.getElementById("formul").removeChild(document.getElementById("para" + idListe));
    }
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
        if (dataTab[i].codesPostaux) {
            option.value = dataTab[i].codesPostaux;
        } else {
            option.value = dataTab[i].code;
        }
        select.appendChild(option);
    };
    // création du paragraphe vide sous la liste et associé à cette liste par un id précis
    var paraVide = document.createElement("p");
    paraVide.id = "para" + idListe;
    formul.appendChild(paraVide);
};

// met à jour le panneau de droite avec la commune sélectionnée et son code postal
function afficherCommune() {
    var recapCommune = document.getElementById("recapCommune");
    var recapCodePostal = document.getElementById("recapCodePostal");
    var listeCommunes = document.getElementById("listeCommunes");
    recapCommune.textContent = listeCommunes.options[listeCommunes.selectedIndex].text;
    if (listeCommunes.value.includes(',')) {
        recapCodePostal.textContent = "Codes postaux : " + listeCommunes.value;
    } else {
        recapCodePostal.textContent = "Code postal : " + listeCommunes.value;
    }  
};
