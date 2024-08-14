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
    Explore,
    TestingPage,
    AllCourses,
    AddCourse,
    CoursePage,
    Analytics,
} from './pages';
import { Toaster } from './components/ui/toaster';
import {
    CourseContent,
    CoursePreview,
    CourseTopics,
    EditCourse,
    FirstLoading,
    InstructorContainer,
    RootContainer,
} from './components';
import { useToast } from '@/components/ui/use-toast';
import { useInitialLoading } from './hooks';

let toastMessage;

function App() {
    const { toast } = useToast();
    toastMessage = toast;

    const { initialLoading } = useInitialLoading();

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
                    <Route path="explore" element={<Explore />} />
                    <Route path="certificate" element={<Certificate />} />
                    <Route path="user-dashboard" element={<UserDashboard />} />
                    <Route path="testing" element={<TestingPage />} />
                    <Route path="courses" element={<TestingPage />} />
                    <Route
                        path="admin-dashboard"
                        element={<AdminDashboard />}
                    />
                </Route>
                <Route path="/instructor" element={<InstructorContainer />}>
                    <Route path="dashboard" element={<TestingPage />} />
                    <Route path="courses" element={<AllCourses />}></Route>
                    <Route path="courses/:courseId" element={<CoursePage />}>
                        <Route path="" element={<EditCourse />} />
                        <Route path="topics" element={<CourseTopics />} />
                        <Route path="content" element={<CourseContent />} />
                        <Route path="preview" element={<CoursePreview />} />
                    </Route>
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="add-course" element={<AddCourse />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
export { toastMessage };
