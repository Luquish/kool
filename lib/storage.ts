// Comprobar si estamos en el cliente (navegador)
const isClient = typeof window !== 'undefined';

// Función genérica para guardar datos en localStorage
const saveItem = async (storagePath: string, data: any) => {
  try {
    // Guardar en localStorage (sólo en el cliente)
    if (isClient) {
      localStorage.setItem(storagePath, JSON.stringify(data));
    }
    
    // Guardar en el servidor a través de la API
    const response = await fetch('/api/storage', {
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
    // Si estamos en el cliente, al menos intentamos guardar en localStorage
    if (isClient) {
      try {
        localStorage.setItem(storagePath, JSON.stringify(data));
        return true;
      } catch (e) {
        console.error('Error guardando en localStorage:', e);
      }
    }
    return false;
  }
};

// Función genérica para obtener datos
const getItem = async (storagePath: string) => {
  try {
    // Intentar obtener desde el servidor primero
    try {
      const response = await fetch(`/api/storage?path=${encodeURIComponent(storagePath)}`);
      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
    } catch (error) {
      console.warn('Error obteniendo datos del servidor:', error);
      // Continuar e intentar obtener desde localStorage
    }
    
    // Si estamos en el cliente, intentar obtener desde localStorage
    if (isClient) {
      const data = localStorage.getItem(storagePath);
      if (data) {
        return JSON.parse(data);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    return null;
  }
};

// Función específica para guardar el perfil de usuario
const saveUserProfile = async (email: string, profileData: any) => {
  // Usar la estructura solicitada: storage/${email}/profile.json
  const userProfilePath = `storage/${email}/profile.json`;
  
  // Guardar perfil de usuario
  return await saveItem(userProfilePath, profileData);
};

// Función específica para obtener el perfil de usuario
const getUserProfile = async (email: string) => {
  const userProfilePath = `storage/${email}/profile.json`;
  return await getItem(userProfilePath);
};

// Función específica para guardar datos de onboarding
const saveOnboardingData = async (email: string, onboardingData: any) => {
  // Obtener el perfil actual
  const currentProfile = await getUserProfile(email);
  
  if (!currentProfile) {
    throw new Error('Perfil de usuario no encontrado');
  }
  
  // Actualizar el perfil con los datos de onboarding
  const updatedProfile = {
    ...currentProfile,
    ...onboardingData
  };
  
  // Guardar el perfil actualizado
  return await saveUserProfile(email, updatedProfile);
};

// Función para marcar un usuario como autenticado
const setCurrentUser = async (email: string) => {
  return await saveItem('storage/session.json', { currentUser: email });
};

// Función para obtener el usuario actual
const getCurrentUser = async () => {
  const session = await getItem('storage/session.json');
  return session?.currentUser || null;
};

// Función para cerrar sesión
const logout = async () => {
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