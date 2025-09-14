import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await onLogin(credentials);
      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-start py-12 px-5">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            BlueWolf Security
          </h2>
          <p className="text-gray-600">Proposal Management System</p>
        </div>
      </div>

      <div className="mt-8 mx-auto w-[90%] max-w-md">
        <div className="bg-white py-8 px-5 shadow rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  disabled={isLoading}
                  value={credentials.username}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm ${
                    isLoading
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                  }`}
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  value={credentials.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm ${
                    isLoading
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                  }`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
                    isLoading ? 'cursor-not-allowed' : 'hover:text-gray-600'
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className={`h-5 w-5 ${isLoading ? 'text-gray-300' : 'text-gray-400'}`} />
                  ) : (
                    <Eye className={`h-5 w-5 ${isLoading ? 'text-gray-300' : 'text-gray-400'}`} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
