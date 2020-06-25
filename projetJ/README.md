Prérequis :
	Télécharger ce dossier Git  
	Avoir WampServer ou application similaire pour host notre application

Installation Keycloak :  

	1) Télécharger le serveur standalone de Keycloak : https://www.keycloak.org/downloads.html

	2) Extraire le dossier et lancer .../keycloak-10.0.2/bin/standalone.bat 

	3) Une fois le standalone lancé aller à http://localhost:8080/auth
	Entrez un nom d'utilisateur et un mot de passe pour créer le compte admin

	4) Cliquer sur la console d'administration sur la page ou aller directement ici : http://localhost:8080/auth/admin/
Pour plus d'infos aller sur : https://www.keycloak.org/docs/latest/getting_started/


Configuration Keycloak :  

	1) Une fois arrivé sur la console d'administrateur passez la souris sur "Master" (en haut à droite de la page)
	Puis "add realm"

	Cliquer sur "Select file" puis trouver ../projetJ/realm-export-projetJ.json dans le dossier du projet.
	Cliquer sur "Create"

	Une fois le realm "projetJ" importé, répétez l'opération pour le realm "identity-provider" 

	Cliquer sur "Select file" puis trouver ../projetJ/realm-export-identity-provider.json dans le dossier du projet.

	2) Configuration des clients

	Aller dans Clients du realm "identity-provider" puis trouver "keycloakAsIdentityProvider"   
	Cliquer sur "Edit" ou directement sur le nom du client
	Cliquer sur "Credentials"  
	Cliquer sur "Regenerate Secret"  
	Copier ce secret  

	Aller dans le realm "ProjetJ"  
	Cliquer sur "Identity Providers"  
	Trouver "keycloak-oidc" puis cliquer sur "Edit" ou directement sur le nom
	Descendre jusqu'à trouver "Client Secret"  
	Coller le secret ici  
	Descendre jusqu'au bouton "Save" et sauvegardez la configuration  


	3) Quand les 2 realms sont importés allez dans chacun des 2 et créer des utilisateurs :

	Cliquer sur "Users" (en bas à gauche de la page) puis "Add user", renseigner au moins le nom d'utilisateur.

	Quand l'utilisateur est créé retourner à "Users" puis cliquer sur "View all users"

	Trouver l'utilisateur que vous venez de créer et cliquer sur "Edit"

	Aller dans "Credentials"

	Renseigner 2 fois le même mot de passe pour l'utilisateur et décocher "Temporary"

	Répéter pour l'autre realm avec un nom d'utilisateur différent



Application Web :  

	1) Une fois la configuration Keycloak terminée, lancer WampServer ou une application similaire pour héberger 
	localement notre application web.

	Déplacer tout le dossier projetJ dans le répertoire requis (C:/wamp64/www pour Wamp)

	Une fois cela fait aller à http://localhost/projetJ/ puis cliquer sur "Connexion"

	-Pour se connecter avec le fournisseur d'identité de Keycloak : 
		Cliquer sur "keycloak-oidc" et connectez-vous avec l'utilisateur créé dans le realm "identity-provider".

		Normalement vous devez consentir pour que "keycloakAsIdentityProvider" ai accès à vos données.
		Vous allez ensuite devoir rentrer des informations supplémentaires pour la création de votre compte sur 
		l'autre realm.

		Une fois connecté il est possible que les QR Codes ne soit pas bien chargés, appuyez sur "Connexion" et 
		cela devrait régler le problème.

	-Pour se connecter simplement à l'application web :
		Cliquer sur "Connexion" comme précédemment puis connectez-vous directement avec l'utilisateur que vous 
		avez créer dans le realm "ProjetJ" 

		Une fois connecté il est possible que les QR Codes ne soit pas bien chargés, appuyez sur "Connexion" et 
		cela devrait régler le problème.

	Si vous voulez tester un autre utilisateur il faudra vous déconnecter, mais malgré la présence d'un bouton 
	"Déconnexion" la session de l'utilisateur est toujours en cours.

	Pour supprimer les sessions en cours aller sur la page d'administration Keycloak http://localhost:8080/auth/
	Puis sélectionnez le realm "ProjetJ", ensuite aller dans "Sessions" et cliquer sur "Logout all"
	Répéter l'opération pour le realm "identity-provider"


