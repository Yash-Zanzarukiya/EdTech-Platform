import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function UserDashboardCards({ card, index }) {
    return (
        <Card key={index} x-chunk={`dashboard-01-chunk-${index + 1}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {card.title}
                </CardTitle>
                {card.icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold pb-1">{card.figure}</div>
                <p className="text-xs text-muted-foreground">{card.insight}</p>
            </CardContent>
        </Card>
    );
}

export default UserDashboardCards;
