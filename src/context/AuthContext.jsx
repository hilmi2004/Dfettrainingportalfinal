import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const authFetch = async (path, init = {}) => {
        try {
            const response = await fetch(`http://localhost:2000/api/auth${path}`, {
                ...init,
                credentials: 'include',
                headers: {
                    ...init.headers,
                    'Content-Type': 'application/json'
                }
            });

            // Handle token refresh
            if (response.status === 401 && !init._retry) {
                const refreshResponse = await fetch('http://localhost:2000/api/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (refreshResponse.ok) {
                    return authFetch(path, { ...init, _retry: true });
                }

                // Clear cookies and logout if refresh fails
                logout();
                return response;
            }

            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    const checkAuth = async () => {
        try {
            const response = await authFetch('/me');

            if (response.status === 401) {
                logout();
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setUser(data.user || data); // Handle both response structures
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authFetch('/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            await checkAuth();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authFetch('/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            // Force full page reload to clear any residual state
            window.location.reload();
        }
    };

    useEffect(() => {
        let isMounted = true;

        const validateSession = async () => {
            try {
                await checkAuth();
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        validateSession();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            authFetch
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);