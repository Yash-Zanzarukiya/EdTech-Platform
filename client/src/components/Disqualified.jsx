import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function DisqualificationPage() {
    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <CardTitle className="text-3xl font-bold text-red-600">
                        Exam Disqualification Notice
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg text-center ">
                        We regret to inform you that you have been disqualified
                        from the exam.
                    </p>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Possible Reasons for Disqualification:
                        </h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Violation of exam rules or procedures</li>
                            <li>Use of unauthorized materials or devices</li>
                            <li>Inappropriate behavior during the exam</li>
                            <li>Failure to meet prerequisite requirements</li>
                            <li>
                                Suspicious activity detected by our proctoring
                                system
                            </li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button className="w-full sm:w-auto">
                        Appeal Disqualification
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
