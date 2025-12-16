import { cn } from "../../utils/utils";

export function Card({ className, children, ...props }) {
    return (
        <div
            {...props}
            className={cn("rounded-2xl border bg-white shadow-sm p-0", className)}
        >
            {children}
        </div>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div
            {...props}
            className={cn("p-4 md:p-6", className)}
        >
            {children}
        </div>
    );
}
