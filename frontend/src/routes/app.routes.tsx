import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTheme } from '@/context/theme-context.tsx';
import { ToastContainer } from 'react-toastify';
import SignUp from '@/pages/public/create.tsx';
import Count from '@/pages/public/count';

export const AppRoute = () => {
  const { theme } = useTheme();

  return (
    <>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route path={'/:id/'} element={<SignUp />} />
          <Route path={'/:id/results'} element={<Count />} />
        </Routes>
      </Router>
    </>
  );
};
