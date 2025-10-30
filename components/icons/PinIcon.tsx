import React from 'react';

interface PinIconProps extends React.SVGProps<SVGSVGElement> {
    isPinned: boolean;
}

export const PinIcon: React.FC<PinIconProps> = ({ isPinned, ...props }) => {
    if (isPinned) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
                <path d="M3.5 2.75a.75.75 0 0 0-1.5 0v14.5a.75.75 0 0 0 1.5 0v-4.392l1.657-.348a6.449 6.449 0 0 1 4.271.572 7.948 7.948 0 0 0 5.965.524l.338-.057a.75.75 0 0 0-.26-1.45l-1.152-.192a.75.75 0 0 0-.64.23L13 12.25l-1.5-2.5-1.5-2.5a.75.75 0 0 0-1.28-.53L3.5 10.142V2.75Z" />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
        </svg>
    );
};