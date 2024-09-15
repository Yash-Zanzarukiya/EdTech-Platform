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
    UserGoals,
    PublicVideoWatch,
} from './pages';
import { Toaster } from './components/ui/toaster';
import {
    Container,
    CourseCurriculum,
    CourseForm,
    CourseMainSection,
    CoursePreview,
    CourseTopics,
    EditCourse,
    FirstLoading,
    InstructorContainer,
    RootContainer,
    SetGoal,
} from './components';
import { useToast } from '@/components/ui/use-toast';
import { useInitialLoading } from './hooks';
import HeroFormSignUpForm from './pages/Auth/HeroFormSignUpForm';
import GoalForm from './components/User/GoalForm';
import CourseCart from './components/CoursePurchase/Course_cart';
import OrderSuccessful from './components/CoursePurchase/OrderSuccessful';
import PublicVideoForm from './pages/PublicVideoForm';

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
                    <Route path="goals" element={<UserGoals />} />
                    <Route path="goals/:goalId" element={<GoalForm />} />
                    <Route path="user-dashboard" element={<UserDashboard />} />
                    <Route path="courses" element={<CourseExplore />} />
                    <Route
                        path="videos/:videoId"
                        element={<PublicVideoWatch />}
                    />
                    <Route path="welcome" element={<WelcomePage />} />
                    <Route path="testing" element={<TestingPage />} />
                    <Route path="quiz" element={<Quiz />} />
                    <Route path = "cart" element={<CourseCart/>} />
                    <Route path="/order-successfull" element={<OrderSuccessful />} />
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
                    <Route
                        path="videos/:videoId"
                        element={<PublicVideoForm />}
                    />
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
