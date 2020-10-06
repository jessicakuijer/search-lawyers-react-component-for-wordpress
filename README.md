# search-lawyers-react-component-for-wordpress
- Version 1:
![ScreenShot](https://github.com/jessicakuijer/search-lawyers-react-component-for-wordpress/blob/master/screenshot.PNG)

- Version 2/3: 
![ScreenShot](https://github.com/jessicakuijer/search-lawyers-react-component-for-wordpress/blob/master/screenshot2.png)

- Version 4:
![ScreenShot](https://github.com/jessicakuijer/search-lawyers-react-component-for-wordpress/blob/master/screenshot3.png)

 Création composant react intégré à Wordpress selon tutoriel: https://fr.reactjs.org/docs/add-react-to-a-website.html

- code HTML intégré dans une page wordpress et fichier js rajouté dans un dossier /react sur serveur du site wordpress, au même endroit que wp-admin/wp-content/wp-includes
- Modification du permalien de la page utilisée vers le chemin du dossier /react/nomdelapage


 
 1. Clone repository
 2. Ouvrir js file et aller sur {/* AFFICHER LA LISTE DES RESULTATS */}
 3. Quand vous testerez le composant en ouvrant les différentes versions via fichier html, cherchez "john" (John Lancaster) ou Gery (Gery Tang Seng)
 - le composant se base sur la version STAGING de l'api avec ces faux avocats, profils complets avec un commentaire type avis client.
 
4. le dossier "component version wordpress" sert à inclure les fichiers au sein d'un thème. Afin d'intégrer le composant, il faut insérer le nécéssaire dans une page HTML comme ceci par exemple:
![ScreenShot](https://github.com/jessicakuijer/search-lawyers-react-component-for-wordpress/blob/master/screenshot4.png)
