import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ( { imageUrl } ) => {
    return (
        <div className='my-center ma'>
            <div className='absolute mt2'>
                <img alt='' src={imageUrl} width='500px' height='auto' />
            </div>
        </div>
    );

}

export default FaceRecognition;