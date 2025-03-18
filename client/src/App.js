import React, { useEffect } from 'react';
import Client from './Client';
import Admin from './components/Admin/Admin';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestAxios from './TestAxios';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  useEffect(() => {
    // Prevent F12 key
    const handleKeyDown = (e) => {
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Detect console opening
    const detectConsole = () => {
      const handler = {
        get: function(target, property) {
          if (property === 'clear') {
            console.warn('Console access detected');
          }
          return target[property];
        }
      };
      console = new Proxy(console, handler);
    };

    // Add more advanced console detection
    const detectDevTools = () => {
      function check() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
          document.body.innerHTML = 'Developer tools are not allowed on this site.';
        }
      }
      setInterval(check, 1000);
    };

    // Apply all protections
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    detectConsole();
    detectDevTools();

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<TestAxios />} />
          <Route path="/*" element={<Client />} />
          
          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

// import React from 'react';
// import Client from './Client';
// import Admin from './components/Admin/Admin';
// import Login from './components/Auth/Login';
// import ProtectedRoute from './components/Auth/ProtectedRoute';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import TestAxios from './TestAxios';
// import { AuthProvider } from './context/AuthContext';

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/test" element={<TestAxios />} />
//           <Route path="/*" element={<Client />} />
          
//           {/* Protected admin routes */}
//           <Route element={<ProtectedRoute />}>
//             <Route path="/admin/*" element={<Admin />} />
//           </Route>
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;