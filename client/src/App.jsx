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
    CoursePublish,
    CourseExam,
    CourseLearning,
    CourseExplore,
    PublicVideos,
    WelcomePage,
} from './pages';
import { Toaster } from './components/ui/toaster';
import {
    CourseCurriculum,
    CourseForm,
    CourseMainSection,
    CoursePreview,
    CourseTopics,
    EditCourse,
    FirstLoading,
    InstructorContainer,
    RootContainer,
} from './components';
import { useToast } from '@/components/ui/use-toast';
import { useInitialLoading } from './hooks';
import HeroFormSignUpForm from './pages/Auth/HeroFormSignUpForm';

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
                    {/* <Route path="sign-up" element={<HeroFormSignUpForm />} /> */}
                    <Route path="about" element={<About />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="certificate" element={<Certificate />} />
                    <Route path="user-dashboard" element={<UserDashboard />} />
                    <Route path="courses" element={<CourseExplore />} />
                    <Route path="welcome" element={<WelcomePage />} />
                    <Route path="testing" element={<TestingPage />} />
                    <Route
                        path="admin-dashboard"
                        element={<AdminDashboard />}
                    />
                </Route>
                <Route path="/instructor" element={<InstructorContainer />}>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="courses" element={<AllCourses />} />
                    <Route path="courses/:courseId" element={<CoursePage />}>
                        <Route path="" element={<EditCourse />} />
                        <Route path="topics" element={<CourseTopics />} />
                        <Route
                            path="curriculum"
                            element={<CourseCurriculum />}
                        />
                        <Route path="exam" element={<CourseExam />} />
                        <Route path="publish" element={<CoursePublish />} />
                        <Route path="preview" element={<CoursePreview />} />
                    </Route>
                    <Route path="videos" element={<PublicVideos />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="add-course" element={<AddCourse />} />
                    <Route path="add-course/new" element={<CourseForm />} />
                </Route>
                <Route path="/courses/:courseId" element={<CourseLearning />}>
                    <Route path=":videoId" element={<CourseMainSection />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
export { toastMessage };
