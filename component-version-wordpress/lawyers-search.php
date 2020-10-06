<?php
/**
* Template Name: lawyers list
*
* @package WordPress
* @subpackage Futurio
* @since Futurio 1.3.0
*/
function pp($data) {
	echo "<pre>" . print_r($data) . '</pre>';
}

function printAverageScore($averageScore) {
	$template='';
	$averageScore = floatval($averageScore); // ex: 2 ou 3.5
	$numberEmptyStars = 5 - floor($averageScore);
	$is_decimal =  (floatval($averageScore) -  floor($averageScore)) != 0; // TRUE ou FALSE
	//var_dump($is_decimal);
	// Generation étoiles pleines
	for($i=1; $i<=$averageScore; $i++ ) {
		$template = $template . '<i class="average-rating fas fa-star"></i>';
	}
	// // generation d'une étoile moitié pleine
	if($is_decimal) {
	 	$template = $template . '<i class="average-rating fas fa-star-half-alt"></i>';
	}
	// Generation étoiles vides
	if($averageScore < 5) {
		// Si il y a un score avec une décimal on généère un ombre d'étoiles vides - 1
		if($is_decimal) {
			for($i=1; $i<=$numberEmptyStars - 1; $i++) {
				$template = $template .'<i class="average-rating criteria-ratings far fa-star"></i>';
			}
		}
		else {
			for($i=1; $i<=$numberEmptyStars; $i++) {
				$template = $template .'<i class="average-rating criteria-ratings far fa-star"></i>';
			}
		}	
	}
	return $template;
}

/*
      getUrlFullName
      @Param : nom,  prenom (string)
      Return a formatted fullName (ex: rouve-jean-paul)
*/
// function getFullName($nom, $prenom) {
// 	$lastname = $nom.trim().length > 0 ? $nom.toLowerCase().replace(' ', '-') : '';
// 	$firstname = $prenom.trim().length > 0 ? $prenom.toLowerCase().replace(' ', '-') : ''
// 	return $lastname.length > 0 ? $lastname + '-' + $firstname : $firstname;
//  }
function buildUrlToLawyerPage($city, $firstname, $lastname,  $id) {
	$base_url='https://www.feedbacklawyers.com/lawyers/?';
	//var_dump( 'fristname: ' . strlen(trim($firstname)));
	//var_dump( 'laqtname: ' . strlen(trim($lastname)));
	$firstname = strlen(trim($firstname)) === 0 ? '' : str_replace (' ', '-',  strtolower( trim($firstname) ) );
	$lastname = strlen(trim($lastname)) === 0 ? '' :str_replace (' ', '-',  strtolower( trim($lastname) ) );
	$fullname = strlen(trim($lastname)) === 0 ? $firstname : $lastname . '-' .$firstname;
	return $base_url.'city='.strtolower($city).'&lawyerfullname='.$fullname.'&lawyerid='.$id;
}

/*
	Raccourcir le texte de description et remplacer par ...
*/
function shorter($text, $chars_limit)
{
    // Check if length is larger than the character limit
    if (strlen($text) > $chars_limit)
    {
        // If so, cut the string at the character limit
        $new_text = substr($text, 0, $chars_limit);
        // Trim off white space
        $new_text = trim($new_text);
        // Add at end of text ...
        return $new_text . "...";
    }
    // If not just return the text as is
    else
    {
    return $text;
    }
}





$authorization = "Authorization: Bearer 726d89b200f44e72d18fde1c2d6a1709:64a1d4f7662cd8d606cc9b2547f2072b6e03639abe0bf0b45b467d30632d781efc5d5b1ffb420a2ea921e73e469b00d0e669c77921ca925ae26a1ddc8b7af9f7ea40a0ff15098d16dfafc2dc7985a1f409127b7b4c81f4512fc372e010e2285ae53c6cf50bae40272cde7d011d63207e";

// echo 'Template liste';
$idSpecialty = $_GET['specialty'];
$city = ucfirst($_GET['city']);


// Requete à l'API pour récuperer liste des avocats
$url = 'https://app.feedbacklawyers.com/api/companies/search?specialty[]='.$idSpecialty.'&cities=["'.$city.'"]';
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json' , $authorization ));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$jsonresponse = curl_exec($curl);
$response = json_decode($jsonresponse);
$lawyers = $response->companies;
// $ratings = $ratings->ratings;
curl_close($curl);

?>
<!--<pre> <?php pp($lawyers);?> </pre>-->



<!DOCTYPE html>
<html lang="en">
<head>

  <!-- SITE TITTLE -->
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Votre recherche d'avocats spécialisés et localisés - Feedback Lawyers</title>
  
  <!-- FAVICON -->
  <link href="img/favicon.png" rel="shortcut icon">
  <!-- PLUGINS CSS STYLE -->
  <!-- <link href="plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"> -->
  <!-- Bootstrap -->
  <link rel="stylesheet" href="https://www.feedbacklawyers.com/react3/plugins/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://www.feedbacklawyers.com/react3/plugins/bootstrap/css/bootstrap-slider.css">
  <!-- Font Awesome -->
  <!-- <link href="https://www.feedbacklawyers.com/react3/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet"> -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css" integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog==" crossorigin="anonymous" />
  <!-- Owl Carousel -->
  <link href="https://www.feedbacklawyers.com/react3/plugins/slick-carousel/slick/slick.css" rel="stylesheet">
  <link href="https://www.feedbacklawyers.com/react3/plugins/slick-carousel/slick/slick-theme.css" rel="stylesheet">
  <!-- Fancy Box -->
  <link href="https://www.feedbacklawyers.com/react3/plugins/fancybox/jquery.fancybox.pack.css" rel="stylesheet">
  <link href="https://www.feedbacklawyers.com/react3/plugins/jquery-nice-select/css/nice-select.css" rel="stylesheet">
  <!-- CUSTOM CSS -->
  <link href="https://www.feedbacklawyers.com/react3/css/style.css" rel="stylesheet">


  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

</head>
<!-- ShareThis -->
<script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=5f5238add449570011d2b24a&product=sticky-share-buttons" async="async"></script>


<body class="body-wrapper">

<section>
<div class="container">
		<div class="row">
			<div class="col-md-12">
				<nav class="navbar navbar-expand-lg navbar-light navigation">
				<a class="navbar-brand" href="https://www.feedbacklawyers.com/justiciables/">
						<img class="logo" src="https://www.feedbacklawyers.com/react3/images/FBLV.png" alt="FeedbackLawyers logo">
					</a>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
					 aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<ul class="navbar-nav ml-2 main-nav ">
							<li class="nav-item active">
								<a class="nav-link" href="https://www.feedbacklawyers.com/justiciables/">Accueil</a>
							</li>
							<li class="nav-item dropdown dropdown-slide">
								<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="https://www.feedbacklawyers.com/actualites/">Actualités<span><i class="fa fa-angle-down"></i></span>
								</a>

								<!-- Dropdown list -->
								<div class="dropdown-menu">
									<a class="dropdown-item" href="https://www.feedbacklawyers.com/actualites-particuliers/">PARTICULIERS</a>
									<a class="dropdown-item" href="https://www.feedbacklawyers.com/actu-entreprises/">ENTREPRISES</a>
								</div>
							</li>
							
							<li class="nav-item">
								<a class="nav-link" href="https://www.feedbacklawyers.com/recrutement-feedback-lawyers/">REJOIGNEZ-NOUS</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="https://www.feedbacklawyers.com/contactez-nous/">CONTACTEZ-NOUS</a>
							</li>
						</ul>
						<!-- <ul class="navbar-nav ml-auto mt-10">
							<li class="nav-item">
								<a class="nav-link login-button" href="login.html">Login</a>
							</li>
							<li class="nav-item">
								<a class="nav-link text-white add-button" href="ad-listing.html"><i class="fa fa-plus-circle"></i> Télecharger l'APP</a>
							</li>
						</ul> -->
					</div>
				</nav>
			</div>
		</div>
	</div>
</section>
<section class="page-search">
	<div class="container">
		<div class="row">
			<div class="col-md-6">
				<div class="d-flex justify-content-start">
					<div class="btn btn-light mt-15"><a href="https://www.feedbacklawyers.com/accueil/" target="_blank">Vous êtes avocat</a>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-md-7 box-app">
        <!-- App promotion -->
        <div class="block-2 app-promotion">
          <div class="mobile d-flex">
            
              <!-- Icon -->
              <img src="https://www.feedbacklawyers.com/react3/images/mobile.png" class="mobile-fl" alt="mobile-icon">
            
            <p class="white" style=style="margin: 3px 0px 10px 40px;">Déposer un avis gratuitement <i class="fas fa-star criteria-ratings"></i><i class="fas fa-star criteria-ratings"></i><i class="fas fa-star criteria-ratings"></i><i class="fas fa-star criteria-ratings"></i><i class="fas fa-star criteria-ratings"></i></p>
          </div>
          <div class="download-btn d-flex my-1">
            <a href="https://play.google.com/store/apps/details?id=com.feedbacklawyers.publicmobileapp&hl=en"><img src="https://www.feedbacklawyers.com/react3/images/google-store.png" class="img-fluid google" alt=""></a>
            <a href="https://apps.apple.com/us/app/feedback-lawyers/id1479196126?ls=1"><img src="https://www.feedbacklawyers.com/react3/images/app-store.png" class="img-fluid apple" alt=""></a>
          </div>
        </div>
      </div>
			<!--<div class="col-md-4">
				
				<div class="d-flex criteria-ratings">
				<h6 class="white">Déposer un avis gratuitement : </h6>
				<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
			</div>
				<br>
			<div class="d-flex justify-content-end">
				<a href="https://play.google.com/store/apps/details?id=com.feedbacklawyers.publicmobileapp&hl=en" target="_blank"><img class="img-fluid apple" src="https://www.feedbacklawyers.com/react3/images/google-store.png " alt="App store logo"></a>
				<a href="https://apps.apple.com/us/app/feedback-lawyers/id1479196126?ls=1" target="_blank"><img class="img-fluid google" src="https://www.feedbacklawyers.com/react3/images/app-store.png" alt="Google play logo"></a>
			</div>
				
			</div>
			<div class="col-md-2">
			<div class="d-flex justify-content-start">
				<img class="img-fluid mobile-fl" src="https://www.feedbacklawyers.com/react3/images/mobile.png" alt="App mobile">
				</div>		
			</div>-->
		</div>
	</div>
</section>
<section class="section-sm">
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="search-result bg-gray2">
					<h2>Votre recherche d'avocats : <!-- spécialisés en "droit civil" localisés à "ville"--></h2>
					<!--<p>"nombre de résultats"</p>-->
				</div>
			</div>
		</div>
		<div class="row">
			
			<div class="col-lg-12 col-md-8">
				<!--<div class="category-search-filter">
					<div class="row">
						<div class="col-md-6">
							<strong>Short</strong>
							<select>
								<option>Most Recent</option>
								<option value="1">Most Popular</option>
								<option value="2">Lowest Price</option>
								<option value="4">Highest Price</option>
							</select>
						</div>
					</div>
				</div>-->

				<!-- ad listing list  -->
				<?php foreach($lawyers as $lawyer) { ?>
				<a href="<?= buildUrlToLawyerPage($lawyer->workAddressCity, $lawyer->firstName, $lawyer->lastName, $lawyer->id) ?>">
				<div class="ad-listing-list mt-20">
				
	<div class="row p-lg-3 p-sm-5 p-4">
        <div class="col-lg-3 align-self-center">
           
			<?php 
					if( !isset($lawyer->user->profilePictureUrl) && !isset($lawyer->profilePictureUrl)) {
						echo '<img class="rounded-circle img-fluid mb-3 px-5" data-no-lazy="1" src="https://www.feedbacklawyers.com/react3/images/icon-defaultprofilepicture.png" alt"Profile picture"/>'
						;} // FIN IF

						else {
						echo '<img class="rounded-circle img-fluid mb-5 px-5" data-no-lazy="1" src="' . $lawyer->user->profilePictureUrl .'" />' 
						;} // FIN ELSE 
					?>
                <!--<img src="images/products/products-1.jpg" class="img-fluid" alt="">-->
           
        </div>
        <div class="col-lg-8">
            <div class="row">
                <div class="col-lg-8 col-md-10">
                    <div class="ad-listing-content">
                        <div>
						<?= $lawyer->firstName . ' ' .  $lawyer->lastName ?>
                        </div>
                        <ul class="list-inline mt-2 mb-3">
                            <li class="list-inline-item"><i class="fas fa-map-marker-alt"></i><?= ' '.$lawyer->workAddressCity .', '.$lawyer->workAddressCountry ?></li>
                        </ul>
                        <p class="pr-5"><i class="fas fa-gavel"></i> Domaine(s) de compétences : <?php foreach($lawyer->specialties as $spe) { ?>
							<li><?= $spe->displayFrFr ?></li>
							<?php } ?>
						</p>
						<!--description courte-->
						<p class="pr-10" style="text-align: justify;"><?= shorter($lawyer->presentation, 200) ?></p>
                    </div>
                </div>
                <div class="col-lg-4 align-self-top">
				    <div class="product-ratings float-lg-left pb-3">
					<p><?= $lawyer->ratings->reviewsCount ?> avis clients certifiés</p>
					<?= printAverageScore($lawyer->ratings->averageRating)?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
						</a>
<?php } ?>
				
				
				
				
				<!-- ad listing list  -->

				<!-- pagination -->
				<div class="pagination justify-content-center py-4">
					<nav aria-label="Page navigation example">
						<ul class="pagination">
							<li class="page-item">
								<a class="page-link" href="#" aria-label="Previous">
									<span aria-hidden="true">&laquo;</span>
									<span class="sr-only">Previous</span>
								</a>
							</li>
							<li class="page-item"><a class="page-link" href="#">1</a></li>
							<!--<li class="page-item active"><a class="page-link" href="#">2</a></li>
							<li class="page-item"><a class="page-link" href="#">3</a></li>-->
							<li class="page-item">
								<a class="page-link" href="#" aria-label="Next">
									<span aria-hidden="true">&raquo;</span>
									<span class="sr-only">Next</span>
								</a>
							</li>
						</ul>
					</nav>
				</div>
				<!-- pagination -->
			</div>
		</div>
	</div>
</section>

<!--============================
=            Footer            =
=============================-->

<footer class="footer section section-sm">
  <!-- Container Start -->
<div class="container">
<div class="row">
<div class="col-lg-3 col-md-7 offset-md-1 offset-lg-0">
        <!-- About -->
<div class="block about">
          <!-- footer logo -->
<img class="logo" src="/react3/images/FBLV.png" alt="logo feedback lawyers">
<!-- description -->
<p class="alt-color">Inscrits dans une démarche de qualité de la relation client nous développons un outil permettant d’apporter clarté et transparence au métier d’avocat.</p>

</div>
</div>
<!-- Link list -->
<div class="col-lg-2 offset-lg-1 col-md-3">
	<div class="block">
		<h4>Informations pratiques</h4>
			<ul>
				<li><a href="https://www.feedbacklawyers.com/conditions-generales-utilisation-entreprises-particuliers/">Conditions d'utilisations Justiciables</a></li>
				<li><a href="https://www.feedbacklawyers.com/politique-de-confidentialite/">Politique de confidentialité</a></li>
				<li><a href="https://www.feedbacklawyers.com/regles-de-referencement/">Règles de référencement</a></li>
				<li><a href="https://www.feedbacklawyers.com/mentions-legales/">Mentions légales</a></li>
			</ul>
	</div>
</div>
<!-- Link list -->
<div class="col-lg-2 col-md-3 offset-md-1 offset-lg-0">
	<div class="block">
		<h4>Retrouvez plus d'actualités sur nos réseaux sociaux</h4>
			<ul>
				<li><a href="https://www.facebook.com/FeedbackLawyers/"><i class="fab fa-facebook-square"></i> Facebook</a></li>
				<li><a href="https://twitter.com/FeedbackLawyers?s=20"><i class="fab fa-twitter-square"></i> Twitter</a></li>
				<li><a href="https://www.linkedin.com/company/feedback-lawyers/"><i class="fab fa-linkedin"></i> LinkedIn</a></li>
				<li><a href="https://www.youtube.com/channel/UCKkxviN3T-FCS74Bl7TF_wg"><i class="fab fa-youtube-square"></i> Youtube</a></li>
			</ul>
	</div>
</div>
<!-- Promotion -->
<div class="col-lg-4 col-md-7">
        <!-- App promotion -->
	<div class="block-2 app-promotion">	
		<div class="mobile d-flex">
            <a href="">
<!-- Icon -->
		<img src="/react3/images/footer/phone-icon.png" alt="mobile-icon">
			</a>

		<p>Téléchargez l'App Feedback Lawyers:</p>

		</div>
			<div class="download-btn d-flex my-3">
            <a href="https://play.google.com/store/apps/details?id=com.feedbacklawyers.publicmobileapp&hl=en"><img src="/react3/images/apps/google-play-store.png" class="img-fluid" alt=""></a>
<a href="https://apps.apple.com/us/app/feedback-lawyers/id1479196126?ls=1" class=" ml-3"><img src="/react3/images/apps/apple-app-store.png" class="img-fluid" alt=""></a>
			</div>
	</div>
</div>
</div>
</div>
<!-- Container End -->
</footer><!-- Footer Bottom -->

<footer class="footer-bottom">
  <!-- Container Start -->
<div class="container">
<div class="row">
<div class="col-sm-6 col-12">
        <!-- Copyright -->
<div class="copyright">

<p>Copyrights © 2020 - <a href="#" target="_blank" rel="noopener noreferrer" class="link-footer">FeedbackLawyers.com</a></p>

</div>
</div>
<div class="col-sm-6 col-12">
        <!-- Social Icons -->
<ul class="social-media-icons text-right">
 	<li><a class="fab fa-facebook" href="https://www.facebook.com/FeedbackLawyers/" target="_blank" rel="noopener noreferrer"></a></li>
 	<li><a class="fab fa-twitter" href="https://twitter.com/FeedbackLawyers" target="_blank" rel="noopener noreferrer"></a></li>
 	<li><a class="fab fa-youtube" href="https://www.youtube.com/channel/UCKkxviN3T-FCS74Bl7TF_wg" target="_blank" rel="noopener noreferrer"></a></li>
 	<li><a class="fab fa-linkedin-in" href="https://www.linkedin.com/company/feedback-lawyers/"></a></li>
</ul>
</div>
</div>
</div>

<!-- JAVASCRIPTS -->
<script src="https://www.feedbacklawyers.com/react3/plugins/jQuery/jquery.min.js"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/bootstrap/js/popper.min.js"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/bootstrap/js/bootstrap-slider.js"></script>
  <!-- tether js -->
<script src="https://www.feedbacklawyers.com/react3/plugins/tether/js/tether.min.js"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/raty/jquery.raty-fa.js"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/slick-carousel/slick/slick.min.js"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/jquery-nice-select/js/jquery.nice-select.min.js"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/fancybox/jquery.fancybox.pack.js"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/smoothscroll/SmoothScroll.min.js"></script>
<!-- google map -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCcABaamniA6OL5YvYSpB3pFMNrXwXnLwU&libraries=places"></script>
<script src="https://www.feedbacklawyers.com/react3/plugins/google-map/gmap.js"></script>
<script src="https://www.feedbacklawyers.com/react3/js/script.js"></script>


</body>

</html>

