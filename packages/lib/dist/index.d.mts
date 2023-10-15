import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
}
declare function Button({ children, onClick }: ButtonProps): React.JSX.Element;

export { ButtonProps, Button as default };
