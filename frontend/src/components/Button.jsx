// Button component
export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    style,
    disabled,
    ...props
}) {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            type={type}
            style={style}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
