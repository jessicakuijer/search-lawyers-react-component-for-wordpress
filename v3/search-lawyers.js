'use strict';
class SearchLawyers extends React.Component {

   constructor(props) {
      super(props);
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
      this.getSpecialities().then((spe) => this.setState({ specialties: spe }))
   }


   async handleKeyupOnUserSearch(e) {
      let userSearch = e.target.value;
      console.log(userSearch);
      // si la recherche utilisateur est un domaine de compétences connu ou un avocat connu 
      if (userSearch.length < 2) {
         this.setState({ suggestedSpecialties: [], lawyers: [] });
      }
      else {
         let suggestedSpe = this.state.specialties.filter(s =>
            s.displayFrFr.toLowerCase().includes(userSearch.toLowerCase())
         );
         this.setState({ userSearchString: userSearch, suggestedSpecialties: suggestedSpe });
         this.setState({ isLoading: true });
         let suggestedLawyers = await this.onSearchGetLawyers(userSearch);
         this.setState({ isLoading: false });

         this.setState({ lawyers: suggestedLawyers });
         console.log(this.state);
      }
   }


   async searchLawyers(ev) {
      ev.preventDefault();
      console.log(this.state);
      //console.log("kjhkjhkjh")
      //1 recuperer la saisie utilisateur
      let userSearchTerm = this.state.userSearchString;

      this.setState({ isLoading: true });
      // 2 Faire la requete API (recuperer la liste des avocats)
      // set headers of the ajax request
      let companiesFromApi = await this.onSearchGetLawyers(userSearchTerm)
      console.log(companiesFromApi);
      // request is end, so set isLoading to FALSE
      this.setState({ isLoading: false })
      // 3 Set lawyers value  with response of api call
      this.setState({ lawyers: companiesFromApi })

   }

   handleBlurCloseResultsBox() {
      this.setState({ isResultsBoxOpened: false })
   }

   handleFocusOpenResultsBox() {
      this.setState({ isResultsBoxOpened: true })
   }

   render() {
      console.log('law : ', this.state.lawyers)
      return (

         <div className="grix xs1 sm2 container d-block">
            <h1 className="font-w600">Recherchez un avocat</h1>
            <div className="form-field">
               <form onSubmit={(e) => this.searchLawyers(e)}>

                  {(this.state.isLoading && this.state.userSearchString.trim().length > 0) ?
                     <div className="spinner small txt-blue w50">
                        <svg viewBox="25 25 50 50"><circle className="spinner-path" cx="50" cy="50" r="20" fill="none" strokeWidth="3" /></svg>
                     </div> : ""
                  }
                  {/* <span className="searchIcon" dangerouslySetInnerHTML={{ __html: searchIcon }}></span> */}
                  <span className="searchIcon"><i className="fas fa-search"></i></span>
                  <div className="d-flex align-center">

                     <input onBlur={() => this.handleBlurCloseResultsBox()} onFocus={() => this.handleFocusOpenResultsBox()}
                        onKeyUp={e => this.handleKeyupOnUserSearch(e)}
                        className="form-control rounded-1" placeholder='avocat, cabinet, domaine juridique...' />

                  </div>

                  {/* SI IL Y A DES RESULTATS ON AFFICHE div.results  */}
                  {this.state.isResultsBoxOpened == true ?
                     <div className="results">

                        {/* LISTE DES SPECIALITÉS */}
                        <ul className="spe">
                           {this.state.suggestedSpecialties.map(suggest =>
                              <li key={suggest.id}>{suggest.displayFrFr}</li>)}
                        </ul>

                        {(this.state.suggestedSpecialties.length != 0 && this.state.lawyers.length != 0) && <hr />}

                        {/* LISTE DES AVOCATS */}
                        <ul className="lawyers">
                           {this.state.lawyers.map((lawyer) =>
                              <li data-url={'list.html/' + lawyer.workAddressCity + '/' + lawyer.lastName + '-' + lawyer.firstName} key={lawyer.id}>
                                 <div className="d-flex align-center">
                                    {lawyer.user == undefined || lawyer.user.profilePictureUrl == undefined ? <img src="icon-defaultprofilepicture.png" /> : <img src={lawyer.user.profilePictureUrl} />}
                                    <span className="d-flex dir-column">
                                       {lawyer.lastName} {lawyer.firstName}
                                       <span className="city mr"> <strong>{lawyer.cabName}</strong>  {lawyer.workAddressCity}</span>
                                    </span>
                                 </div>

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


   /*********
    API CALLS
   **********/

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

      let myHeaders = new Headers({
         'Authorization': 'Bearer ' + ENV_TOKENJESS,
         'Content-Type': 'application/json'
      });
      console.log('Recherche user: ', userSearchStr);
      /*
      si la recherche est un spécialité alors call aPI .....speciality[]=12
      si la recherche est un nom alors le call api .... '&pattern='+userSearchTerm
      */
      // make api call to get lawyers array
      let response = await fetch(
         'https://staging.app.feedbacklawyers.com/api/companies/search?pattern=' + userSearchStr,
         //+
         //'&pattern='+userSearchTerm,
         {
            headers: myHeaders,
            method: 'GET'
         });
      let res = await response.json();
      return res.companies;
   }


} // FIN DE LA CLASS

const domContainer = document.querySelector('#search-lawyers-container'); //  <div id="search-lawyers-container"></div>
// ReactDOM.render(e(SearchLawyers), domContainer);
ReactDOM.render(< SearchLawyers />, domContainer)