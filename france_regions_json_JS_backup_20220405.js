/* FICHIER JAVASCRIPT */

// ce double slash vous permet de mettre en commentaires ce que vous voulez...

/* et la version
slash étoile pour
commenter plusieurs lignes ! */

// attend que la page HTML soit complètement "construite" avant d'appeler les fonctions qui vont remplir les listes
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM entièrement chargé et analysé");
    // populerListeRegions();
    // populerListeDepartementIDF(departementsIDFTab);
});

// crée et met à jour la liste déroulante des régions
function populerListeRegions(Obj) {
    if  (document.getElementById("listeRegions")) {
        alert('Liste des régions déjà créée !');
    } else {
        var formul = document.getElementById("formul");
        var select = document.createElement("select");
        select.id = "listeRegions";
        select.onchange = populerListeDepartementIDF;
        formul.appendChild(select);
        var option = document.createElement("option");
        option.textContent = "Toutes les régions de France";
        select.appendChild(option);
        for(let i = 0; i < regionsTab.length; i++) {
            var option = document.createElement("option");
            option.textContent = regionsTab[i].nom;
            option.value = regionsTab[i].code;
            select.appendChild(option);
        };
        var br = document.createElement("br");
        formul.appendChild(br);
    };
};

// crée et met à jour la liste déroulante des départements d'IDF ou HDF pour le moment...
function populerListeDepartementIDF(Obj) {
    var formul = document.getElementById("formul");
    if (document.getElementById("listeDepartements")) {
        var selectAlreadyHere = document.getElementById("listeDepartements");
        document.getElementById("formul").removeChild(selectAlreadyHere);
    }
    var selectList = document.getElementById("listeRegions");
    var selectElement = selectList.value;
    var selectData = "";
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
    var select = document.createElement("select");
    select.id = "listeDepartements";
    select.onchange = showAlert;
    formul.appendChild(select);
    var option = document.createElement("option");
    option.textContent = "Tous les départements d'IDF";
    select.appendChild(option);
    for(let i = 0; i < selectData.length; i++) {
        var option = document.createElement("option");
        option.textContent = selectData[i].nom;
        option.value = selectData[i].code;
        select.appendChild(option);
    };
};

function remplirListe(idListe, fctOnChange, placeholderListe, dataTab) {
    var formul = document.getElementById("formul");
    var select = document.createElement("select");
    select.id = idListe;
    select.onchange = fctOnChange;
    formul.appendChild(select);
    var option = document.createElement("option");
    option.textContent = placeholderListe;
    select.appendChild(option);
    for(let i = 0; i < dataTab.length; i++) {
        var option = document.createElement("option");
        option.textContent = dataTab[i].nom;
        option.value = dataTab[i].code;
        select.appendChild(option);
    };
}

function showAlert() {
    alert("Evènement de click détecté");
}
