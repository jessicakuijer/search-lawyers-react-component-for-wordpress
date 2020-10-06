"use strict";
class UserConnection extends React.Component {
  constructor(props) {
    super(props);
    /* 
         l'objet state du component
         https://fr.reactjs.org/docs/faq-state.html
      */
     let jwt = localStorage.getItem("jwt");
     

    this.state = { 
      jwt: jwt,
      login: '',
      password: '' };

     this.handleChangeLogin = this.handleChangeLogin.bind(this);
     this.handleChangePassword = this.handleChangePassword.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
    //console.log("Je suis le constructor : ", this);
  }
 
  componentDidMount() {}

  handleChangeLogin(e) {
  console.log(e.target.value);
  this.setState({login: e.target.value });
  }

   handleChangePassword(e) {
    console.log(e.target.value);
    this.setState({password: e.target.value });
    
   }

  async handleSubmit(e) {
  //   this.setState
  e.preventDefault();
  
  let result = await this.login(this.state.login, this.state.password);
  console.log(result);
    if(result.JWT){
  localStorage.setItem('jwt', result.JWT)
  this.setState({jwt : result.JWT})
    }

  }
 
  /************ 2- PARTIE VUE (render()) *****************/
  /****************************************************/
  render() {
    return (
      <div className="container-fluid">
      
       { (!this.state.jwt) &&  
       <form onSubmit={this.handleSubmit.bind(this)}>

        
        <input value={this.state.login} className="form-control" placeholder='Email' onChange={e => this.handleChangeLogin(e)} />
        <input value={this.state.password} className="form-control" placeholder='Mot de passe' onChange={e => this.handleChangePassword(e)} type="password"/>
        <input value="Envoyer" className="form-control" type="submit" />
        </form> 
       } {(this.state.jwt) &&
       <span>Je suis connecté</span>

       }
       
      </div>
    );
  }
 
  /**********************************
   3- PARTIE ACCES AUX DATA : API CALLS
   **********************************/
  
  async login(emailAddress, password) {
    let headers = new Headers({
      "Content-Type": "application/json",
    });
    // make api call to get user login array
    let response = await fetch(
      "https://app.feedbacklawyers.com/api/users/login",
      {
        headers,
        method: "POST",
        body: JSON.stringify({ emailAddress, password }),
      }
    );
    let res = await response.json();
    return res;
  }
} // FIN DE LA CLASS
 
// AJOUTER LE COMPONENT
const domContainer = document.querySelector("#search-lawyers-container"); //  <div id="search-lawyers-container"></div>
// ReactDOM.render(e(SearchLawyers), domContainer);
ReactDOM.render(<UserConnection />, domContainer);
 