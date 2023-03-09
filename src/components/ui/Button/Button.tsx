import clsx from "clsx"

export type ButtonProps = {
    variant?: 'primary' | 'secondary'
    onClick?: () => void
    disabled?: boolean
    children: React.ReactNode
}

export const Button = ({
    variant = 'primary',
    onClick,
    disabled,
    children,
}: ButtonProps) => {
    return (

        <button
            className={clsx(
                variant === 'primary' && 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
                variant === 'secondary' && 'text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700',
                'text-sm focus:outline-none focus:ring-4 font-medium rounded-lg mx-2 my-1'
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>

)};