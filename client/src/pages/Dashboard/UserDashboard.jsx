import { ROLE } from '@/constant';
import { withRoleProtection } from '@/utils';
import React from 'react';
import { CheckCheck, GoalIcon, ShoppingCart } from 'lucide-react';
import {
    CourseEnrollments,
    DashboardGoalsCard,
    UserDashboardCards,
} from '@/components';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { ReaderIcon } from '@radix-ui/react-icons';

function UserDashboard() {
    const dashboardCards = [
        {
            title: 'Courses Purchased',
            icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
            figure: '08',
            insight: "Congratulations! You've bought 3 courses this month.",
        },
        {
            title: 'Active Goals',
            icon: <GoalIcon className="h-4 w-4 text-muted-foreground" />,
            figure: '04',
            insight: "You're making progress on all your goals.",
        },
        {
            title: 'Total Learning Hours',
            icon: <ReaderIcon className="h-4 w-4 text-muted-foreground" />,
            figure: '73',
            insight: "You've spent 10 hours this week learning.",
        },
        {
            title: 'Certificates Earned',
            icon: (
                <AiFillSafetyCertificate className="h-4 w-4 text-muted-foreground" />
            ),
            figure: '02',
            insight: 'Great job! You’ve earned 2 new certificates.',
        },
        {
            title: 'Quizzes Completed',
            icon: <CheckCheck className="h-4 w-4 text-muted-foreground" />,
            figure: '73',
            insight: "You've spent 10 hours this week learning.",
        },
    ];
    return (
        <div className="flex flex-col h-fit w-full">
            <header className="flex flex-col gap-1 justify-between p-3 px-8">
                <h1 className="text-xl font-semibold">Welcome Back Yash</h1>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 md:pt-0">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
                    {dashboardCards.map((card, index) => (
                        <UserDashboardCards
                            key={index}
                            card={card}
                            index={index}
                        />
                    ))}
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <CourseEnrollments />
                    <DashboardGoalsCard />
                    <CourseEnrollments />
                </div>
            </main>
        </div>
    );
}
export default withRoleProtection(UserDashboard, [ROLE.USER]);
