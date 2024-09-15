import React from 'react';

function Container({ children, cName }) {
    return (
        <div className={'flex items-start justify-center grow ' + cName}>
            {children}
        </div>
    );
}

export default Container;
