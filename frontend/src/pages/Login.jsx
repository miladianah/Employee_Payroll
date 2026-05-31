import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  // State to toggle between Login and Register forms
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Handle Login
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard'); // Go to dashboard on success
      } else {
        setError('Invalid username or password');
      }
    } else {
      // Handle Register
      const result = await register(username, password);
      if (result === true) {
        // Registration successful
        alert('Registration successful! Please login.');
        setIsLogin(true); // Switch back to login screen
        setUsername('');
        setPassword('');
      } else {
        setError(result); // Show error from backend
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 font-bold text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              placeholder="Enter username" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              placeholder="Enter password" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-300">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-blue-600 hover:underline text-sm"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;