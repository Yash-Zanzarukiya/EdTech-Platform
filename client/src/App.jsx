import { Route, Routes } from 'react-router-dom';
import './App.css';
import {
    About,
    Certificate,
    AdminDashboard,
    Home,
    SignIn,
    SignUp,
    UserDashboard,
} from './pages';
import { Toaster } from './components/ui/toaster';
import { FirstLoading, RootContainer } from './components';
import { useDispatch } from 'react-redux';
import { getUser } from './app/slices/authSlice';
import { healthCheck } from './app/slices/healthSlice';
import { useEffect, useState } from 'react';

function App() {
    const dispatch = useDispatch();

    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        dispatch(healthCheck()).then(() => {
            dispatch(getUser()).then(() => {
                setInitialLoading(false);
            });
        });
    }, [dispatch]);

    return initialLoading ? (
        <FirstLoading />
    ) : (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={<RootContainer />}>
                    <Route path="" element={<Home />} />
                    <Route path="sign-in" element={<SignIn />} />
                    <Route path="sign-up" element={<SignUp />} />
                    <Route path="about" element={<About />} />
                    <Route path="certificate" element={<Certificate />} />
                    <Route path="user-dashboard" element={<UserDashboard />} />
                    <Route
                        path="admin-dashboard"
                        element={<AdminDashboard />}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
