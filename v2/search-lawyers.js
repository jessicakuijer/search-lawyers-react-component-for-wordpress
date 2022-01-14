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

   

   render() {
      return (
        
            <div className="grix xs1 sm2 container d-block">         
               <div className="form-field">
                  
               <form onSubmit={(e)=>this.searchLawyers(e)}>
                  <p className="font-w600">Je cherche un avocat : </p>
            <input onKeyUp={(e) => this.setUserSearchString(e)} className="form-control rounded-1" placeholder='Nom ou domaine de compétences...' />
            {/*input*/}

            {/* SI IL Y A DES RESULTATS ON AFFICHE div.results  */}
            {(this.state.suggestedSpecialties.length != 0 || this.state.lawyers !=0) &&
            <div className="results">
               <ul className="spe">      
                  {this.state.suggestedSpecialties.map(suggest => 
                  <li key={suggest.id}>{suggest.displayFrFr}</li>)}
               </ul>
               <hr/>
               <ul className="lawyers">
               {this.state.lawyers.map( (lawyer) => 
                  <li key={lawyer.id}>
                     <span className="d-flex align-center">
                     {lawyer.user == undefined || lawyer.user.profilePictureUrl==undefined ?  <img src="icon-defaultprofilepicture.png" /> : <img src={lawyer.user.profilePictureUrl} /> }
                     <strong>{lawyer.cabName}</strong> - {lawyer.lastName} {lawyer.firstName}
                     </span>
                 
                     <span className="city">{lawyer.workAddressCity}</span>

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
            <p>{this.state.isLoading ? "Chargement en cours..." : this.state.lawyers.length + " résultats" && this.state.suggestedSpecialties}</p>
               
           
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
         'Authorization': 'Bearer d68406ad89cf138517e85a0cb1d25589:6d27a26c0f1cb45e4541088de4abd7ba76e44b784ea11519070a917dbe2ad24d730a45d571041ad5e115bd2f5e385188ae551d26e35a588f574056fecab35733912948795001ed5a4900f935ec7a9a20da07a8861e74a11b01687d2ac81232c29343bc018b14e0fbd8d9d2a809684160',
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
         'Authorization': 'Bearer d68406ad89cf138517e85a0cb1d25589:6d27a26c0f1cb45e4541088de4abd7ba76e44b784ea11519070a917dbe2ad24d730a45d571041ad5e115bd2f5e385188ae551d26e35a588f574056fecab35733912948795001ed5a4900f935ec7a9a20da07a8861e74a11b01687d2ac81232c29343bc018b14e0fbd8d9d2a809684160',
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