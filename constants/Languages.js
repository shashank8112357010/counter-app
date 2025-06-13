export const LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    translations: {
      // Authentication
      welcome: "Welcome to LoveConnect",
      signUp: "Sign Up",
      login: "Login",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      age: "Age",
      bio: "Bio",
      register: "Register",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",

      // Main App
      discover: "Discover",
      chats: "Chats",
      profile: "Profile",
      settings: "Settings",
      matches: "Matches",

      // Profile
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      aboutMe: "About Me",
      interests: "Interests",
      photos: "Photos",
      addPhoto: "Add Photo",

      // Chat
      typeMessage: "Type a message...",
      sendImage: "Send Image",
      sendAudio: "Send Audio",
      sendVideo: "Send Video",
      online: "Online",
      lastSeen: "Last seen",

      // Settings
      language: "Language",
      notifications: "Notifications",
      ageRange: "Age Range",
      distance: "Distance",
      logout: "Logout",

      // Swipe
      like: "Like",
      pass: "Pass",
      superLike: "Super Like",
      itsAMatch: "It's a Match!",
      matchMessage: "You and {name} liked each other!",
      keepSwiping: "Keep Swiping",
      sendMessage: "Send Message",

      // Common
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      done: "Done",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
  },
  es: {
    code: "es",
    name: "Español",
    translations: {
      // Authentication
      welcome: "Bienvenido a LoveConnect",
      signUp: "Registrarse",
      login: "Iniciar Sesión",
      email: "Correo Electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      firstName: "Nombre",
      lastName: "Apellido",
      age: "Edad",
      bio: "Biografía",
      register: "Registrar",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      dontHaveAccount: "¿No tienes una cuenta?",

      // Main App
      discover: "Descubrir",
      chats: "Chats",
      profile: "Perfil",
      settings: "Configuración",
      matches: "Matches",

      // Profile
      editProfile: "Editar Perfil",
      saveChanges: "Guardar Cambios",
      aboutMe: "Sobre Mí",
      interests: "Intereses",
      photos: "Fotos",
      addPhoto: "Agregar Foto",

      // Chat
      typeMessage: "Escribe un mensaje...",
      sendImage: "Enviar Imagen",
      sendAudio: "Enviar Audio",
      sendVideo: "Enviar Video",
      online: "En línea",
      lastSeen: "Visto por última vez",

      // Settings
      language: "Idioma",
      notifications: "Notificaciones",
      ageRange: "Rango de Edad",
      distance: "Distancia",
      logout: "Cerrar Sesión",

      // Swipe
      like: "Me Gusta",
      pass: "Pasar",
      superLike: "Super Like",
      itsAMatch: "¡Es un Match!",
      matchMessage: "¡A ti y a {name} se gustaron!",
      keepSwiping: "Seguir Deslizando",
      sendMessage: "Enviar Mensaje",

      // Common
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      done: "Hecho",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
    },
  },
  fr: {
    code: "fr",
    name: "Français",
    translations: {
      // Authentication
      welcome: "Bienvenue sur LoveConnect",
      signUp: "S'inscrire",
      login: "Se connecter",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      firstName: "Prénom",
      lastName: "Nom",
      age: "Âge",
      bio: "Bio",
      register: "S'inscrire",
      alreadyHaveAccount: "Vous avez déjà un compte?",
      dontHaveAccount: "Vous n'avez pas de compte?",

      // Main App
      discover: "Découvrir",
      chats: "Chats",
      profile: "Profil",
      settings: "Paramètres",
      matches: "Matchs",

      // Profile
      editProfile: "Modifier le profil",
      saveChanges: "Sauvegarder",
      aboutMe: "À propos de moi",
      interests: "Intérêts",
      photos: "Photos",
      addPhoto: "Ajouter une photo",

      // Chat
      typeMessage: "Tapez un message...",
      sendImage: "Envoyer une image",
      sendAudio: "Envoyer un audio",
      sendVideo: "Envoyer une vidéo",
      online: "En ligne",
      lastSeen: "Vu pour la dernière fois",

      // Settings
      language: "Langue",
      notifications: "Notifications",
      ageRange: "Tranche d'âge",
      distance: "Distance",
      logout: "Se déconnecter",

      // Swipe
      like: "J'aime",
      pass: "Passer",
      superLike: "Super Like",
      itsAMatch: "C'est un Match!",
      matchMessage: "Vous et {name} vous êtes aimés!",
      keepSwiping: "Continuer à glisser",
      sendMessage: "Envoyer un message",

      // Common
      save: "Sauvegarder",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      done: "Terminé",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
    },
  },
};

export const getTranslation = (key, language = "en", params = {}) => {
  let translation =
    LANGUAGES[language]?.translations[key] ||
    LANGUAGES.en.translations[key] ||
    key;

  // Replace parameters in translation
  Object.keys(params).forEach((param) => {
    translation = translation.replace(`{${param}}`, params[param]);
  });

  return translation;
};
