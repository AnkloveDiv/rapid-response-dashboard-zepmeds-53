
import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// Redirect the index page to the dashboard
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
