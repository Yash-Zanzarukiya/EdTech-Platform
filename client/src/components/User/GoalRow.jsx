import React from 'react';
import { ArrowRight, ArrowRightSquare, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { TableCell, TableRow } from '@/components/ui/table';

export default function GoalRow({ goal }) {
    return (
        <TableRow key={goal._id}>
            <TableCell>
                <div className="font-medium">{goal.name}</div>
            </TableCell>
            <TableCell className="text-center">{goal.progress}%</TableCell>
            <TableCell className="text-right">
                <Button size="small" className="p-1">
                    <ArrowRight className="size-5" />
                </Button>
            </TableCell>
        </TableRow>
    );
}
