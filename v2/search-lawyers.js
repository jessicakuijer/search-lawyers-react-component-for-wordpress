'use strict';

class SearchLawyers extends React.Component {

   constructor(props) {
      super(props);
      this.state = { isLoading: false, lawyers: [], suggestedSpecialties: [], specialties: [], userSearchString:'', selectedSpecialty:'' };
      console.log(this);
      this.getSpecialities().then((spe) => this.setState({ specialties: spe }))
   }

   setUserSearchString(event) {
      console.log(event.target.value);
      // si la recherche utilisateur est une spécialité connue, un avocat connu 
      if(event.target.value.length==0) {
         this.setState({ suggestedSpecialties:[]  });
      }
      else {
         let suggested = this.state.specialties.filter( s => s.displayFrFr.toLowerCase().includes(event.target.value.toLowerCase()) );
         this.setState({userSearchString : event.target.value, suggestedSpecialties:suggested  });
      }
   }


   async searchLawyers(ev) {
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
         <form>
            <div className="grix xs1 sm2 container d-block">
               <div className="form-field">
                  <p className="font-w600">Je cherche un avocat : </p>
            <input onKeyUp={event => this.setUserSearchString(event)} className="form-control rounded-1" placeholder='Nom ou domaine de compétences...' />
            {/*input*/}
            <div className="dropdown-content white shadow-1 rounded-1">
               <a className="dropdown-item" href="#">
                  {this.state.suggestedSpecialties.map(suggest => <p key={suggest.id}>{suggest.displayFrFr}</p>)}
               </a>
            </div>
            
            {/* <select onChange={(event) => this.selectSpeciality(event)} className="form-control">
               {this.state.specialties.map((specialty) =>
                  <option value={specialty.id} key={specialty.id}>{specialty.displayFrFr}</option>
               )}
            </select> */}
            <div className="form-field">
               <button className="btn shadow-1 rounded-1 outline txt-blue" onClick={(event) => this.searchLawyers(event)}><span className="outline-text">Rechercher</span></button>
            </div>
            <p>{this.state.isLoading ? "Chargement en cours..." : this.state.lawyers.length + " résultats"}</p>
               
            <ul>
            {/* AFFICHER LA LISTE DES RESULTATS */}
            {this.state.lawyers.map( (lawyer) =>
               
               <a href={'/lawyers?'+lawyer.id} key={lawyer.id} className="item-lawyer">
                  {/* TODO : faire afficher la photo */}
                  <h4>Photo:  </h4> <img src={lawyer.profilePictureUrl} /><br />

                  <h4>Nom : </h4>{lawyer.lastName} <br />
                  <h4>Prénom :</h4>{lawyer.firstName}<br />
                  <h4>Cabinet: </h4> {lawyer.cabName}<br />                  
                  <h4>Adresse: </h4>{lawyer.workAddressLine1}<br />
                  {lawyer.workAddressZipcode} {lawyer.workAddressCity}<br />

                  {/* TODO : Rajouter un mailto */}
                  <h4>Email: </h4> {lawyer.emailAddress}<br />
                  {/* TODO : Rajouter un href target _blank */}
                  <h4>Site web: </h4> {lawyer.websiteUrl}<br />
                  

                  {/* TODO : Faire afficher un string "oui" pour l'aide juridictionnelle ou phrase "Maitre NOM propose de l'aide juridictionnelle si oathTakenDate = true / idem pour false " */}
                  <h4>Aide juridictionnelle: </h4>{lawyer.legalAidAvailable}<br />
                  {/* TODO : Faire afficher la date en formate Datetime fr */}
                  <h4>Date de prestation de serment: </h4>{lawyer.oathTakenDate}<br />

                  <h4>Présentation: </h4>{lawyer.presentation}<br />
                  <h4>Domaine de compétences: </h4>
                 
                     {lawyer.specialties.map( (specialty, i) => 
                        <p key={i}>{specialty.displayFrFr}</p>
                       
                  )}
                

                  {/* TODO : Faire afficher la langue correctement / partie name de l'array */}
                  <h4>Langue(s) parlée(s): </h4>{JSON.parse(lawyer.languages).map((language, i) => 
                     <p key={i}>{language.name}</p>
                  )}
               </a>
                            
            )}  {/* fin map */}
            </ul>
         </div>
         </div>
         </form>
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
   async onSearchGetLawyers(userSearchTerm) {
      let myHeaders = new Headers({
         'Authorization': 'Bearer d68406ad89cf138517e85a0cb1d25589:6d27a26c0f1cb45e4541088de4abd7ba76e44b784ea11519070a917dbe2ad24d730a45d571041ad5e115bd2f5e385188ae551d26e35a588f574056fecab35733912948795001ed5a4900f935ec7a9a20da07a8861e74a11b01687d2ac81232c29343bc018b14e0fbd8d9d2a809684160',
         'Content-Type': 'application/json'
      });
      /*
      si la recherche est un spécialité alors call aPI .....speciality[]=12
      si la recherche est un nom alors le call api .... '&pattern='+userSearchTerm
      */
      // make api call to get lawyers array
      let response = await fetch(
         'https://staging.app.feedbacklawyers.com/api/companies/search?specialty[]='+this.state.selectedSpecialty+'&cities[]=paris',
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