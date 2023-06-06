// import Icon from './../Icon';


const DropdownItem = ({
  text,
  icon,
  onClick,
  children,
  className
}) => (
  <button
    className={`
      uik-dropdown__item
      ${className || ''}
    `}
    onClick={onClick}
    type='button'
  >
    {
      !!icon &&
      <div className="uik-dropdown__item-icon">           
        {/* <Icon
          className='uik-button__icon'
          icon={icon}
        /> */}
      </div>
    }
    <span className="uik-dropdown__item-text">{children}{text}</span>
  </button>
);

export default DropdownItem