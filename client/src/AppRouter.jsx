import { BrowserRouter } from 'react-router-dom';

const AppRouter = ({ children }) => {
    return <BrowserRouter>{children}</BrowserRouter>;
};

export default AppRouter;
