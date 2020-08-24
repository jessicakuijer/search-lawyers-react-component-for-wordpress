'use strict';

class SearchLawyers extends React.Component {

   constructor(props) {
      super(props);
      this.state = { isLoading: false, lawyers: [], specialties: [] };
      console.log(this);
      this.getSpecialities().then((spe) => this.setState({ specialties: spe }))
   }

   async searchLawyers(ev) {
      // 1 recuperer la saisie utilisateur
      let userSearchTerm = event.target.value;
      if (userSearchTerm.trim().length < 3) {
         this.setState({ lawyers: [] })
      }
      else {
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
   }

   render() {
      
      return (
         <div>
            <input className="form-control" onKeyUp={(event) => this.searchLawyers(event)} placeholder='Rechercher...' />
            <select className="form-control">
               {this.state.specialties.map((specialty) =>
                  <option key={specialty.id}>{specialty.displayFrFr}</option>
               )}
            </select>

            <p>{this.state.isLoading ? "Chargement en cours..." : this.state.lawyers.length + " résultats"}</p>

            {/* AFFICHER LA LISTE DES RESULTATS */}
            {this.state.lawyers.map( (lawyer) =>
               <ul key={lawyer.id}>
               <li key={lawyer.id} className="item-lawyer">
                  {/* TODO : faire afficher la photo */}
                  <h4>Photo:  </h4> <img src={lawyer.user.profilePictureUrl} /><br />
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
                  
                  {/* Afficher la date en format fr avec MomentJS */}
                  <h4>Date de prestation de serment: </h4>{`${moment(lawyer.oathTakenDate).format(
                        'DD/MM/YYYY'
                      )}`}<br />

                  <h4>Présentation: </h4>{lawyer.presentation}<br />
                  <h4>Domaine de compétences: </h4>
                     {lawyer.specialties.map( (specialty, i) => (
                        <p key={i}>{specialty.displayFrFr}</p>
                  ))}

                  {/* Afficher la langue correctement / partie name de l'array avec JSON.parse */}
                  <h4>Langue(s) parlée(s): </h4>{JSON.parse(lawyer.languages).map(l => l.name).join(' - ')}<br />
               </li>
               </ul>

                             
            )}
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
    onSearchGetLawyers(userSearchTerm)
    Role : récuperer la liste des avocats lors de la recherche
    @param : userSearchTerm:string
   */
   async onSearchGetLawyers(userSearchTerm) {
      let myHeaders = new Headers({
         'Authorization': 'Bearer d68406ad89cf138517e85a0cb1d25589:6d27a26c0f1cb45e4541088de4abd7ba76e44b784ea11519070a917dbe2ad24d730a45d571041ad5e115bd2f5e385188ae551d26e35a588f574056fecab35733912948795001ed5a4900f935ec7a9a20da07a8861e74a11b01687d2ac81232c29343bc018b14e0fbd8d9d2a809684160',
         'Content-Type': 'application/json'
      });
      // make api call to get lawyers array
      let response = await fetch(
         'https://staging.app.feedbacklawyers.com/api/companies/search?pattern=' + userSearchTerm,
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