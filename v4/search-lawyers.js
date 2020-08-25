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
         selectedSpecialty: '',
         isResultsBoxOpened: true
      };
      console.log(this);
      // Récupération de la liste des spécialités
      this.getSpecialities().then((spe) => this.setState({ specialties: spe }))
   }

   /**** 1- EVENEMENT UTILISATEURS *****/
   /**********************************/

   /*
      handleKeyupOnUserSearch(e)
      Role: afficher la liste des suggestions specialités et avocats, 
            quand l'utilisateur saisi dans input recherche
      @param : event
   */
   async handleChangeOnUserSearch(ev) {
      // e.persist(); https://fr.reactjs.org/docs/events.html
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

   /*
      searchLawyers(ev)
      Role : lorsque l'utilisateur clique sur le bouton rechercher
      @params : event
   */
   async searchLawyers(ev) {
      ev.preventDefault();
      // 1 recuperer la saisie utilisateur
      let userSearchTerm = this.state.userSearchString;
      this.setState({ isLoading: true });
      // 2 Faire la requete API (recuperer la liste des avocats)
      let companiesFromApi = await this.onSearchGetLawyers(userSearchTerm)
      // request is end, so set isLoading to FALSE
      this.setState({ isLoading: false })
      // 3 Set lawyers value  with response of api call
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
      Role : Remplir le champ input / La fonction est déclenché 
             quand l'utilisateur clique sur une spécialité dans la liste
      @Param : str - une chaine de caractère représentant une spécialité (ex: Droit Immobilier)
             
   */
   setInputValue(str) {
      // setter le champ input avec la valeur str
      this.setState({ userSearchString: str });
      this.setState({ isResultsBoxOpened: false })
   }

   /*
      getUrlFullName
      @Param : nom,  prenom (string)
      Return a formatted fullName (ex: rouve-jean-paul)
   */
   getFullName(nom, prenom) {
      let lastname = nom.trim().length > 0 ? nom.toLowerCase().replace(' ', '-') : '';
      let firstname = prenom.trim().length > 0 ? prenom.toLowerCase().replace(' ', '-') : ''
      return lastname.length > 0 ? lastname + '-' + firstname : firstname;
   }

   /*
     getLinkToProfileUrl(city, lastname, firstname)
      @Param : city, lastname, firstname (string)
      Return a formatted link (ex: /paris/rouve-jean-paul)
   */
   getLinkToProfileUrl(city, lastname, firstname) {
      return '/' + city.toLowerCase().replace(' ', '-') + '/' + this.getFullName(lastname, firstname);
   }



   /************ 2- PARTIE VUE (render()) *****************/
   /****************************************************/
   render() {
      return (
         <div className="grix xs1 sm2 container d-block">
            <h1 className="font-w600">Recherchez un avocat</h1>
            <div className="form-field">
               <form>
                  {(this.state.isLoading && this.state.userSearchString.trim().length > 0) ?
                     <div className="spinner small txt-blue w50">
                        <svg viewBox="25 25 50 50"><circle className="spinner-path" cx="50" cy="50" r="20" fill="none" strokeWidth="3" /></svg>
                     </div> : ""
                  }
                  {/* <span className="searchIcon" dangerouslySetInnerHTML={{ __html: searchIcon }}></span> */}
                  <span className="searchIcon"><i className="fas fa-search"></i></span>
                  <div className="d-flex align-center">
                     <input value={this.state.userSearchString} className="form-control rounded-1" placeholder='avocat, cabinet, domaine juridique...'
                        onFocus={() => this.handleFocusOpenResultsBox()}
                        onChange={e => this.handleChangeOnUserSearch(e)} />
                  </div>
                  {/* SI L'UTILISATEUR EST focus dans l'input de recherche on affiche la div.results */}
                  {this.state.isResultsBoxOpened == true ?
                     <div className="results">

                        {/* LIST DES SPECIALITÉS */}
                        <ul className="spe">
                           {this.state.suggestedSpecialties.map(suggest =>
                              <li onClick={() => this.setInputValue(suggest.displayFrFr)} key={suggest.id}>{suggest.displayFrFr}</li>)}
                        </ul>

                        {(this.state.suggestedSpecialties.length != 0 && this.state.lawyers.length != 0) && <hr />}

                        {/* LIST DES ACOVATS */}
                        <ul className="lawyers">
                           {this.state.lawyers.map((lawyer) =>
                              <li key={lawyer.id}>
                                 <a href={this.getLinkToProfileUrl(lawyer.workAddressCity, lawyer.lastName, lawyer.firstName)}>
                                    <div className="d-flex align-center">
                                       {lawyer.user == undefined || lawyer.user.profilePictureUrl == undefined ? <img src="icon-defaultprofilepicture.png" /> : <img src={lawyer.user.profilePictureUrl} />}
                                       <span className="d-flex dir-column">
                                          {lawyer.lastName} {lawyer.firstName}
                                          <span className="city mr"> <strong>{lawyer.cabName}</strong>  {lawyer.workAddressCity}</span>
                                       </span>
                                    </div>
                                 </a>
                              </li>)
                           }
                        </ul>

                     </div>
                     : ""
                  }
                  {/* <div className="form-field">
                     <button type="submit" className="btn shadow-1 rounded-1 outline txt-blue" >
                        <span className="outline-text">Rechercher</span>
                     </button>
                  </div> */}
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
         'Authorization': 'Bearer ' + ENV_TOKENJESS,
         'Content-Type': 'application/json'
      });
      // make api call to get lawyers array
      let response = await fetch(
         'https://staging.app.feedbacklawyers.com/api/specialties',
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
         'Authorization': 'Bearer ' + ENV_TOKENJESS,
         'Content-Type': 'application/json'
      });
      // make api call to get lawyers array
      let response = await fetch(
         'https://staging.app.feedbacklawyers.com/api/companies/search?pattern=' + userSearchStr,
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