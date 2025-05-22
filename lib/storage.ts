// Comprobar si estamos en el cliente (navegador)
const isClient = typeof window !== 'undefined';

// Obtener la URL base para las peticiones
const getBaseUrl = () => {
  if (isClient) {
    return '';
  }
  // En el servidor, usar la URL completa
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.VERCEL_URL || 'localhost:3000';
  return `${protocol}://${host}`;
};

// Función genérica para guardar datos en localStorage y servidor
const saveItem = async (storagePath: string, data: any) => {
  try {
    // Guardar en localStorage (sólo en el cliente)
    if (isClient) {
      localStorage.setItem(storagePath, JSON.stringify(data));
    }
    
    // Guardar en el servidor a través de la API
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/storage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: storagePath,
        data: data
      }),
    });
    
    if (!response.ok) {
      throw new Error('Error al guardar en el servidor');
    }
    
    return true;
  } catch (error) {
    console.error('Error guardando datos:', error);
    return false;
  }
};

// Función genérica para obtener datos
const getItem = async (storagePath: string) => {
  try {
    if (isClient) {
      // En el cliente, intentar obtener desde localStorage primero
      const localData = localStorage.getItem(storagePath);
      if (localData) {
        return JSON.parse(localData);
      }
    }

    // Si no hay datos locales o estamos en el servidor, obtener del servidor
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/storage?path=${encodeURIComponent(storagePath)}`);
    
    if (response.ok) {
      const result = await response.json();
      
      // Si estamos en el cliente, guardar en localStorage para futuras consultas
      if (isClient && result.data) {
        localStorage.setItem(storagePath, JSON.stringify(result.data));
      }
      
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    return null;
  }
};

// Función específica para guardar el perfil de usuario
const saveUserProfile = async (email: string, profileData: any) => {
  const userProfilePath = `storage/${email}/profile.json`;
  return await saveItem(userProfilePath, profileData);
};

// Función específica para obtener el perfil de usuario
const getUserProfile = async (email: string) => {
  const userProfilePath = `storage/${email}/profile.json`;
  return await getItem(userProfilePath);
};

// Función específica para guardar datos de onboarding
const saveOnboardingData = async (email: string, onboardingData: any) => {
  const currentProfile = await getUserProfile(email);
  
  if (!currentProfile) {
    throw new Error('Perfil de usuario no encontrado');
  }
  
  const updatedProfile = {
    ...currentProfile,
    ...onboardingData
  };
  
  return await saveUserProfile(email, updatedProfile);
};

// Función para marcar un usuario como autenticado
const setCurrentUser = async (email: string) => {
  if (isClient) {
    localStorage.setItem('currentUser', email);
  }
  return await saveItem('storage/session.json', { currentUser: email });
};

// Función para obtener el usuario actual
const getCurrentUser = async () => {
  try {
    if (isClient) {
      // En el cliente, intentar obtener desde localStorage primero
      const localUser = localStorage.getItem('currentUser');
      if (localUser) {
        return localUser;
      }
    }
    
    // Intentar obtener desde el servidor
    const session = await getItem('storage/session.json');
    const currentUser = session?.currentUser || null;
    
    // Si estamos en el cliente y obtuvimos el usuario del servidor, 
    // actualizar localStorage
    if (isClient && currentUser) {
      localStorage.setItem('currentUser', currentUser);
    }
    
    return currentUser;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};

// Función para cerrar sesión
const logout = async () => {
  if (isClient) {
    localStorage.removeItem('currentUser');
  }
  return await saveItem('storage/session.json', { currentUser: null });
};

// Comprueba si existe un usuario
const checkUserExists = async (email: string) => {
  return (await getUserProfile(email)) !== null;
};

const storage = {
  saveItem,
  getItem,
  saveUserProfile,
  getUserProfile,
  saveOnboardingData,
  setCurrentUser,
  getCurrentUser,
  logout,
  checkUserExists
};

export default storage;