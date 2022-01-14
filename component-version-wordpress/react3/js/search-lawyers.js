'use strict';
class SearchLawyers extends React.Component {

   constructor(props) {
      super(props);
      /* 
         l'objet state du component
         https://fr.reactjs.org/docs/faq-state.html
      */
      this.state = {
         isLoading: false,
         lawyers: [],
         suggestedSpecialties: [],
         specialties: [],
         userSearchString: '', // la recherche de l'utilisateur dans l'input
         idSelectedSpecialty: '',
         selectedSpecialty: '',
         selectedCity : '',
         isResultsBoxOpened: true,
         placesAutocomplete: {}
      };
      console.log("Je suis le constructor : ", this);
      // Récupération de la liste des spécialités
      this.getSpecialities().then((spe) => this.setState({ specialties: spe }))
   }

   componentDidMount() {
      console.log("Je suis le componentDidMount : ");
      this.getCityOnKeyup();
      //this.state.placesAutocomplete.on('change', () => {console.log(placesAutocomplete)});
   }

   /**** 1- EVENEMENT UTILISATEURS *****/
   /**********************************/

   /*
      handleKeyupOnUserSearch(e)
      Role: afficher la liste des suggestions specialités et avocats, 
            quand l'utilisateur saisit dans input recherche
      @param : event
   */
   async handleChangeOnUserSearch(ev) {
      // https://fr.reactjs.org/docs/events.html
      this.setState({ userSearchString: ev.target.value });
      let userSearch = this.state.userSearchString;
      if (userSearch.length < 2) {
         this.setState({ suggestedSpecialties: [], lawyers: [] });
      }
      else {
         let suggestedSpe = this.state.specialties.filter(s =>
            s.displayFrFr.toLowerCase().includes(userSearch.toLowerCase())
         );
         this.setState({ suggestedSpecialties: suggestedSpe });
         this.setState({ isLoading: true });
         let suggestedLawyers = await this.onSearchGetLawyers(userSearch);
         this.setState({ isLoading: false });
         this.setState({ lawyers: suggestedLawyers });
         // console.log(this.state);
      }
   }

   handleChangeOnCityInput(ev) {
      // console.log(ev.target.value);
      this.setState({ selectedCity: ev.target.value});
   }

   /*
      role : naviguer vers la page de liste des avocats (par specialité et par ville)
      url : /lawyer-list/?specialty=26&city=paris
   */
   handleClickOnSearchLawyers(ev) {
      // couper le comportement par défaut du bouton submit
      ev.preventDefault();
      let url = 'https://www.feedbacklawyers.com/lawyers-list/?specialty='+this.state.idSelectedSpecialty+'&city='+this.state.selectedCity.toLowerCase();
      window.location.href= url;
   }

   /*
      searchLawyers(ev)
      Role : lorsque l'utilisateur clique sur le bouton rechercher
      @params : event
   */
   async searchLawyers(ev) {
      // couper le comportement par défaut
      ev.preventDefault();
      // 1 recuperer la saisie utilisateur
      let userSearchTerm = this.state.userSearchString;
      this.setState({ isLoading: true });
      // 2 Faire la requete API (recuperer la liste des avocats)
      let companiesFromApi = await this.onSearchGetLawyers(userSearchTerm)
      // request is end, so set isLoading to FALSE
      this.setState({ isLoading: false })
      // 3 Set lawyers value with response of api call
      this.setState({ lawyers: companiesFromApi })
   }

   /*
      handleBlurCloseResultsBox()
      Role : fermer la liste des résultats sous le champ input
             en mettant à jour isResultsBoxOpened = false
   */
   handleBlurCloseResultsBox() {
      this.setState({ isResultsBoxOpened: false })
   }

   /*
      handleBlurCloseResultsBox()
      Role : ouvrir la liste des résultats sous le champ input
             en mettant à jour isResultsBoxOpened = true
   */
   handleFocusOpenResultsBox() {
      this.setState({ isResultsBoxOpened: true })
   }

   /*
      setInputValue(str)
      Role : Remplir le champ input / La fonction est déclenchée 
             quand l'utilisateur clique sur une spécialité dans la liste
      @Param : str - une chaine de caractère représentant une spécialité (ex: Droit Immobilier)
             
   */
   setInputValue(str, idSelectedSpecialty) {
      //console.log('ID: ', idSelectedSpecialty);
      // setter le champ input avec la valeur str
      this.setState({ userSearchString: str });
      this.setState({ idSelectedSpecialty: idSelectedSpecialty});
      this.setState({ isResultsBoxOpened: false })
   }

   /*
      getUrlFullName
      @Param : nom,  prenom (string)
      Return a formatted fullName (ex: rouve-jean-paul)
   */
   getFullName(nom, prenom) {
      let lastname = nom.trim().length > 0 ? nom.toLowerCase().trim().replace(' ', '-') : '';
      let firstname = prenom.trim().length > 0 ? prenom.toLowerCase().trim().replace(' ', '-') : ''
      return lastname.length > 0 ? lastname + '-' + firstname : firstname;
   }

   /*
     getLinkToProfileUrl(city, lastname, firstname)
      @Param : city, lastname, firstname (string)
      Return a formatted link (ex: /paris/rouve-jean-paul)
   */
   getLinkToProfileUrl(city, lastname, firstname, id) {
      return 'lawyers?city=' + city.toLowerCase().trim().replace(' ', '-') + '&lawyerfullname=' + this.getFullName(lastname, firstname) + '&lawyerid=' +id;
     // return '/' + city.toLowerCase().replace(' ', '-') + '/' + this.getFullName(lastname, firstname);
   }

   /*
      Fonction "capitalize" pour la ville, première lettre en majuscules
   */
  getCapitalize(str) {
     // 1: recupérer la première lettre, la mettre en majuscule
     let first = str.charAt(0).toUpperCase();
     // 2: récuperer toutes les autres lettres, les mettre en minuscules
     let rest = str.substring(1).toLowerCase();
     // 3: concaténer 1ere lettre et les autres et return 
     return first+rest;
  }

  /*
    Suggestion des villes
  */
   getCityOnKeyup() {
      this.setState({placesAutocomplete: places({
         // appId: '<YOUR_PLACES_APP_ID>',
         // apiKey: '<YOUR_PLACES_API_KEY>',
         container: document.querySelector('#ville'),
         templates: {
            value: function(suggestion) {
               return suggestion.name;
            
            }
         }
         }).configure({
         type: 'city',
         aroundLatLngViaIP: false,
         countries: ['fr','be']
         })})
   }

 
   /************ 2- PARTIE VUE (render()) *****************/
   /****************************************************/
   render() {
      return (
         <div className="container-fluid">
            <h1>Recherchez un avocat</h1>
            <h3 class="md-25">(Remplir impérativement les deux champs pour une recherche par domaine de compétences et ville)</h3>
            <div>
               <form className="d-flex justify-content-center">
                  {(this.state.isLoading && this.state.userSearchString.trim().length > 0) ?
                     <div className="spinner">
                        <img src="/react3/images/spinner.gif"/>
                     </div> : ""
                  }
                 
                
                 
                     <div className="flex-sm-fill">
                        <input value={this.state.userSearchString} className="form-control" placeholder='Avocat, domaine de compétences...'
                        onFocus={() => this.handleFocusOpenResultsBox()}
                        onChange={e => this.handleChangeOnUserSearch(e)} />

                        {/* LISTE RESULTATS */}
                        {/* SI L'UTILISATEUR EST focus dans l'input de recherche on affiche la div.results */}
                        {this.state.isResultsBoxOpened == true ?
                           <div className="results">

                              {/* LISTE DES SPECIALITÉS */}
                              <ul className="spe">
                                 {this.state.suggestedSpecialties.map(suggest =>
                                    <li onClick={() => this.setInputValue(suggest.displayFrFr, suggest.id)} key={suggest.id}>{suggest.displayFrFr}</li>)}
                              </ul>

                              {(this.state.suggestedSpecialties.length != 0 && this.state.lawyers.length != 0) && <hr />}

                              {/* LISTE DES AVOCATS */}
                              <ul className="lawyers">
                                 {this.state.lawyers.map((lawyer) =>
                                    <li key={lawyer.id}>
                                       <a href={this.getLinkToProfileUrl(lawyer.workAddressCity, lawyer.lastName, lawyer.firstName, lawyer.id)} target="_blank">
                                          <div className="d-flex align-center">
                                             {lawyer.user == undefined || lawyer.user.profilePictureUrl == undefined ? <img src="/react3/images/icon-defaultprofilepicture.png" /> : <img src={lawyer.user.profilePictureUrl} />}
                                             <span className="d-flex dir-column">
                                                {lawyer.lastName} {lawyer.firstName}
                                                <span className="city mr"> <strong>{lawyer.cabName}</strong>  {lawyer.workAddressCity}, {lawyer.workAddressCountry}</span>
                                                <span className="city mr"> <strong>{lawyer.ratings.reviewsCount} avis certifié(s)</strong></span>   
                                             </span>
                                          </div>
                                       </a>
                                    </li>)
                                 }
                              </ul>

                           </div>
                           : ""
                        }
                     </div>
                  
                     <div className="flex-fill">
                        <input id="ville" onChange={(e) => this.handleChangeOnCityInput(e)} className="form-control" placeholder='Ville' />
                     </div>
                     

                     <div className="flex-fill">                   
                        <button onClick={(ev) => this.handleClickOnSearchLawyers(ev)} data-href='' type="submit" className="btn btn-search-lawyers" >
                        
                           <span className="outline-text white2">Rechercher</span>
                        </button>              
                     </div>
                 
               </form>
            </div>
         </div>
      );
   }


   /**********************************
   3- PARTIE ACCES AUX DATA : API CALLS
   **********************************/
   /*
    getSpecialities()
    Role : récuperer la liste des specialités
   */
   async getSpecialities() {
      let myHeaders = new Headers({
         'Authorization': 'Bearer d68406ad89cf138517e85a0cb1d25589:6d27a26c0f1cb45e4541088de4abd7ba76e44b784ea11519070a917dbe2ad24d730a45d571041ad5e115bd2f5e385188ae551d26e35a588f574056fecab35733912948795001ed5a4900f935ec7a9a20da07a8861e74a11b01687d2ac81232c29343bc018b14e0fbd8d9d2a809684160',
         'Content-Type': 'application/json'
      });
      // make api call to get lawyers array
      let response = await fetch(
         'https://app.feedbacklawyers.com/api/specialties',
         {
            headers: myHeaders,
            method: 'GET'
         });
      let res = await response.json();
      return res.specialties;
   }

   /*
      selectSpecialty(event)
      Role : déterminer l'id de la specialité selectionnée
   */
   selectSpeciality(event) {
      console.log(event.target.value);
      this.setState({ selectedSpecialty: event.target.value });
   }

   /*
    onSearchGetLawyers(userSearchTerm)
    Role : récuperer la liste des avocats lors de la recherche
    @param : userSearchTerm:string
   */
   async onSearchGetLawyers(userSearchStr) {
      // Configurer le headers de la requête à envoyer
      let myHeaders = new Headers({
         'Authorization': 'Bearer d68406ad89cf138517e85a0cb1d25589:6d27a26c0f1cb45e4541088de4abd7ba76e44b784ea11519070a917dbe2ad24d730a45d571041ad5e115bd2f5e385188ae551d26e35a588f574056fecab35733912948795001ed5a4900f935ec7a9a20da07a8861e74a11b01687d2ac81232c29343bc018b14e0fbd8d9d2a809684160',
         'Content-Type': 'application/json'
      });
      // make api call to get lawyers array
      let response = await fetch(
         'https://app.feedbacklawyers.com/api/companies/search?pattern=' + userSearchStr,
         {
            headers: myHeaders,
            method: 'GET'
         });
      let res = await response.json();
      return res.companies;
   }

} // FIN DE LA CLASS


// AJOUTER LE COMPONENT
const domContainer = document.querySelector('#search-lawyers-container'); //  <div id="search-lawyers-container"></div>
// ReactDOM.render(e(SearchLawyers), domContainer);
ReactDOM.render(< SearchLawyers />, domContainer)




