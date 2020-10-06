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
<body>

   <div id="search-lawyers-container">
      <!-- ICI S'AFFICHE LE COMPOSANT REACT  -->
   </div>


   <!-- footer.php-->

   <!-- Charge React -->
   <!-- Remarque : pour le déploiement, remplacez "development.js" par "production.min.js" -->
   <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
   <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
   <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

   <!-- Charge notre composant React -->
   <script type="text/babel" src="search-lawyers.js"></script>

   <!-- Charge MomentJS de React pour afficher une date en format lisible -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment.min.js" integrity="sha512-rmZcZsyhe0/MAjquhTgiUcb4d9knaFc7b5xAfju483gbEXTkeJRUMIPk6s3ySZMYUHEcjKbjLjyddGWMrNEvZg==" crossorigin="anonymous"></script>

</body>
