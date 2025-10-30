import React from 'react';

interface HeartIconProps extends React.SVGProps<SVGSVGElement> {
    isFavorited: boolean;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ isFavorited, ...props }) => {
    const favoritedClasses = "text-pink-500 fill-current";
    const defaultClasses = "text-gray-400 fill-none";

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5} {...props} className={`${props.className} ${isFavorited ? favoritedClasses : defaultClasses}`}>
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
    );
};
