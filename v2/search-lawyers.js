'use strict';

class SearchLawyers extends React.Component {

   constructor(props) {
      super(props);
      this.state = { 
         isLoading: false, 
         lawyers: [], 
         suggestedSpecialties: [], 
         specialties: [], 
         userSearchString:'', // la recherche de l'utilisateur dans l'input
         selectedSpecialty:'' };
      console.log(this);
      this.getSpecialities().then((spe) => this.setState({ specialties: spe }))
   }

   async setUserSearchString(event) {
      let userSearch = event.target.value;
      // si la recherche utilisateur est un domaine de compétences connu ou un avocat connu 
      if( userSearch.length==0) {
         this.setState({ suggestedSpecialties:[], lawyers:[]  });
      }
      else {
         let suggestedSpe = this.state.specialties.filter( s => 
            s.displayFrFr.toLowerCase().includes(userSearch.toLowerCase()) );

         let suggestedLawyers = await this.onSearchGetLawyers(userSearch);



         this.setState({userSearchString : userSearch, suggestedSpecialties:suggestedSpe,  lawyers: suggestedLawyers  });

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

   debounce(callback, wait) {
      let timeout;
      return (...args) => {
          const context = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => callback.apply(context, args), wait);
      };
  }

   render() {
      return (
        
            <div className="grix xs1 sm2 container d-block">
         
               <div className="form-field">
               <form onSubmit={(e)=>this.searchLawyers(e)}>
                  <p className="font-w600">Je cherche un avocat : </p>
            <input onKeyUp={(e) => {let ev = e; this.debounce(this.setUserSearchString(ev), 500) }} className="form-control rounded-1" placeholder='Nom ou domaine de compétences...' />
            {/*input*/}

            {/* SI IL Y A DES RESULTATS ON AFFICHE div.results  */}
            {this.state.suggestedSpecialties.length != 0 || this.state.lawyers !=0 &&
            <div className="results">
               <ul className="spe">      
                  {this.state.suggestedSpecialties.map(suggest => 
                  <li key={suggest.id}>{suggest.displayFrFr}</li>)}
                
               </ul>
               <hr/>
               <ul className="lawyers">
               {this.state.lawyers.map( (lawyer) => 
                  <li key={lawyer.id}>
                  {/* <img src={lawyer.user.profilePictureUrl} */}
                  <span className="d-flex align-center">
                     {lawyer.user == undefined || lawyer.user.profilePictureUrl==undefined ?  <img src="icon-defaultprofilepicture.png" /> : <img src={lawyer.user.profilePictureUrl} /> }
                     {/* <img src="icon-defaultprofilepicture.png" /> */}
                     <strong>{lawyer.cabName}</strong> - {lawyer.lastName} {lawyer.firstName}
                  </span>
                 
                  <span className="city mr">{lawyer.workAddressCity}</span>

                  
                  </li>)
                  }
               
               </ul>
            
            </div>
            }
            
            {/* <select onChange={(event) => this.selectSpeciality(event)} className="form-control">
               {this.state.specialties.map((specialty) =>
                  <option value={specialty.id} key={specialty.id}>{specialty.displayFrFr}</option>
               )}
            </select> */}
            
            <div className="form-field">
               <button type="submit" className="btn shadow-1 rounded-1 outline txt-blue" >
                       <span className="outline-text">Rechercher</span>
               </button>
            </div>
            </form>
            <p>{this.state.isLoading ? "Chargement en cours..." : this.state.lawyers.length + " résultats"}</p>
               
           
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
      this.setState({selectedSpecialty: event.target.value});
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
         'https://staging.app.feedbacklawyers.com/api/companies/search?pattern='+userSearchStr,
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