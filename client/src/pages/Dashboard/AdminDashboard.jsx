import { ROLE } from '@/constant';
import { withRoleProtection } from '@/utils';
import React from 'react'

const AdminDashboard = () => {
    return (
        <div className="flex items-center justify-center grow w-full">
            <h1 className="text-2xl font-bold">
                Admin Dashboard
            </h1>
        </div>
    )
}

export default withRoleProtection(AdminDashboard, [ROLE.ADMIN]);
