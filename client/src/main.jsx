import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AppRouter from './AppRouter.jsx';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from './components/ui/tooltip.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <AppRouter>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <TooltipProvider>
                    <App />
                </TooltipProvider>
            </ThemeProvider>
        </AppRouter>
    </Provider>
);
