const fr = {
	common: {
		email: "Email",
		password: "Mot de passe",
		confirmPassword: "Confirmer le mot de passe",
		username: "Nom d'utilisateur",
		fullName: "Nom complet",
		login: "Se connecter",
		register: "S'inscrire",
		logout: "Se déconnecter",
		submit: "Soumettre",
		cancel: "Annuler",
		loading: "Chargement...",
		error: "Erreur",
		success: "Succès",
		required: "Ce champ est requis",
		invalid: "Format invalide",
		joinCommunity: "Rejoindre la communauté",
		attendNextEvent: "Participer au prochain événement",
		search: "Rechercher",
		category: "Catégorie",
		allCategories: "Toutes les catégories",
		tag: "Tag",
		allTags: "Tous les tags",
		newest: "Plus récent",
		oldest: "Plus ancien",
		previous: "Précédent",
		next: "Suivant",
		activeFilters: "Filtres actifs :",
		clearAll: "Tout effacer",
		clearFilters: "Effacer les filtres",
		resultsFound_one: "{{count}} résultat trouvé",
		resultsFound_other: "{{count}} résultats trouvés",
		loadingMore: "Chargement en cours...",
		tryAgain: "Réessayer",
		subscribe: "S'abonner",
		newsletter: "Newsletter",
		read: "lire",
		min: "min",
		views: "vues",
		article: "Article",
		featured: "À la une",
		published: "Publié",
		updated: "Mis à jour",
		back: "Retour",
		backTo: "Retour à {{target}}",
		emptyState: "Rien à afficher pour le moment.",
		showLess: "Afficher moins",
		showMore: "Afficher plus",
		ofItems: "Affichage de {{from}} à {{to}} sur {{total}} éléments",
	},
	nav: {
		home: "Accueil",
		about: "À propos",
		mission: "Mission",
		forum: "Forum",
		code: "Code",
		terms: "Conditions",
		joinDiscord: "Rejoindre Discord",
		join: "Rejoindre",
		store: "Boutique",
	},
	auth: {
		loginTitle: "Bon retour",
		loginSubtitle: "Connectez-vous à votre compte",
		loginSuccess: "Connexion réussie !",
		loginSuccessOtp:
			"Connexion réussie ! Veuillez vérifier votre email pour le code de vérification.",
		loginError: "Échec de la connexion. Veuillez vérifier vos identifiants.",
		registerTitle: "Créer un compte",
		registerSubtitle: "Rejoignez notre communauté",
		registerSuccess:
			"Compte créé avec succès ! Veuillez vérifier votre email pour la vérification.",
		registerError: "Échec de l'inscription. Veuillez réessayer.",
		forgotPassword: "Mot de passe oublié ?",
		noAccount: "Vous n'avez pas de compte ?",
		hasAccount: "Vous avez déjà un compte ?",
		signUp: "S'inscrire",
		signIn: "Se connecter",
		emailPlaceholder: "Entrez votre email",
		passwordPlaceholder: "Entrez votre mot de passe",
		confirmPasswordPlaceholder: "Confirmez votre mot de passe",
		usernamePlaceholder: "Choisissez un nom d'utilisateur",
		fullNamePlaceholder: "Entrez votre nom complet",
		otpTitle: "Entrer le code de vérification",
		otpSubtitle: "Nous avons envoyé un code à votre email",
		checkEmailMessage:
			"Veuillez vérifier votre email pour le code de vérification à 7 chiffres.",
		otpPlaceholder: "Entrez le code à 6 chiffres",
		otpSuccess: "Code vérifié avec succès !",
		otpError: "Code invalide ou expiré. Veuillez réessayer.",
		otpInvalid: "Veuillez entrer un code valide à 7 chiffres",
		verifyOtp: "Vérifier le code",
		resendCode: "Renvoyer le code",
		resendSuccess: "Code de vérification envoyé avec succès !",
		resendError: "Échec de l'envoi du code. Veuillez réessayer.",
		passwordResetTitle: "Réinitialiser le mot de passe",
		passwordResetSubtitle:
			"Entrez votre email pour recevoir les instructions de réinitialisation",
		passwordResetSuccess:
			"Instructions de réinitialisation envoyées à votre email !",
		passwordResetError:
			"Impossible d'envoyer les instructions. Veuillez réessayer.",
		passwordResetCompleteSuccess:
			"Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.",
		passwordResetCompleteError:
			"Échec de la réinitialisation du mot de passe. Veuillez réessayer.",
		resetPassword: "Réinitialiser le mot de passe",
		newPassword: "Nouveau mot de passe",
		confirmNewPassword: "Confirmer le nouveau mot de passe",
		backToLogin: "Retour à la connexion",
		emailExists: "Cet email est déjà pris",
		usernameExists: "Ce nom d'utilisateur est déjà pris",
		emailAvailable: "Cet email est disponible",
		usernameAvailable: "Ce nom d'utilisateur est disponible",
		emailChecking: "Vérification de la disponibilité...",
		usernameChecking: "Vérification de la disponibilité...",
		passwordsMatch: "Les mots de passe correspondent",
		passwordsDontMatch: "Les mots de passe ne correspondent pas",
		passwordTooShort: "Le mot de passe doit comporter au moins 8 caractères",
		invalidEmail: "Veuillez entrer une adresse email valide",
		usernameTooShort:
			"Le nom d'utilisateur doit comporter au moins 3 caractères",
		logoutSuccess: "Déconnexion réussie !",
		logoutError: "Échec de la déconnexion. Veuillez réessayer.",
		emailVerificationSuccess: "Email vérifié avec succès !",
		emailVerificationError:
			"Échec de la vérification de l'email. Veuillez réessayer.",
		verifyAccountTitle: "Vérifiez votre compte",
		verifyAccountSubtitle:
			"Entrez le code de vérification envoyé à votre email",
		verifyAccountSuccess: "Compte vérifié avec succès ! Bienvenue à LOSLC !",
		verifyAccountError:
			"Échec de la vérification du compte. Veuillez réessayer.",
		verifyAccountButton: "Vérifier le compte",
		accountAlreadyVerified: "Votre compte a déjà été vérifié.",
		resendVerification: "Renvoyer le code de vérification",
		welcomeBack: "Bon retour",
		createAccount: "Créer un compte",
		enterCredentials: "Entrez vos identifiants pour accéder à votre compte",
		createAccountDescription:
			"Remplissez vos informations pour créer votre compte",
		alreadyHaveAccount: "Vous avez déjà un compte ?",
		username: "Nom d'utilisateur",
		fullName: "Nom complet",
		confirmPassword: "Confirmer le mot de passe",
		newPasswordPlaceholder: "Entrez votre nouveau mot de passe",
		confirmNewPasswordPlaceholder: "Confirmez votre nouveau mot de passe",
		enterNewPassword: "Entrez votre nouveau mot de passe",
		sendResetLink: "Envoyer le lien de réinitialisation",
		proceedToLogin: "Aller à la connexion",
		tryAgain: "Réessayer",
		verificationLinkInvalid: "Le lien de vérification est invalide ou expiré",
		accountVerificationComplete: "Votre compte a été vérifié avec succès !",
		verificationCompleteSubtitle:
			"Vous pouvez maintenant accéder à toutes les fonctionnalités",
		verifyAccountPageSubtitle:
			"Veuillez vérifier votre email et cliquer sur le lien de vérification",
		emailVerificationRequired: "Vérification de l'email requise",
		clickLinkInEmail:
			"Veuillez cliquer sur le lien de vérification envoyé à votre email",
		verifyAccount: "Vérifier le compte",
		verifyingEmail: "Vérification de votre email...",
		invalidVerificationLink: "Lien de vérification invalide",
		registrationSuccess:
			"Inscription réussie ! Veuillez vérifier votre email pour valider votre compte.",
		otpVerificationSuccess: "OTP vérifié avec succès ! Bienvenue à LOSLC !",
		otpSentToEmail: "Nous avons envoyé un code à 6 chiffres à votre email",
		enterOtp: "Entrer le code de vérification",
		otpInstructions: "Entrez le code à 6 chiffres envoyé à votre email",
		otpCode: "Code OTP",
		otpDigit: "Chiffre OTP {{digit}}",
		verifying: "Vérification...",
		verifyCode: "Vérifier le code",
		didntReceiveCode: "Vous n'avez pas reçu le code ?",
		sendingCode: "Envoi...",
		newOtpSent: "Nouveau code OTP envoyé avec succès ! Consultez votre email.",
		otpResent: "Le code OTP a été renvoyé à votre email",
		wrongEmail: "Mauvaise adresse email ?",
		otpRequired: "Veuillez entrer le code complet à 7 chiffres",
		invalidResetLink: "Lien de réinitialisation invalide",
		resetPasswordSubtitle: "Créez un nouveau mot de passe pour votre compte",
		forgotPasswordSubtitle:
			"Entrez votre email pour recevoir un lien de réinitialisation",
		pleaseWait: "Veuillez patienter pendant que nous vérifions votre email...",
		missingVerificationParams:
			"Lien de vérification invalide. Veuillez vérifier votre email pour le bon lien.",
		verificationComplete: "Vérification terminée",
		emailVerification: "Vérification de l'email",
		welcomeToLoslc: "Bienvenue à LOSLC ! Votre compte est maintenant actif.",
		verifyEmailDescription:
			"Nous vérifions votre adresse email pour terminer votre inscription.",
		passwordResetInstructions:
			"Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
		rememberedPassword: "Vous vous souvenez de votre mot de passe ?",
		resetLinkExpired: "Ce lien de réinitialisation a expiré ou est invalide.",
		requestNewResetLink: "Demander un nouveau lien de réinitialisation",
		createNewPassword: "Créer un nouveau mot de passe",
		chooseSecurePassword: "Choisissez un mot de passe fort pour votre compte.",
		resettingPassword: "Réinitialisation du mot de passe...",
		tokenRequired: "Le jeton de vérification est requis",
		enterVerificationToken:
			"Veuillez entrer le jeton de vérification reçu par email",
		verificationToken: "Jeton de vérification",
		verificationTokenDescription:
			"Entrez le jeton de vérification de l'email de réinitialisation du mot de passe",
		enterTokenFromEmail: "Entrez le jeton reçu par email",
	},
	hero: {
		badgeText: "Communauté de passionnés Linux & Open-Source",
		title: "Code ton",
		titleHighlight: "avenir",
		titleSuffix: "en",
		titleLocation: "Afrique",
		subtitle:
			"Accompagner les jeunes développeurs africains à travers le mentorat, la cybersécurité, des projets open-source, et une communauté tech solidaire.",
		features: {
			openSource: "Projets Open Source",
			cybersecurity: "Formation en cybersécurité",
			mentorship: "Programmes de mentorat",
		},
		cta: {
			primary: "Commencer",
			secondary: "Rejoindre Discord",
		},
		stats: {
			members: "600+ Membres",
			projects: "3+ Projets",
			countries: "5+ Pays",
		},
	},
	dashboard: {
		title: "Bienvenue sur votre Tableau de bord",
		subtitle:
			"Gérez votre profil et vos préférences. Téléversez un avatar, mettez à jour vos informations, et consultez l'état de votre compte en un coup d'œil.",
		overviewTitle: "Aperçu du Tableau de bord",
		overviewSubtitle:
			"Un coup d'œil rapide à l'état de votre compte et à l'activité récente.",
		email: "Email",
		username: "Nom d'utilisateur",
		fullName: "Nom complet",
		fullNamePh: "Comment devons-nous vous appeler ?",
		fullNameHint: "Votre nom affiché publiquement sur le site.",
		verified: "Vérifié",
		yes: "Oui",
		no: "Non",
		logout: "Se déconnecter",
		loggingOut: "Déconnexion...",
		profile: "Profil",
		changeAvatar: "Changer d'avatar",
		avatarHint:
			"Utilisez une image carrée (JPG/PNG). Max 2Mo pour de meilleurs résultats.",
		accountInfo: "Informations du compte",
		accountOverview: "Aperçu du compte",
		memberSince: "Membre depuis",
		verification: "Vérification",
		verifiedYes: "Vérifié",
		verifiedNo: "Non vérifié",
		quickActions: "Actions rapides",
		quickHint:
			"Astuce : Gardez votre profil à jour pour aider les autres à vous reconnaître dans la communauté.",
		quickForum: "Voir le Forum",
		quickForumHint: "Voir les discussions et participer.",
		quickBlog: "Voir le Blog",
		quickBlogHint: "Dernières mises à jour et articles.",
		actionUpdateName: "Ajouter votre nom complet",
		actionUploadAvatar: "Téléverser une photo de profil",
		actionExploreForum: "Explorer le forum et démarrer une discussion",
		save: "Enregistrer",
		updateSuccess: "Profil mis à jour",
		updateError: "Échec de la mise à jour du profil",
		avatarSuccess: "Photo de profil mise à jour",
		avatarError: "Échec de la mise à jour de l'avatar",
	},
	forum: {
		badge: "Forum Communautaire",
		title: "Discuter, Demander, Partager",
		subtitle:
			"Obtenez de l'aide, partagez des connaissances et collaborez avec la communauté.",
		searchPlaceholder: "Rechercher des sujets, titres ou auteurs...",
		latest: "Dernières discussions",
		create: "Créer un post",
		emptyTitle: "Aucun post pour le moment",
		emptyText: "Lancez la première discussion en créant un nouveau post.",
		card: {
			type: "Post",
		},
		editPage: {
			title: "Modifier le post",
			back: "Retour au post",
			actions: {
				save: "Enregistrer les modifications",
				saving: "Enregistrement...",
			},
		},
		createPage: {
			title: "Créer une nouvelle discussion",
			back: "Retour au forum",
			fields: {
				title: "Titre",
				titlePh: "De quoi voulez-vous discuter ?",
				content: "Contenu",
				contentPh:
					"Fournissez des détails, du contexte et ce que vous avez essayé...",
				tags: "Tags",
				tagsPh: "Tapez pour chercher ou créer…",
			},
			actions: {
				create: "Créer le post",
				creating: "Création...",
				cancel: "Annuler",
			},
			hints: {
				markdown: "Astuce : Vous pouvez utiliser du Markdown dans le contenu.",
			},
		},
		detail: {
			edit: "Modifier",
			loadingPost: "Chargement du post...",
			notFound: "Post introuvable",
			comments: "Commentaires",
			loadingComments: "Chargement des commentaires...",
			addComment: "Ajouter un commentaire",
			commentPh: "Écrivez votre commentaire...",
			commentBtn: "Commenter",
			loginToComment: "Vous devez être connecté pour commenter.",
		},
		tags: {
			suggestions: "Suggestions",
			noResults: "Aucun tag trouvé",
			create: 'Créer "{{name}}"',
			removeTag: "Retirer le tag {{tag}}",
		},
	},
	mission: {
		title: "Notre Mission",
		subtitle:
			"Autonomiser l'Afrique grâce à Linux, aux logiciels libres, à l'excellence en cybersécurité et à l'innovation collaborative",
		missionStatement:
			"Démocratiser l'accès à l'éducation technologique et favoriser une communauté florissante d'enthousiastes Linux, Open-Source et Cybersécurité à travers l'Afrique, en donnant aux individus les moyens de devenir créateurs, innovateurs et leaders dans l'économie numérique sécurisée.",
		visionTitle: "Notre Vision",
		visionDescription:
			"Nous envisageons une Afrique où la technologie n'est pas seulement consommée mais créée, où chaque individu a l'opportunité de participer à la révolution numérique, et où les principes open-source stimulent l'innovation et la croissance économique.",
		vision2030:
			"D'ici 2030, nous voyons LOSL-C comme la communauté technologique de premier plan en Afrique de l'Ouest, ayant formé des milliers de développeurs, d'administrateurs système et d'entrepreneurs technologiques qui dirigent la transformation numérique du continent.",
		imageCaption:
			"Construire l'avenir de la technologie africaine, un membre de la communauté à la fois",
		statistics: {
			members: {
				number: "600+",
				label: "Membres de la communauté",
			},
			workshops: {
				number: "10+",
				label: "Ateliers organisés",
			},
			cities: {
				number: "5+",
				label: "Villes atteintes",
			},
		},
		coreValuesTitle: "Nos Valeurs Fondamentales",
		coreValuesSubtitle:
			"Les principes qui guident notre communauté et façonnent notre approche de l'éducation technologique",
		impactGoalsTitle: "Nos Objectifs d'Impact",
		impactGoalsSubtitle: "Objectifs mesurables qui motivent notre mission",
		guidingPrinciplesTitle: "Nos Principes Directeurs",
		guidingPrinciplesSubtitle:
			"Les croyances fondamentales qui façonnent notre fonctionnement et le service à notre communauté",
		joinMissionTitle: "Rejoignez Notre Mission",
		joinMissionText:
			"Faites partie du mouvement qui façonne l'avenir de la technologie en Afrique. Ensemble, nous pouvons construire un écosystème numérique plus inclusif et innovant.",
		values: {
			openSource: {
				title: "Passion pour l'Open Source",
				description:
					"Nous croyons au pouvoir transformateur des logiciels open-source et à la liberté qu'ils apportent aux utilisateurs et développeurs.",
			},
			cybersecurity: {
				title: "Excellence en Cybersécurité",
				description:
					"Nous priorisons l'éducation et la pratique de la sécurité, en nous assurant que notre communauté soit équipée pour construire et maintenir des systèmes sécurisés.",
			},
			community: {
				title: "Communauté d'Abord",
				description:
					"Notre communauté est au cœur de tout ce que nous faisons. Nous priorisons la collaboration, le soutien mutuel et la participation inclusive.",
			},
			knowledge: {
				title: "Partage de Connaissances",
				description:
					"Nous croyons que la connaissance doit être librement partagée et accessible à tous, favorisant l'apprentissage et la croissance continus.",
			},
			innovation: {
				title: "Innovation Africaine",
				description:
					"Nous nous engageons à présenter et favoriser l'innovation technologique à travers le continent africain.",
			},
			learning: {
				title: "Apprentissage Continu",
				description:
					"Nous embrassons une culture d'apprentissage tout au long de la vie, encourageant la curiosité et la poursuite de nouvelles compétences et connaissances.",
			},
			excellence: {
				title: "Excellence Technique",
				description:
					"Nous visons des standards élevés en compétences techniques tout en maintenant l'accessibilité pour les apprenants de tous niveaux.",
			},
		},
		goals: {
			community: {
				title: "Construire une Communauté Florissante",
				description:
					"Créer un écosystème vibrant de 1000+ membres actifs à travers l'Afrique de l'Ouest d'ici 2026",
				metrics: "Actuellement : 600+ membres",
			},
			education: {
				title: "Démocratiser l'Éducation Technologique",
				description:
					"Fournir une éducation technique gratuite et de haute qualité aux communautés mal desservies",
				metrics: "Objectif : 100+ ateliers annuellement",
			},
			openSource: {
				title: "Favoriser la Contribution Open Source",
				description:
					"Encourager et soutenir les développeurs africains à contribuer aux projets open-source mondiaux",
				metrics: "Objectif : 50+ contributeurs actifs",
			},
			digital: {
				title: "Combler la Fracture Numérique",
				description:
					"Rendre la technologie accessible et pertinente aux contextes et défis africains locaux",
				metrics: "Impact : 5+ villes atteintes",
			},
		},
		principles: {
			inclusivity: {
				title: "Inclusivité et Accessibilité",
				description:
					"Nous accueillons des personnes de tous horizons, niveaux de compétence et perspectives. La technologie doit être accessible à tous, indépendamment du statut économique ou du niveau d'éducation.",
			},
			practical: {
				title: "Apprentissage Pratique",
				description:
					"Nous nous concentrons sur des expériences d'apprentissage pratiques et concrètes qui s'appliquent directement aux scénarios du monde réel et au développement de carrière.",
			},
			cultural: {
				title: "Pertinence Culturelle",
				description:
					"Nous nous assurons que nos programmes et projets abordent les défis africains locaux et tirent parti de l'innovation et de la créativité locales.",
			},
			sustainability: {
				title: "Durabilité",
				description:
					"Nous construisons des programmes durables qui peuvent croître et évoluer avec notre communauté, assurant un impact et une valeur à long terme.",
			},
			collaboration: {
				title: "Collaboration Plutôt que Compétition",
				description:
					"Nous croyons au pouvoir de la collaboration et du soutien mutuel plutôt qu'à la compétition individuelle, favorisant un environnement d'apprentissage solidaire.",
			},
			freedom: {
				title: "Liberté par la Technologie",
				description:
					"Nous plaidons pour la liberté numérique, les droits à la vie privée et l'utilisation de la technologie comme outil d'autonomisation et de libération.",
			},
		},
		callToActionTitle: "Rejoignez Notre Mission",
		callToActionDescription:
			"Que vous soyez étudiant, professionnel, ou simplement passionné par la technologie et la communauté, il y a une place pour vous dans la famille LOSLC.",
		getInvolvedButton: "Impliquez-vous Aujourd'hui",
	},
	learnMore: {
		title: "Notre Histoire",
		subtitle:
			"Découvrez le parcours de LOSL-C et les personnes passionnées qui rendent notre communauté spéciale",
		howItStartedTitle: "Comment Tout a Commencé",
		howItStartedText1:
			"LOSL-C est née d'une observation simple : alors que la technologie progressait rapidement à l'échelle mondiale, de nombreuses communautés en Afrique manquaient d'accès à une éducation technique de qualité et aux connaissances open-source.",
		howItStartedText2:
			"Ce qui a commencé comme des rencontres informelles entre amis passionnés de Linux s'est transformé en une communauté dynamique de plus de 500 membres à travers l'Afrique de l'Ouest. Nous croyons que la technologie devrait être accessible à tous, indépendamment de leur origine ou de leur localisation.",
		howItStartedText3:
			"Aujourd'hui, nous ne sommes pas seulement un groupe d'utilisateurs Linux - nous sommes une famille de développeurs, d'administrateurs système, d'étudiants et d'enthousiastes technologiques travaillant ensemble pour construire un meilleur avenir technologique pour l'Afrique.",
		journeyTitle: "Notre Parcours",
		journeySubtitle:
			"Étapes clés de la croissance et du développement de notre communauté",
		adminsTitle: "Rencontrez Nos Administrateurs",
		adminsSubtitle: "Les leaders dévoués qui font prospérer notre communauté",
		joinStoryTitle: "Voulez-vous Faire Partie de Notre Histoire ?",
		joinStoryText:
			"Chaque grande communauté est construite par ses membres. Rejoignez-nous et aidez à écrire le prochain chapitre de l'avancement technologique en Afrique.",
		milestones: {
			founded: {
				title: "Fondation de la Communauté",
				description:
					"Commencé comme un petit groupe d'enthousiastes Linux à Lomé",
			},
			firstWorkshop: {
				title: "Premier Atelier",
				description:
					"Organisé notre premier atelier d'installation Linux pour débutants",
			},
			hundredMembers: {
				title: "100 Membres",
				description: "Atteint notre premier jalon majeur de 100 membres actifs",
			},
			expansion: {
				title: "Expansion Régionale",
				description:
					"Étendu notre portée à d'autres villes à travers le Togo et l'Afrique de l'Ouest",
			},
			openSourceProjects: {
				title: "Projets Open Source",
				description:
					"Lancé plusieurs projets open source menés par la communauté",
			},
		},
		imageCaption: "Un de nos premiers ateliers communautaires à Lomé, Togo",
		specialties: "Spécialités :",
		admins: {
			daniel: {
				role: "Fondateur et Administrateur Principal",
				bio: "Défenseur passionné de Linux. A créé LOSL-C pour combler le fossé technologique en Afrique.",
				specialties: [
					"Développement Logiciel",
					"Administration Système Linux",
					"Construction de Communauté",
				],
			},
			rayane: {
				role: "Gestionnaire de Contenu",
				bio: "Expert en communication numérique. Crée le beau contenu que vous voyez sur nos plateformes et gère la sensibilisation communautaire.",
				specialties: [
					"Création de Contenu",
					"Programmes de Mentorat",
					"Planification d'Événements",
				],
			},
			emerick: {
				role: "Spécialiste et Formateur en Cybersécurité",
				bio: "Emerick est le patron des patrons en matière de cybersécurité. Il dirige nos programmes de formation en cybersécurité et s'assure que notre communauté reste en sécurité en ligne.",
				specialties: [
					"Cybersécurité",
					"Formation",
					"Sécurité Communautaire et Engagement",
				],
			},
			laureen: {
				role: "Gestionnaire de Communications",
				bio: "Cette girl boss est la voix de LOSL-C. Elle gère toutes nos communications, réseaux sociaux et relations publiques.",
				specialties: ["Développement Web", "Cybersécurité", "Communications"],
			},
			kallern: {
				role: "Testeur de Pénétration WEB et Formateur",
				bio: "Bien qu'il soit très humble, Kallern est maître dans son domaine. Il se spécialise dans les tests de pénétration web et dirige nos sessions de formation sur les meilleures pratiques de cybersécurité.",
				specialties: [
					"Développement Web",
					"Cybersécurité",
					"Engagement Communautaire",
				],
			},
			bayedze: {
				role: "Spécialiste en Cybersécurité, Collecteur de Renseignements et Planificateur d'Événements",
				bio: "Sans ce gars, les événements de LOSL-C ne seraient pas aussi réussis. Bayédzè est le calme dans la tempête, gérant nos événements et s'assurant que tout se déroule sans accroc.",
				specialties: [
					"Développement Web",
					"Administration Système",
					"Cybersécurité",
				],
			},
			denise: {
				role: "Développeuse Web et Formatrice",
				bio: "Cette dame est le professeur que vous auriez aimé avoir à l'école. Denise est une développeuse web et formatrice qui aide nos membres à apprendre les compétences dont ils ont besoin pour réussir dans la tech.",
				specialties: ["Développement Web", "Formation", "Gestion de Projet"],
			},
			abdou: {
				role: "Développeur Web et Collecteur de Renseignements",
				bio: "Abdou-Jabar est un développeur web et collecteur de renseignements qui aide notre communauté à rester informée des dernières tendances et technologies de l'industrie.",
				specialties: [
					"Développement Web",
					"Collecte de Renseignements",
					"Tendances",
				],
			},
		},
	},
	join: {
		title: "Tous nos liens en un seul endroit",
		badge: "Rejoindre la communauté",
		subtitle:
			"Connectez-vous avec LOSL-C sur toutes les plateformes. Choisissez votre favorite et dites bonjour.",
		open: "Ouvrir",
		cards: {
			discord: {
				title: "Discord",
				description:
					"Discutez avec la communauté, posez des questions et participez aux événements.",
			},
			whatsapp: {
				title: "WhatsApp",
				description:
					"Recevez des mises à jour rapides et connectez-vous avec les membres sur WhatsApp.",
			},
			linkedin: {
				title: "LinkedIn",
				description:
					"Suivez nos mises à jour professionnelles et les jalons de la communauté.",
			},
			instagram: {
				title: "Instagram",
				description:
					"Voyez les photos des rencontres, ateliers et moments communautaires.",
			},
			x: {
				title: "X (Twitter)",
				description:
					"Recevez les annonces, threads et nouvelles rapides de la communauté.",
			},
			github: {
				title: "GitHub",
				description:
					"Explorez nos projets, contribuez et étoilez les dépôts que vous aimez.",
			},
		},
	},

	codeOfConduct: {
		title: "Code de Conduite",
		subtitle:
			"Construire une communauté accueillante, inclusive et respectueuse pour tous",
		lastUpdated: "Dernière mise à jour : Janvier 2025",
		commitmentTitle: "Notre Engagement",
		commitmentText1:
			"LOSL-C s'engage à fournir un environnement accueillant, sûr et inclusif pour tous les membres de la communauté, indépendamment de leur origine, identité ou niveau d'expérience. Nous croyons que les perspectives diverses renforcent notre communauté et font avancer notre mission de promotion des technologies Linux et Open-Source à travers l'Afrique.",
		commitmentText2:
			"Ce Code de Conduite décrit nos attentes pour tous les membres de la communauté et fournit des directives pour créer un environnement positif et productif pour l'apprentissage et la collaboration.",
		valuesTitle: "Nos Valeurs",
		expectedBehaviorTitle: "Comportement Attendu",
		expectedBehaviorText: "Tous les membres de la communauté sont attendus à :",
		unacceptableBehaviorTitle: "Comportement Inacceptable",
		unacceptableBehaviorText:
			"Les comportements suivants ne sont pas tolérés dans notre communauté :",
		expected: {
			items: [
				{
					title: "Être respectueux et bienveillant",
					description:
						"Traiter les autres avec courtoisie et empathie, même en cas de désaccord",
				},
				{
					title: "Utiliser un langage inclusif",
					description:
						"Choisir des mots qui accueillent et incluent tous les membres de la communauté",
				},
				{
					title: "Partager les connaissances",
					description:
						"Contribuer aux discussions et aider les autres à apprendre",
				},
				{
					title: "Respecter les différentes perspectives",
					description:
						"Valoriser les points de vue divers et les approches de résolution de problèmes",
				},
				{
					title: "Donner des commentaires constructifs",
					description:
						"Fournir des commentaires utiles, spécifiques et exploitables",
				},
				{
					title: "Aider les nouveaux arrivants",
					description:
						"Accueillir les nouveaux membres et les aider à naviguer dans la communauté",
				},
				{
					title: "Respecter la vie privée",
					description:
						"Ne pas partager d'informations personnelles sans consentement",
				},
			],
		},
		unacceptable: {
			items: [
				{
					title: "Harcèlement et discrimination",
					description:
						"Basés sur la race, le genre, l'orientation sexuelle, la religion, la nationalité, l'âge, le handicap ou toute autre caractéristique",
				},
				{
					title: "Contenu offensant ou inapproprié",
					description:
						"Y compris le langage et les images sexuels, violents ou discriminatoires",
				},
				{
					title: "Attaques personnelles",
					description:
						"Insultes, trolling ou commentaires délibérément inflammatoires",
				},
				{
					title: "Spam et auto-promotion",
					description:
						"Auto-promotion excessive, publicité ou contenu hors sujet",
				},
				{
					title: "Doxxing et violations de la vie privée",
					description:
						"Partager les informations privées de quelqu'un sans permission",
				},
				{
					title: "Violations de propriété intellectuelle",
					description:
						"Partager du matériel protégé par des droits d'auteur sans autorisation appropriée",
				},
				{
					title: "Comportement perturbateur",
					description:
						"Perturber délibérément les discussions, événements ou activités communautaires",
				},
			],
		},
		reporting: {
			title: "Signalement et Application",
			howToIntro:
				"Si vous vivez ou êtes témoin d'un comportement qui viole ce Code de Conduite, veuillez le signaler immédiatement :",
			howToItems: [
				"Email : support@loslc.tech (surveillé par les modérateurs de la communauté)",
				"Contacter directement tout administrateur ou modérateur de la communauté",
				"Utiliser la fonction de signalement sur nos plateformes lorsqu'elle est disponible",
			],
			includeIntro: "Lors du signalement, veuillez inclure :",
			includeItems: [
				"Description de l'incident",
				"Où et quand cela s'est produit",
				"Captures d'écran ou preuves si disponibles",
				"Noms des personnes impliquées (si connus)",
				"Tout contexte supplémentaire qui pourrait être utile",
			],
			responseTitle: "Notre Réponse",
			responseText:
				"Tous les signalements seront examinés rapidement et confidentiellement. Nous nous engageons à créer un environnement sûr et prendrons les mesures appropriées, qui peuvent inclure des avertissements, une suspension temporaire ou un retrait permanent de la communauté.",
		},
		consequencesTitle: "Conséquences",
		consequencesText1:
			"Les violations de ce Code de Conduite peuvent entraîner :",
		consequencesText2:
			"La gravité des conséquences dépend de la nature et de la fréquence des violations. Nous pouvons sauter des étapes pour les violations graves qui menacent la sécurité ou le bien-être des membres de la communauté.",
		consequences: {
			items: [
				{
					step: "1",
					title: "Avertissement",
					description: "Discussion privée sur le comportement et les attentes",
				},
				{
					step: "2",
					title: "Suspension temporaire",
					description:
						"Retrait temporaire des activités et plateformes communautaires",
				},
				{
					step: "3",
					title: "Bannissement permanent",
					description:
						"Retrait permanent de tous les services et événements communautaires",
				},
			],
		},
		scopeTitle: "Portée",
		scopeText:
			"Ce Code de Conduite s'applique à tous les espaces communautaires LOSL-C, y compris :",
		scope: {
			items: [
				"Forums en ligne, plateformes de chat et réseaux sociaux",
				"Événements en personne, ateliers et rencontres",
				"Espaces de collaboration de projets",
				"Communications par email et messages privés entre membres de la communauté",
				"Tout autre espace où vous représentez ou interagissez avec la communauté LOSL-C",
			],
		},
		appealsTitle: "Processus d'Appel",
		appealsText1:
			"Si vous croyez avoir été injustement sanctionné sous ce Code de Conduite, vous pouvez faire appel en :",
		appeals: {
			items: [
				"Envoyant un email à support@loslc.tech dans les 30 jours de la décision",
				"Incluant une explication détaillée de pourquoi vous croyez que la décision était injuste",
				"Fournissant toute preuve ou contexte supplémentaire",
			],
		},
		appealsText2:
			"Les appels seront examinés par les leaders communautaires qui n'étaient pas impliqués dans la décision originale.",
		contactTitle: "Nous Contacter",
		contactText:
			"Nous accueillons les questions et commentaires sur ce Code de Conduite. Si vous avez des suggestions d'amélioration ou besoin de clarification sur un point, veuillez nous contacter :",
		contact: {
			emailLabel: "Email",
			communityDiscussion: "Discussion Communautaire",
		},
		acknowledgementsTitle: "Remerciements",
		acknowledgementsText:
			"Ce Code de Conduite s'inspire et s'adapte du Contributor Covenant, du Code de Conduite Django et d'autres directives communautaires open-source. Nous remercions ces communautés pour leur travail pionnier dans la création d'espaces inclusifs et accueillants pour la collaboration.",
	},
	termsOfService: {
		title: "Conditions d'Utilisation",
		subtitle:
			"Termes et conditions d'utilisation des services de la communauté LOSL-C",
		lastUpdated: "Dernière mise à jour : Janvier 2025",
		acceptanceTitle: "Acceptation des Conditions",
		acceptanceText1:
			"En accédant ou en utilisant les services de la communauté LOSL-C, y compris notre site web, événements, forums et autres plateformes, vous acceptez d'être lié par ces Conditions d'Utilisation (\"Conditions\"). Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne pouvez pas accéder ou utiliser nos services.",
		acceptanceText2:
			"Ces Conditions s'appliquent à tous les visiteurs, utilisateurs et autres qui accèdent ou utilisent nos services.",
		servicesTitle: "Services Communautaires",
		servicesText:
			"LOSL-C fournit les services suivants pour promouvoir l'éducation Linux et logiciels Open-Source :",
		accountTitle: "Comptes Utilisateur et Inscription",
		acceptableUseTitle: "Politique d'Utilisation Acceptable",
		contentTitle: "Contenu et Propriété Intellectuelle",
		eventsTitle: "Événements et Ateliers",
		privacyTitle: "Confidentialité et Protection des Données",
		privacyText:
			"Votre confidentialité est importante pour nous. Notre collecte, utilisation et protection de vos informations personnelles sont régies par notre Politique de Confidentialité, qui est incorporée dans ces Conditions par référence. Veuillez consulter notre Politique de Confidentialité pour comprendre nos pratiques de données.",
		terminationTitle: "Résiliation",
		terminationText1:
			"Nous pouvons résilier ou suspendre votre accès à nos services immédiatement, sans préavis, pour une conduite que nous croyons violer ces Conditions ou être nuisible à d'autres utilisateurs ou à la communauté.",
		terminationText2:
			"Vous pouvez résilier votre compte à tout moment en nous contactant. Lors de la résiliation, votre droit d'utiliser nos services cessera immédiatement.",
		changesTitle: "Modifications des Conditions",
		changesText:
			'Nous nous réservons le droit de modifier ces Conditions à tout moment. Nous informerons les utilisateurs des changements matériels en publiant les Conditions mises à jour sur notre site web et en mettant à jour la date "Dernière mise à jour". Votre utilisation continue de nos services après les changements constitue l\'acceptation des Conditions mises à jour.',
		governingLawTitle: "Loi Applicable et Résolution de Litiges",
		governingLawText1:
			"Ces Conditions sont régies par les lois du Togo. Tout litige découlant de ces Conditions ou de votre utilisation de nos services sera résolu par négociation de bonne foi.",
		governingLawText2:
			"Si les litiges ne peuvent être résolus par négociation, ils peuvent être soumis à médiation ou arbitrage selon les lois togolaises.",
		contactTitle: "Informations de Contact",
		contactText:
			"Si vous avez des questions sur ces Conditions d'Utilisation, veuillez nous contacter :",
		services: {
			items: {
				item1: "Ateliers éducatifs et sessions de formation technique",
				item2: "Forums communautaires et plateformes de discussion",
				item3: "Opportunités de collaboration sur projets open-source",
				item4: "Événements de réseautage et rencontres",
				item5: "Ressources techniques et documentation",
				item6: "Programmes de mentorat et d'orientation de carrière",
			},
		},
		account: {
			sections: {
				creationTitle: "Création de Compte",
				creationText:
					"Pour accéder à certains services, vous devrez peut-être créer un compte. Vous devez fournir des informations exactes, actuelles et complètes lors de l'inscription et maintenir vos informations de compte à jour.",
				securityTitle: "Sécurité du Compte",
				securityText:
					"Vous êtes responsable de maintenir la confidentialité de vos identifiants de compte et de toutes les activités qui se produisent sous votre compte. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte.",
				eligibilityTitle: "Éligibilité",
				eligibilityText:
					"Nos services sont ouverts aux individus de tous niveaux de compétence intéressés par les technologies Linux et Open-Source. Les utilisateurs de moins de 18 ans doivent avoir le consentement parental pour participer aux activités communautaires.",
			},
		},
		acceptableUse: {
			permittedTitle: "Utilisations Autorisées",
			permittedText:
				"Vous pouvez utiliser nos services à des fins éducatives, collaboratives et de développement professionnel liées aux technologies Linux et Open-Source.",
			prohibitedTitle: "Activités Interdites",
			prohibitedIntro: "Vous acceptez de ne pas :",
			prohibitedItems: {
				item1:
					"Utiliser nos services à des fins illégales ou en violation de toute loi applicable",
				item2: "Harceler, abuser ou nuire à d'autres membres de la communauté",
				item3: "Publier du spam, des malwares ou du contenu malveillant",
				item4: "Violer les droits de propriété intellectuelle d'autrui",
				item5: "Partager du contenu inapproprié, offensant ou discriminatoire",
				item6:
					"Tenter d'obtenir un accès non autorisé à nos systèmes ou aux comptes d'autres utilisateurs",
				item7: "Interférer avec ou perturber le fonctionnement de nos services",
				item8:
					"Utiliser nos services à des fins commerciales sans consentement écrit préalable",
			},
		},
		content: {
			userGeneratedTitle: "Contenu Généré par l'Utilisateur",
			userGeneratedText:
				"Vous conservez la propriété du contenu que vous créez et partagez dans notre communauté. En publiant du contenu, vous accordez à LOSL-C une licence non exclusive et libre de redevances d'utiliser, d'afficher et de distribuer votre contenu à des fins communautaires.",
			loslcContentTitle: "Contenu LOSL-C",
			loslcContentText:
				"Les matériels éducatifs, la documentation et les ressources créées par LOSL-C sont généralement disponibles sous licences open-source. Les termes de licence spécifiques seront clairement indiqués pour chaque ressource.",
			ipRespectTitle: "Respect des Droits de PI",
			ipRespectText:
				"Vous devez respecter les droits de propriété intellectuelle d'autrui. Ne partagez pas de matériels protégés par des droits d'auteur sans autorisation ou attribution appropriée.",
		},
		events: {
			registrationTitle: "Inscription et Participation",
			registrationText:
				"L'inscription à l'événement peut être requise pour certains ateliers et rencontres. Nous nous réservons le droit de limiter la participation en fonction de la capacité et d'autres facteurs.",
			cancellationTitle: "Politique d'Annulation",
			cancellationText:
				"Nous nous réservons le droit d'annuler ou de reprogrammer des événements en raison de circonstances imprévues. Les participants seront informés dès que possible de tout changement.",
			codeOfConductTitle: "Code de Conduite",
			codeOfConductText:
				"Tous les participants à l'événement doivent adhérer à notre Code de Conduite Communautaire. Les violations peuvent entraîner le retrait des événements et des services communautaires.",
		},
		disclaimers: {
			title: "Avertissements et Limitations",
			educationalTitle: "But Éducatif",
			educationalText:
				"Nos services sont fournis à des fins éducatives et de construction communautaire. Bien que nous nous efforcions de fournir des informations exactes et à jour, nous ne garantissons pas l'exhaustivité ou l'exactitude du contenu.",
			availabilityTitle: "Disponibilité du Service",
			availabilityText:
				"Nous fournissons nos services sur une base volontaire. Nous ne garantissons pas un accès ininterrompu à nos services et pouvons modifier ou interrompre les services à tout moment.",
			liabilityTitle: "Limitation de Responsabilité",
			liabilityText:
				"LOSL-C ne sera pas responsable de dommages indirects, accessoires, spéciaux ou consécutifs découlant de votre utilisation de nos services.",
		},
		contactDetails: {
			emailLabel: "Email",
			generalLabel: "Contact Général",
			addressLabel: "Adresse",
			legalEmail: "legal@loslc.tech",
			generalEmail: "support@loslc.tech",
			addressValue: "Communauté LOSL-C, Lomé, Togo",
		},
	},
	privacyPolicy: {
		title: "Politique de Confidentialité",
		subtitle:
			"Comment LOSL-C collecte, utilise et protège vos informations personnelles",
		lastUpdated: "Dernière mise à jour : Janvier 2025",
		sections: {
			infoCollect: {
				title: "Informations que Nous Collectons",
				personalTitle: "Informations Personnelles",
				personalDesc:
					"Lorsque vous rejoignez notre communauté ou assistez à des événements, nous pouvons collecter :",
				personalItems: [
					"Nom et adresse email",
					"Identifiants de réseaux sociaux (lorsque fournis volontairement)",
					"Niveau de compétence technique et intérêts",
					"Localisation (ville/pays) pour l'organisation d'événements",
				],
				usageTitle: "Informations d'Utilisation",
				usageDesc:
					"Nous pourrions automatiquement collecter certaines informations lorsque vous visitez notre site web :",
				usageItems: [
					"Type et version du navigateur",
					"Pages visitées et temps passé",
					"Informations sur l'appareil et le système d'exploitation",
					"Source de référence (quel site web vous a dirigé vers nous)",
				],
				note: "Note : Nous ne collectons ni ne stockons les adresses IP.",
			},
			howWeUse: {
				title: "Comment Nous Utilisons Vos Informations",
				intro:
					"Nous utilisons les informations collectées aux fins suivantes :",
				items: [
					"Organiser et annoncer des événements et ateliers communautaires",
					"Envoyer du contenu technique pertinent et des mises à jour",
					"Faciliter le réseautage entre les membres de la communauté",
					"Améliorer notre site web et nos services communautaires",
					"Répondre à vos questions et demandes de support",
					"Analyser les modèles d'utilisation pour améliorer l'expérience utilisateur",
				],
			},
			security: {
				title: "Protection et Sécurité des Données",
				securityMeasures: "Mesures de Sécurité",
				securityDesc:
					"Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles :",
				securityItems: [
					"Chiffrement des données en transit et au repos",
					"Audits et mises à jour de sécurité réguliers",
					"Accès limité aux données personnelles sur une base de besoin de savoir",
					"Hébergement sécurisé avec des fournisseurs cloud réputés",
				],
				retention: "Rétention des Données",
				retentionDesc:
					"Nous conservons vos informations personnelles seulement aussi longtemps que nécessaire pour les objectifs décrits dans cette politique ou selon les exigences légales. Les comptes inactifs peuvent être supprimés après 2 ans d'inactivité avec préavis.",
			},
			sharing: {
				title: "Partage d'Informations",
				intro:
					"Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager des informations seulement dans les circonstances suivantes :",
				items: [
					"Avec votre consentement explicite",
					"Pour se conformer aux obligations légales ou ordonnances judiciaires",
					"Pour protéger les droits et la sécurité des membres de notre communauté",
					"Avec des fournisseurs de services de confiance qui aident à faire fonctionner notre communauté (sous des accords de confidentialité stricts)",
				],
			},
			rights: {
				title: "Vos Droits",
				intro:
					"Vous avez les droits suivants concernant vos données personnelles :",
				items: [
					"Accès : Demander une copie des données personnelles que nous détenons à votre sujet",
					"Correction : Demander la correction de données inexactes ou incomplètes",
					"Suppression : Demander la suppression de vos données personnelles",
					"Portabilité : Demander le transfert de vos données vers un autre service",
					"Objection : S'opposer au traitement de vos données à des fins spécifiques",
					"Retrait : Retirer le consentement à tout moment lorsque le traitement est basé sur le consentement",
				],
				contact: "Pour exercer ces droits, veuillez nous contacter à",
			},
			cookies: {
				title: "Cookies et Suivi",
				intro:
					"Notre site web utilise un minimum de cookies et technologies similaires pour :",
				items: [
					"Se souvenir de vos préférences et paramètres",
					"Fournir des fonctionnalités de base du site web",
					"Améliorer l'expérience utilisateur",
				],
				noteStrong:
					"Nous n'utilisons pas de cookies tiers ou scripts de suivi.",
				note: "Toute analyse que nous effectuons est faite avec des outils axés sur la confidentialité qui respectent la vie privée des utilisateurs et ne suivent pas les utilisateurs à travers les sites web.",
				browser:
					"Vous pouvez contrôler les paramètres de cookies via les préférences de votre navigateur. Cependant, désactiver certains cookies peut affecter les fonctionnalités du site web.",
			},
			thirdParty: {
				title: "Services Tiers",
				intro:
					"Nous utilisons les services tiers suivants qui peuvent collecter des informations :",
				items: [
					"GitHub : Pour les dépôts de code et la gestion de projet",
					"Plateformes de Réseaux Sociaux : Pour l'engagement communautaire et le partage de contenu",
					"Services Email : Pour les communications communautaires",
				],
				privacyApproachStrong: "Approche axée sur la confidentialité :",
				privacyApproach:
					"Nous priorisons les services qui respectent la vie privée des utilisateurs et ne s'engagent pas dans le suivi inter-sites. Lorsque possible, nous utilisons des alternatives axées sur la confidentialité aux outils d'analyse et de suivi grand public.",
				review:
					"Ces services ont leurs propres politiques de confidentialité. Nous vous encourageons à les examiner.",
			},
			updates: {
				title: "Mises à Jour de Cette Politique",
				text: "Nous pouvons mettre à jour cette Politique de Confidentialité de temps en temps pour refléter les changements dans nos pratiques ou exigences légales. Nous vous informerons de tout changement matériel en publiant la politique mise à jour sur notre site web et en mettant à jour la date \"Dernière mise à jour\". L'utilisation continue de nos services après de tels changements constitue l'acceptation de la politique mise à jour.",
			},
			contact: {
				title: "Nous Contacter",
				intro:
					"Si vous avez des questions sur cette Politique de Confidentialité ou nos pratiques de données, veuillez nous contacter :",
				email: "Email",
				general: "Contact Général",
				address: "Adresse",
				addressValue: "Communauté LOSL-C, Lomé, Togo",
			},
		},
	},
	validation: {
		required: "{{field}} est requis",
		minLength: "{{field}} doit comporter au moins {{min}} caractères",
		maxLength: "{{field}} doit comporter au maximum {{max}} caractères",
		email: "Veuillez entrer une adresse email valide",
		invalidEmail: "Veuillez entrer une adresse email valide",
		passwordMatch: "Les mots de passe doivent correspondre",
		emailTaken: "Cette adresse email est déjà utilisée",
		usernameTaken: "Ce nom d'utilisateur est déjà pris",
		emailAvailable: "L'email est disponible",
		usernameAvailable: "Le nom d'utilisateur est disponible",
	},
	features: {
		title: "Ce Qui Nous Rend Spéciaux",
		subtitle:
			"Nous sommes plus que de simples utilisateurs Linux. Nous sommes une famille d'individus passionnés travaillant ensemble pour construire un meilleur avenir technologique pour l'Afrique.",
		items: {
			communityDriven: {
				title: "Communauté Motivée",
				description:
					"Une communauté vibrante d'enthousiastes Linux, Open-Source et Cybersécurité partageant connaissances et expériences.",
			},
			cybersecurityFocus: {
				title: "Focus Cybersécurité",
				description:
					"Dédiés à construire des systèmes sécurisés et à éduquer la communauté sur les meilleures pratiques de cybersécurité.",
			},
			passionFoss: {
				title: "Passion pour le FOSS",
				description:
					"Nous croyons au pouvoir des Logiciels Libres et Open Source pour transformer les vies et les communautés.",
			},
			innovationLearning: {
				title: "Innovation et Apprentissage",
				description:
					"Favoriser l'innovation par l'apprentissage continu, les ateliers et les projets collaboratifs.",
			},
			africanTechGrowth: {
				title: "Croissance Tech Africaine",
				description:
					"Promouvoir l'avancement technologique à travers l'Afrique grâce aux solutions open-source.",
			},
			securityEducation: {
				title: "Éducation en Sécurité",
				description:
					"Ateliers, tutoriels et programmes de mentorat couvrant Linux, FOSS et les connaissances en cybersécurité.",
			},
		},
	},
	about: {
		title: "Nous Sommes des Utilisateurs Linux, Mais Pas Seulement !",
		description:
			"LOSL-C est plus qu'un groupe d'utilisateurs Linux. Nous sommes des défenseurs passionnés des logiciels open-source, de l'excellence en cybersécurité, de la liberté numérique et de l'autonomisation technologique à travers l'Afrique.",
		bullets: {
			openSource: {
				title: "Développement Open Source",
				description: "Contribuer à des projets qui font la différence",
			},
			cybersecurity: {
				title: "Excellence en Cybersécurité",
				description:
					"Construire des systèmes sécurisés et éduquer sur la sécurité numérique",
			},
			sysadmin: {
				title: "Administration Système",
				description: "Maîtriser les systèmes Linux et la gestion de serveurs",
			},
			community: {
				title: "Construction de Communauté",
				description: "Favoriser la collaboration et l'échange de connaissances",
			},
		},
		cta: {
			learnMission: "Découvrir Notre Mission",
			seeProjects: "Voir Nos Projets",
		},
		banner:
			"Rejoignez 600+ développeurs passionnés, admins sys, enthousiastes tech et entrepreneurs à travers l'Afrique !",
	},
	communityStats: {
		title: "Notre Impact en Chiffres",
		subtitle:
			"Voyez comment nous grandissons et faisons la différence dans la communauté tech",
		stats: {
			members: {
				number: "600+",
				label: "Membres de la Communauté",
				description: "Contributeurs actifs et enthousiastes",
			},
			workshops: {
				number: "15+",
				label: "Ateliers de Sécurité",
				description: "Sessions de formation en cybersécurité",
			},
			events: {
				number: "10+",
				label: "Événements Organisés",
				description: "Ateliers, rencontres et conférences",
			},
			cities: {
				number: "5+",
				label: "Villes Atteintes",
				description: "À travers le Togo et l'Afrique de l'Ouest",
			},
		},
	},
	testimonials: {
		title: "Ce Que Dit Notre Communauté",
		subtitle:
			"Vraies histoires de vraies personnes qui font partie de notre incroyable famille LOSL-C",
		previous: "Précédent",
		next: "Suivant",
		items: [
			{
				role: "Passionné de Cybersécurité",
				content:
					"Les ateliers de cybersécurité m'ont aidé à comprendre les fondamentaux de sécurité Linux. Je me sens maintenant confiant pour implémenter les meilleures pratiques de sécurité dans mon travail.",
				avatar: "",
			},
			{
				role: "Membre de la Communauté",
				content:
					"Cela fait déjà 1 mois que j'ai rejoint cette communauté et j'aimerais contribuer à la construire",
				avatar: "",
			},
			{
				role: "Étudiant en Sécurité",
				content:
					"Apprendre les tests de pénétration et le durcissement de système grâce à LOSL-C a ouvert de nouvelles opportunités de carrière pour moi en cybersécurité.",
				avatar: "",
			},
			{
				role: "Membre de la Communauté",
				content:
					"Merci beaucoup, pour vous c'est peut-être petit mais pour moi, c'était génial, merci pour le dévouement que vous mettez dans vos webinaires",
				avatar: "",
			},
			{
				role: "Expert Linux et Sécurité",
				content:
					"Le partage de connaissances ici est incroyable. Tout le monde est si accueillant et prêt à aider les nouveaux arrivants à apprendre Linux et la cybersécurité",
				avatar: "",
			},
			{
				role: "Membre de la Communauté",
				content:
					"J'ai appris plus sur la sécurité Linux ces dernières semaines ici que durant des mois d'essais seul",
				avatar: "",
			},
			{
				role: "Défenseur Open Source",
				content:
					"Les ateliers sur le codage sécurisé et les outils de sécurité open-source sont fantastiques. L'esprit communautaire est ce qui rend cet endroit spécial.",
				avatar: "",
			},
			{
				role: "Membre de la Communauté",
				content:
					"J'ai trouvé ma passion pour le développement open-source sécurisé grâce à cette communauté. Le mentorat et le focus cybersécurité sont incroyables",
				avatar: "",
			},
		],
	},
	callToAction: {
		title: "Prêt à Rejoindre Notre Communauté ?",
		description:
			"Que vous soyez un expert Linux chevronné, un passionné de cybersécurité, ou que vous commenciez votre parcours open-source, il y a une place pour vous dans notre communauté. Construisons ensemble un avenir technologique sécurisé !",
		joinDiscord: "Rejoindre Notre Discord",
		attendNextEvent: "Participer au Prochain Événement",
		viewProjects: "Voir Nos Projets",
		becomeSpeaker: "Devenir Intervenant",
		tagline: "Open Source • Afrique • Technologie • Communauté",
	},
	loslCon: {
		badge: "Événement Phare à Venir",
		title: "LOSL-CON 2025",
		description:
			"LOSL-CON 2025 rassemble la communauté tech togolaise autour de la cybersécurité, l'open source et Linux. Une journée d'apprentissage, de réseautage et d'innovation technologique.",
		info: {
			date: { label: "Date", value: "22 Nov 2025" },
			location: { label: "Lieu", value: "Lomé, Togo (Hybride)" },
			countdown: { label: "Compte à rebours" },
			focus: {
				label: "Focus",
				value: "Cybersécurité • Open Source • Linux",
			},
		},
		pillars: {
			cybersecurity: {
				title: "Pistes Cybersécurité",
				text: "Plongées profondes, stratégies équipe bleue vs équipe rouge, infrastructure sécurisée, et partage de connaissances sur la réponse aux incidents réels.",
			},
			foss: {
				title: "Open Source et Linux",
				text: "Fondamentaux du noyau, flux de travail d'automatisation, culture de collaboration FOSS, et construction de communauté durable.",
			},
			collaboration: {
				title: "Collaboration et Réseautage",
				text: "Connexions significatives entre pairs, fenêtres de mentorat, présentations de projets, et apprentissage corridor.",
			},
		},
		cta: {
			heading: "Faites partie de la première expérience LOSL-CON",
			body: "Capacité limitée pour les sessions en personne. Réservez votre place tôt et aidez à façonner l'avenir de la technologie ouverte et de la pratique de sécurité défensive au Togo.",
			primary: "Manifester son Intérêt",
			secondary: "En Savoir Plus",
		},
	},
	footer: {
		quickLinks: "Liens Rapides",
		quick: {
			about: "À Propos",
			projects: "Projets",
			contact: "Contact",
		},
		contactTitle: "Nous Contacter",
		joinDiscussion: "Rejoignez nos discussions communautaires",
		location: "Lomé, Togo",
		copyrightPrefix: "© {{year}} LOSL-C.",
		copyrightSuffix: "tous droits réservés.",
		links: {
			privacy: "Politique de Confidentialité",
			terms: "Conditions d'Utilisation",
			code: "Code de Conduite",
		},
	},
	blog: {
		badge: "Blog LOSL-C",
		title: "Découvrez nos dernières perspectives",
		subtitle:
			"Explorez des articles sur Linux, l'Open Source, la Cybersécurité et les tendances technologiques qui façonnent l'avenir du paysage numérique africain.",
		searchPlaceholder: "Rechercher articles, sujets ou auteurs...",
		latest: "Derniers Articles",
		count_one: "{{count}} article trouvé",
		count_other: "{{count}} articles trouvés",
		emptyTitle: "Aucun article trouvé",
		emptyFiltered:
			"Nous n'avons trouvé aucun article correspondant à vos critères. Essayez d'ajuster vos termes de recherche ou filtres.",
		empty:
			"Aucun article de blog n'a encore été publié. Revenez bientôt pour du nouveau contenu !",
		errorTitle: "Échec du chargement des articles",
		errorText:
			"Il y a eu une erreur lors du chargement des articles de blog. Veuillez essayer de rafraîchir la page.",
		featured: "Articles en Vedette",
		noFeatured: "Aucun article en vedette pour le moment.",
		categories: "Catégories",
		popularTags: "Tags Populaires",
		recent: "Articles Récents",
		stayUpdatedTitle: "Restez Informé",
		stayUpdatedText:
			"Soyez notifié des nouveaux articles et événements communautaires.",
		subscribeCta: "S'abonner à la Newsletter",
		card: {
			article: "Article",
			featured: "En Vedette",
			minRead: "{{count}} min {{read}}",
		},
		post: {
			backToBlog: "Retour au Blog",
			breadcrumbBlog: "Blog",
			badges: {
				article: "Article",
				featured: "En Vedette",
				minRead: "{{count}} min de lecture",
			},
			meta: {
				publishedOn: "Publié {{date}}",
				views: "{{count}} vues",
				lastUpdated: "Dernière mise à jour : {{date}}",
			},
			footer: {
				heading: "Blog LOSL-C",
				tagline:
					"Explorer Linux, l'Open Source, la Cybersécurité et les tendances technologiques.",
				moreArticles: "Plus d'Articles",
				share: "Partager",
			},
			newsletter: {
				title: "Restez dans la Boucle",
				text: "Soyez notifié des nouveaux articles, événements communautaires et des dernières actualités en Linux, Open Source et Cybersécurité.",
				subscribe: "S'abonner à la Newsletter",
			},
			notFoundTitle: "Article de blog introuvable",
			notFoundText:
				"L'article que vous recherchez n'existe pas ou a été déplacé.",
		},
		like: {
			mustLogin: "Vous devez être connecté pour aimer les posts",
			ariaLike: "Aimer l'article",
			ariaUnlike: "Ne plus aimer l'article",
		},
	},

	admin: {
		layout: {
			panel: "Panneau",
			exit: "Sortir",
			backToSiteTitle: "Retour au Site",
			backToSiteDesc: "Retourner au site web principal",
			more: "Plus",
			menu: "Menu Admin",
			nav: {
				dashboard: {
					label: "Tableau de bord",
					description: "Aperçu et statistiques",
				},
				users: {
					label: "Gestion des Utilisateurs",
					description:
						"Gérer les utilisateurs, bannir/débannir, modifier les profils",
				},
				access: {
					label: "Gestion des Accès",
					description: "Rôles et permissions",
				},
				blog: {
					label: "Gestion du Blog",
					description: "Articles, catégories et tags",
				},
				files: {
					label: "Gestion des Fichiers",
					description: "Téléverser et organiser les médias",
				},
			},
		},
		store: {
			title: "Gestion de la Boutique",
			itemsTab: "Articles",
			ordersTab: "Commandes",
			createItem: "Créer un Article",
			addItem: "Ajouter l'Article",
			itemsList: "Liste des Articles",
			ordersList: "Commandes",
			name: "Nom",
			price: "Prix",
			published: "Publié",
			featured: "En Vedette",
			actions: "Actions",
			markPaid: "Marquer Payée",
			confirm: "Confirmer",
			accept: "Accepter",
			edit: "Modifier",
			delete: "Supprimer",
			creating: "Création...",
			loadingItems: "Chargement des articles...",
			loadingOrders: "Chargement des commandes...",
			noItems: "Aucun article trouvé",
			noOrders: "Aucune commande trouvée",
			form: {
				namePh: "Nom",
				descriptionPh: "Description",
				pricePh: "Prix (ex. 9.99)",
				submit: "Ajouter l'Article",
				submitting: "Enregistrement...",
			},
			order: {
				paid: "Payée",
				confirmed: "Confirmée",
				accepted: "Acceptée",
				user: "Utilisateur",
				created: "Créée",
			},
		},
		dashboard: {
			title: "Tableau de Bord Admin",
			subtitle:
				"Bienvenue dans le panneau d'administration. Surveillez et gérez votre plateforme.",
			stats: {
				totalUsers: {
					title: "Total Utilisateurs",
					hint: "Utilisateurs inscrits",
				},
				blogPosts: { title: "Articles de Blog", hint: "Articles publiés" },
				activeRoles: { title: "Rôles Actifs", hint: "Rôles système" },
				storage: { title: "Stockage de Fichiers", hint: "Système de stockage" },
			},
			popular: {
				title: "Articles de Blog Populaires",
				empty: "Aucun article populaire pour le moment",
				viewAll: "Voir Tous les Articles",
			},
			featured: {
				title: "Articles en Vedette",
				empty: "Aucun article en vedette pour le moment",
			},
			recentUsers: {
				title: "Utilisateurs Récents",
				empty: "Aucun utilisateur trouvé",
			},
			published: "Publié",
			featuredBadge: "En Vedette",
		},
		users: {
			title: "Gestion des Utilisateurs",
			subtitle: "Gérer les comptes utilisateur, permissions et accès.",
			stats: {
				total: "Total Utilisateurs",
				verified: "Utilisateurs Vérifiés",
				banned: "Utilisateurs Bannis",
				admins: "Utilisateurs Admin",
			},
			searchPlaceholder:
				"Rechercher utilisateurs par nom, email ou nom d'utilisateur...",
			joined: "Rejoint {{date}}",
			verified: "Vérifié",
			banned: "Banni",
			actions: {
				unban: "Débannir l'Utilisateur",
				ban: "Bannir l'Utilisateur",
				delete: "Supprimer l'Utilisateur",
			},
			pagination: {
				showing: "Affichage de {{from}} à {{to}} sur {{total}} éléments",
			},
			noResults: "Aucun utilisateur trouvé correspondant à votre recherche.",
			loadingError: "Erreur lors du chargement des utilisateurs : {{message}}",
			dialogs: {
				ban: {
					title: "Bannir l'Utilisateur",
					user: "Utilisateur :",
					email: "Email :",
					reason: "Raison du bannissement",
					placeholder: "Entrez la raison du bannissement de cet utilisateur...",
					cancel: "Annuler",
					confirm: "Bannir l'Utilisateur",
					requireReason:
						"Veuillez fournir une raison pour bannir cet utilisateur.",
				},
				delete: {
					title: "! Supprimer le Compte Utilisateur",
					danger: "DANGER : Cette action ne peut pas être annulée !",
					user: "Utilisateur :",
					email: "Email :",
					joined: "Rejoint :",
					note: "Toutes les données et contenus de l'utilisateur seront définitivement supprimés du système.",
					typeDelete: "Tapez",
					toConfirm: "pour confirmer :",
					placeholder: "Tapez SUPPRIMER pour confirmer",
					cancel: "Annuler",
					confirm: "Supprimer l'Utilisateur Définitivement",
				},
			},
			toasts: {
				banned: "Utilisateur banni avec succès",
				unbanned: "Utilisateur débanni avec succès",
				deleted: "Utilisateur supprimé avec succès",
				banFailed: "Échec du bannissement de l'utilisateur : {{message}}",
				unbanFailed: "Échec du débannissement de l'utilisateur : {{message}}",
				deleteFailed: "Échec de la suppression de l'utilisateur : {{message}}",
			},
		},
		files: {
			title: "Gestion des Fichiers",
			subtitle:
				"Téléverser, organiser et gérer les fichiers multimédias et documents.",
			upload: "Téléverser des Fichiers",
			stats: {
				totalFiles: "Total Fichiers",
				totalSize: "Taille Totale",
				images: "Images",
				protected: "Fichiers Protégés",
			},
			searchPlaceholder: "Rechercher fichiers par nom ou type...",
			emptyAll:
				"Aucun fichier téléversé pour le moment. Téléversez-en pour commencer.",
			emptyFiltered: "Aucun fichier trouvé correspondant à votre recherche.",
			dialogs: {
				upload: {
					title: "Téléverser des Fichiers",
					dragDrop:
						"Glissez et déposez les fichiers ici, ou cliquez pour parcourir",
					browse: "Parcourir les Fichiers",
					selected: "Fichiers Sélectionnés",
					makeProtected:
						"Rendre les fichiers protégés (accès admin uniquement)",
					cancel: "Annuler",
					upload: "Téléverser",
					uploadWithCount: "Téléverser ({{count}})",
				},
				view: {
					title: "Détails du Fichier",
					size: "Taille du Fichier",
					type: "Type de Fichier",
					uploadedBy: "Téléversé par",
					uploadDate: "Date de Téléversement",
					protection: "Protection",
					fileId: "ID du Fichier",
					preview: "Aperçu",
					download: "Télécharger",
					close: "Fermer",
					public: "Public",
					protected: "Protégé",
					unknown: "Inconnu",
				},
			},
			toasts: {
				uploadSuccess: "Fichiers téléversés avec succès",
				uploadFailed: "Échec du téléversement des fichiers : {{message}}",
				deleteSuccess: "Fichier supprimé avec succès",
				deleteFailed: "Échec de la suppression du fichier : {{message}}",
			},
		},
		access: {
			title: "Gestion des Accès",
			subtitle: "Gérer les rôles et permissions pour votre plateforme.",
			tabs: {
				users: "Rôles Utilisateur",
				roles: "Rôles ({{count}})",
				permissions: "Permissions ({{count}})",
			},
			usersAssignments: "Assignations de Rôles Utilisateur",
			createRole: "Créer un Rôle",
			createPermission: "Créer une Permission",
			assignRole: "Assigner un Rôle",
			permissionsBtn: "Permissions",
			priority: "Priorité",
			permissionsCount: "{{count}} permissions",
			noRoles: "Aucun rôle trouvé. Créez votre premier rôle pour commencer.",
			noPerms:
				"Aucune permission trouvée. Créez votre première permission pour commencer.",
			dialogs: {
				createRole: {
					title: "Créer un Nouveau Rôle",
					name: "Nom du Rôle",
					description: "Description",
					priority: "Priorité",
					placeholderName: "ex. Éditeur de Contenu",
					placeholderDescription: "Brève description du rôle",
					cancel: "Annuler",
					create: "Créer le Rôle",
					fillAll: "Veuillez remplir tous les champs requis",
					toastSuccess: "Rôle créé avec succès",
					toastFailed: "Échec de la création du rôle : {{message}}",
				},
				createPermission: {
					title: "Créer une Nouvelle Permission",
					name: "Nom de la Permission",
					description: "Description",
					action: "Action",
					resource: "Ressource",
					resourceId: "ID de Ressource (Optionnel)",
					placeholderName: "ex. Modifier les Articles",
					placeholderDescription: "Ce que cette permission permet",
					placeholderAction: "ex. lire, écrire, supprimer",
					placeholderResource: "ex. blog, utilisateurs, fichiers",
					placeholderResourceId: "ID de ressource spécifique",
					cancel: "Annuler",
					create: "Créer la Permission",
					fillAll: "Veuillez remplir tous les champs requis",
					toastSuccess: "Permission créée avec succès",
					toastFailed: "Échec de la création de la permission : {{message}}",
				},
				assignRole: {
					title: "Assigner un Rôle à {{name}}",
					selectRole: "Sélectionner un Rôle",
					chooseRole: "Choisir un rôle à assigner",
					cancel: "Annuler",
					assign: "Assigner le Rôle",
					toastSuccess: "Rôle assigné avec succès",
					toastFailed: "Échec de l'assignation du rôle : {{message}}",
					pleaseSelect: "Veuillez sélectionner un rôle",
				},
				managePerms: {
					title: "Gérer les Permissions — {{role}}",
					addPermission: "Ajouter une Permission",
					choosePermission: "Choisir une permission",
					assign: "Assigner",
					currentPermissions: "Permissions Actuelles",
					noAvailable: "Aucune permission disponible",
					toastAssign: "Permission assignée",
					toastAssignFailed:
						"Échec de l'assignation de la permission : {{message}}",
					toastRevoke: "Permission révoquée",
					toastRevokeFailed:
						"Échec de la révocation de la permission : {{message}}",
					revokeConfirm:
						'Révoquer la permission "{{permission}}" du rôle "{{role}}" ?',
				},
				deleteRole: {
					confirm:
						'Êtes-vous sûr de vouloir supprimer le rôle "{{role}}" ? Cette action ne peut pas être annulée.',
					toastSuccess: "Rôle supprimé avec succès",
					toastFailed: "Échec de la suppression du rôle : {{message}}",
				},
				deletePermission: {
					confirm:
						'Êtes-vous sûr de vouloir supprimer la permission "{{permission}}" ? Cette action ne peut pas être annulée.',
					toastSuccess: "Permission supprimée avec succès",
					toastFailed: "Échec de la suppression de la permission : {{message}}",
				},
			},
		},
		blogManagement: {
			title: "Gestion du Blog",
			subtitle: "Gérer les articles de blog, catégories et tags.",
			tabs: {
				posts: "Articles",
				categories: "Catégories",
				tags: "Tags",
			},
			posts: {
				title: "Articles",
				subtitle: "Gérer vos articles de blog et contenu.",
				create: "Créer un Article",
				stats: {
					total: "Total Articles",
					published: "Publiés",
					drafts: "Brouillons",
					featured: "En Vedette",
				},
				searchPlaceholder: "Rechercher articles par titre ou description...",
				empty: "Aucun article trouvé. Créez-en un pour commencer.",
				toasts: {
					deleteSuccess: "Article supprimé avec succès",
					deleteFailed: "Échec de la suppression de l'article : {{message}}",
				},
				card: {
					published: "Publié",
					draft: "Brouillon",
					featured: "En Vedette",
					archived: "Archivé",
					updated: "Mis à jour {{date}}",
					viewAria: "Voir",
					editAria: "Modifier",
					deleteAria: "Supprimer",
				},
			},
			categories: {
				title: "Catégories",
				subtitle: "Organiser vos articles avec des catégories.",
				create: "Créer une Catégorie",
				empty: "Aucune catégorie trouvée. Créez-en une pour commencer.",
				toasts: {
					createSuccess: "Catégorie créée avec succès",
					createFailed: "Échec de la création de la catégorie : {{message}}",
					deleteSuccess: "Catégorie supprimée avec succès",
					deleteFailed: "Échec de la suppression de la catégorie : {{message}}",
				},
				form: {
					title: "Créer une Nouvelle Catégorie",
					name: "Nom de la Catégorie",
					placeholder: "ex. Développement Web",
					cancel: "Annuler",
					create: "Créer la Catégorie",
					fillAll: "Veuillez entrer un nom de catégorie",
				},
			},
			tags: {
				title: "Tags",
				subtitle: "Gérer les tags et étiquettes des articles.",
				empty: "Aucun tag trouvé.",
				created: "Créé : {{date}}",
				toasts: {
					deleteSuccess: "Tag supprimé avec succès",
					deleteFailed: "Échec de la suppression du tag : {{message}}",
				},
			},
		},
	},
};

export default fr;
