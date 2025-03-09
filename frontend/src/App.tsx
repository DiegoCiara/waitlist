import '@/App.css';
import Loading from '@/components/loading/loading';
import { CustomerProvider } from '@/context/customer-context';
import { LoadingProvider } from '@/context/loading-context';
import { ThemeProvider } from '@/context/theme-context';
import { AppRoute } from '@/routes/app.routes';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LoadingProvider>
        <CustomerProvider>
          <Loading />
          <AppRoute />
        </CustomerProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
