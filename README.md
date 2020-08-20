# search-lawyers-react-component-for-wordpress
![ScreenShot](https://github.com/jessicakuijer/search-lawyers-react-component-for-wordpress/blob/master/screenshot.PNG)
 Création composant react intégré à Wordpress selon tutoriel: https://fr.reactjs.org/docs/add-react-to-a-website.html

- code HTML intégré dans une page wordpress et fichier js rajouté dans un dossier /react sur serveur du site wordpress, au même endroit que wp-admin/wp-content/wp-includes
- Modification du permalien de la page utilisée vers le chemin du dossier /react/nomdelapage


 
 1. Clone repository
 2. Ouvrir js file et aller sur {/* AFFICHER LA LISTE DES RESULTATS */}
 3. J'ai mis volontairement des TODOs car ce sont mes points de blocages
 4. Quand vous testerez le composant en ouvrant le fichier html, cherchez "john" (John Lancaster) ou Gery (Gery Tang Seng)
 - le composant se base sur la version STAGING de l'api avec ces faux avocats, profils complets avec un commentaire.
 - les champs vides du resultat correspondent à mes points de blocage
 5. Questions:
 - Comment afficher la photo à partir d'une Uri?
 - Comment afficher la ou les langues parlées sachant que celle(s)-ci apparait dans un array json?
 - Comment afficher une phrase disant que l'avocat propose l'aide juridictionnelle?
 - Comment afficher/transformer le format de date?
