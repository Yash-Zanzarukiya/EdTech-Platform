import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AppRouter from './AppRouter.jsx';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import { ThemeProvider } from "@/components/theme-provider"

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <AppRouter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <App />
            </ThemeProvider>
        </AppRouter>
    </Provider>
);
