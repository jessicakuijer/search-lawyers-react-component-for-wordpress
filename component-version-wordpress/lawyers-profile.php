<?php 
/**
* Template Name: lawyers profile
*
* @package WordPress
* @subpackage Futurio
* @since Futurio 1.3.0
*/

function pp($data) {
	echo "<pre>" . print_r($data) . '</pre>';
}
/*
 Afficher les notes par critere
 	<i class="fas fa-star"></i>
	<i class="far fa-star"></i>
	<i class="fas fa-star-half-alt"></i>
*/
function printRatings($score) {
	$template='';
	$score = intval($score); // 1 ou 2 ou 3 ou 4 ou 5
	$numberEmptyStars = 5 - $score;
	
	// Generation étoiles pleines
	for($i=1; $i<=$score; $i++ ) {
		$template = $template . '<i class="criteria-ratings fas fa-star"></i>';
	}
	
	// Generation étoiles vides
	if($score < 5) {
		for($i=1; $i<=$numberEmptyStars; $i++) {
			$template = $template .'<i class="criteria-ratings far fa-star"></i>';
		}
	}
	return $template;	
}

function printAverageScore($averageScore) {
	$template='';
	$averageScore = floatval($averageScore); // ex: 2 ou 3.5
	$numberEmptyStars = 5 - floor($averageScore);
	$is_decimal =  (floatval($averageScore) -  floor($averageScore)) != 0; // TRUE ou FALSE
	//var_dump($is_decimal);
	// Generation étoiles pleines
	for($i=1; $i<=$averageScore; $i++ ) {
		$template = $template . '<i class="average-rating criteria-ratings fas fa-star"></i>';
	}
	// // generation d'une étoile moitié pleine
	if($is_decimal) {
	 	$template = $template . '<i class="average-rating criteria-ratings fas fa-star-half-alt"></i>';
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
	



$authorization = "Authorization: Bearer 726d89b200f44e72d18fde1c2d6a1709:64a1d4f7662cd8d606cc9b2547f2072b6e03639abe0bf0b45b467d30632d781efc5d5b1ffb420a2ea921e73e469b00d0e669c77921ca925ae26a1ddc8b7af9f7ea40a0ff15098d16dfafc2dc7985a1f409127b7b4c81f4512fc372e010e2285ae53c6cf50bae40272cde7d011d63207e";

global $wp;
$city = $wp->query_vars['city'];
$fullname = $wp->query_vars['lawyerfullname'];
$id = $wp->query_vars['lawyerid'];
// handle the API request with the ID
/*
	REQUEST API CURL PHP
	/https://staging.app.feedbacklawyers.com/api/companies/:companyId
	https://staging.app.feedbacklawyers.com/api/ratings
	https://staging.app.feedbacklawyers.com/api/companies/search?specialty[]=1&cities=["Marseille"]

	/api/ratings/company/47916
*/

$url = 'https://app.feedbacklawyers.com/api/companies/'.$id;
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json' , $authorization ));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$data = curl_exec($curl);
$lawyer = json_decode($data);
$lawyer = $lawyer->company;
$langs = json_decode($lawyer->languages);
curl_close($curl);

$url = 'https://app.feedbacklawyers.com/api/ratings/company/'.$id;
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json' , $authorization ));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$dataratings = curl_exec($curl);
$ratings = json_decode($dataratings);
$ratings = $ratings->ratings;
curl_close($curl);

?>

<!--<h4>Pretty-Print des langues: </h4>
<pre> <?php pp($langs); ?> </pre>
<h4>Pretty-Print de l'avocat: </h4> 
<pre> <?php pp($lawyer); ?> </pre>-->
<!--<h4>Pretty-Print des avis de l'avocat: </h4>
<pre> <?php pp($ratings);?> </pre>-->

 



<!DOCTYPE html>
<html lang="en">
<head>

  <!-- SITE TITTLE -->
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Votre recherche d'un avocat - Feedback Lawyers</title>
  
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
<!--===================================
=            Store Section            =
====================================-->
<section class="section bg-gray2">
	<!-- Container Start -->
	<div class="container">
		<div class="row">
			<!-- Left sidebar -->
			<div class="col-md-8">
				<div class="product-details">
					<h1 class="product-title">Cabinet : <?= $lawyer->cabName ?></h1>
					<div class="product-meta">
						<ul class="list-inline">
							<!-- <li class="list-inline-item"><i class="fa fa-user-o"></i> By <a href="">Andrew</a></li> -->
							<li><i class="fas fa-map-marker-alt"></i> Localisation : <?= $lawyer->workAddressCity ?>, <?= $lawyer->workAddressCountry ?></li>
							<li class="list-inline-item"><i class="fas fa-gavel"></i> Domaine(s) de compétence :
							<?php foreach($lawyer->specialties as $spe) { ?>
							<li><?= $spe->displayFrFr ?></li>
							<?php } ?>
						</ul>
					</div>

					<div class="content mt-2 pt-2">
						<ul class="nav nav-pills  justify-content-center" id="pills-tab" role="tablist">
							<li class="nav-item">
								<a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home"
								 aria-selected="true">Fiche Contact</a>
							</li>
							
							<li class="nav-item">
								<a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact"
								 aria-selected="false"><?= $lawyer->ratings->reviewsCount ?> Avis</a>
							</li>
						</ul>
						<div class="tab-content" id="pills-tabContent">
							<div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
								<h3 class="tab-title">Description :</h3>
								<p><?= $lawyer->presentation ?></p>
								<h3 class="tab-title">Adresse :</h3>
								<p><?= $lawyer->workAddressLine1 ?></p>
								<p><?= $lawyer->workAddressLine2 ?></p>
								<p><?= $lawyer->workAddressZipcode ?> <?= $lawyer->workAddressCity ?></p>
								<p><?= $lawyer->workAddressCountry ?></p>
								<p>Téléphone: <?= $lawyer->phoneNumber ?></p>
								<p><strong>Email :</strong> <a href="mailto:<?= $lawyer->emailAddress ?>"><?= $lawyer->emailAddress ?></a></p>
								<p><strong>Site web :</strong> <a href="http://<?= $lawyer->websiteUrl ?>" target="_blank"><?= $lawyer->websiteUrl ?></a></p>
								<h3 class="tab-title">Langue(s) parlée(s): </h3> 
								<?php
								foreach($langs as $language) { ?>
									<p><?= $language->name ?></p>
									
								<?php }
								?>
							</div>
							<div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
								
								<h4 class="tab-title">Note moyenne des avis : <?= printAverageScore($lawyer->ratings->averageRating) ?> </h4>
								
								<h3 class="tab-title">Avis clients certifiés :</h3>
								<div class="product-review">
									
										
											<?php
											foreach($ratings as $rate) {  ?>
											
											<div class="media">
										<!-- Avatar -->
										<!-- img src="https://www.feedbacklawyers.com/react3/images/user/user-thumb.jpg" alt="avatar"> -->
											<div class="media-body">
											<img src="https://www.feedbacklawyers.com/react3/images/approved-review2.png" alt="avis approuvé">
												<div class="avis">
													<!-- Ratings -->
													<div class="ratings">
											<div class="date">											
												<p>Date de l'avis : <?php
												$date2 = new DateTime($rate->createdAt);
												echo $date2->format('d-m-Y');
												?></p>
												
											</div>
											
											

											<p class="font-weight-bold">Note du client : <?= $rate->rating ?> / <?= $rate->maximumRating ?></p>
											<div class="criteres">
												<div class="grade0">
												<?php 
													echo printRatings($rate->criteria0Grade);
													//$i = $rate->criteria0Grade;	
													// if ($i == 0) {
													// 	echo "&#9734;&#9734;&#9734;&#9734;&#9734;";
													// 	} elseif ($i == 1) {
													// 	echo "&#9733;&#9734;&#9734;&#9734;&#9734;";
													// 	} elseif ($i == 2) {
													// 	echo "&#9733;&#9733;&#9734;&#9734;&#9734;";
													// 	}elseif ($i == 3) {
													// 	echo "&#9733;&#9733;&#9733;&#9734;&#9734;";
													// 	}elseif ($i == 4) {
													// 	echo "&#9733;&#9733;&#9733;&#9733;&#9734;";
													// 	}elseif ($i == 5) {
													// 	echo "&#9733;&#9733;&#9733;&#9733;&#9733;";
													// 	}
												?>
											<span class="ml-2 font-italic">Ecoute et compréhension des besoins</span>
												</div>
												<div class="grade1">
												<?php 
													echo printRatings($rate->criteria1Grade);
												?>
											<span class="ml-2 font-italic">Disponibilité et réactivité</span>
												</div>
												<div class="grade2">
												<?php 
													echo printRatings($rate->criteria2Grade);
												?>
											<span class="ml-2 font-italic">Force de proposition et solutions innovantes</span>
												</div>
												<div class="grade3">
												<?php 
													echo printRatings($rate->criteria3Grade);
												?>
											<span class="ml-2 font-italic">Qualité du suivi et communication</span>
												</div>
												<div class="grade4"><?php 
													echo printRatings($rate->criteria4Grade);
												?>
											<span class="ml-2 font-italic">Pluridisciplinaire / Prise en charge globale</span>
												</div>
												<div class="grade5"><?php 
													echo printRatings($rate->criteria5Grade);
												?>

											<span class="ml-2 font-italic">Rémunération forfaitaire / honoraires justes</span>
												</div>
												<div class="grade6"><?php 
													echo printRatings($rate->criteria6Grade);
												?>
											<span class="ml-2 font-italic">Degrés de recommandation</span>
												</div>
											</div>

											
											</div>
											<!-- <div class="name">
												<h5>Client certifié</h5>
											</div> -->
											<br>
											<div class="review-comment">
												<p><?= $rate->comment ?></p>
											</div>
											
										</div>
											</div>
											</div>
												<?php } // end foreach
												?>
											
											



											
									
									
									<!-- <div class="review-submission">
										<h3 class="tab-title">Submit your review</h3>
										<!-- Rate 
										<div class="rate">
											<div class="starrr"></div>
										</div>
										<div class="review-submit">
											<form action="#" class="row">
												<div class="col-lg-6">
													<input type="text" name="name" id="name" class="form-control" placeholder="Name">
												</div>
												<div class="col-lg-6">
													<input type="email" name="email" id="email" class="form-control" placeholder="Email">
												</div>
												<div class="col-12">
													<textarea name="review" id="review" rows="10" class="form-control" placeholder="Message"></textarea>
												</div>
												<div class="col-12">
													<button type="submit" class="btn btn-main">Submit</button>
												</div>
											</form>
										</div>
									</div> -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<div class="sidebar">
					<!-- <div class="widget price text-center">
						<h4>Zone à définir</h4>
						<p>Lien à définir</p>
					</div> -->
					<!-- User Profile widget -->
					<div class="widget user text-center">
					<?php 
					if( !isset($lawyer->user->profilePictureUrl) && !isset($lawyer->profilePictureUrl)) {
						echo '<img class="rounded-circle img-fluid mb-5 px-5" data-no-lazy="1" src="https://www.feedbacklawyers.com/react3/images/icon-defaultprofilepicture.png" alt"Profile picture"/>'
						;} // FIN IF

						else {
						echo '<img class="rounded-circle img-fluid mb-5 px-5" data-no-lazy="1" src="' . $lawyer->user->profilePictureUrl .'" />' 
						;} // FIN ELSE 
					?>
						<!--<img class="rounded-circle img-fluid mb-5 px-5" src="https://www.feedbacklawyers.com/react3/images/user/user-thumb.jpg" alt=""> -->
						<h4><a href=""><?= $lawyer->firstName . ' ' . $lawyer->lastName ?> </a></h4>
						<p class="member-time">Date de prestation de serment: </p>
						<p class="member-time">
							<?php
							$date = new DateTime($lawyer->oathTakenDate);
							echo $date->format('d-m-Y');
							?>
						</p>
						<p><?= $lawyer->ratings->reviewsCount ?> avis clients certifiés</p>

						<?= printAverageScore($lawyer->ratings->averageRating)?>
						<ul class="list-inline mt-20">
							<li class="list-inline-item"><a href="mailto:<?= $lawyer->emailAddress ?>" class="btn btn-contact btn-lawyer d-inline-block px-lg-5 my-1 px-md-3">Contact</a></li>
						</ul>
					</div>
					<!-- Map Widget 
					<div class="widget map">
						<div class="map">
							<div id="map_canvas" data-latitude="51.507351" data-longitude="-0.127758"></div>
						</div>
					</div>
					<!-- Rate Widget 
					<div class="widget rate">
						<!-- Heading 
						<h5 class="widget-header text-center">What would you rate
							<br>
							this product</h5>-->
						<!-- Rate 
						<div class="starrr"></div>
					</div>-->
					<!-- Safety tips widget 
					<div class="widget disclaimer">
						<h5 class="widget-header">Safety Tips</h5>
						<ul>
							<li>Meet seller at a public place</li>
							<li>Check the item before you buy</li>
							<li>Pay only after collecting the item</li>
							<li>Pay only after collecting the item</li>
						</ul>
					</div>-->
					<!-- Coupon Widget 
					<div class="widget coupon text-center">
						<!-- Coupon description 
						<p>Have a great product to post ? Share it with
							your fellow users.
						</p>
						<!-- Submit button 
						<a href="" class="btn btn-transparent-white">Submit Listing</a>
					</div> -->

				</div>
			</div>

		</div>
	</div>
	<!-- Container End -->
</section>
<!--============================
=            Footer            =
=============================-->

<footer class="footer section section-sm footer-width">
  <!-- Container Start -->
	<div class="container">
		<div class="row-nowrap">
			<div class="col-lg-4 col-md-7 offset-md-1 offset-lg-0">
        <!-- About -->
				<div class="block about">
          <!-- footer logo -->
				<img class="logo" src="https://www.feedbacklawyers.com/react3/images/FBLV.png" alt="logo feedback lawyers">
				<!-- description -->
				<p class="alt-color">Inscrits dans une démarche de qualité de la relation client nous développons un outil permettant d’apporter clarté et transparence au métier d’avocat.</p>

				</div>
			</div>
<!-- Link list -->
			<div class="col offset-lg-1 col-md-3">
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
			<div class="col col-md-5 offset-md-1 offset-lg-0">
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
<!-- Promotion 
			<div class="col col-md-5">
					<!-- App promotion 
					<div class="block-2 app-promotion">
						<div class="mobile d-flex">
						<a href="">
						<!-- Icon 
						<img src="https://www.feedbacklawyers.com/react3/images/footer/phone-icon.png" alt="mobile-icon">
						</a>
						<p>Téléchargez l'App Feedback Lawyers:</p>
						</div>
					<div class="download-btn d-flex my-3">
						<a href="https://play.google.com/store/apps/details?id=com.feedbacklawyers.publicmobileapp&hl=en"><img src="https://www.feedbacklawyers.com/react3/images/apps/google-play-store.png" class="img-fluid" alt=""></a>
						<a href="https://apps.apple.com/us/app/feedback-lawyers/id1479196126?ls=1" class=" ml-3"><img src="https://www.feedbacklawyers.com/react3/images/apps/apple-app-store.png" class="img-fluid" alt=""></a>
					</div>
					</div>
				</div>-->
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

<p>Copyrights © 2020 - <a href="https://www.feedbacklawyers.com" target="_blank" rel="noopener noreferrer" class="link-footer">FeedbackLawyers.com</a></p>

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

