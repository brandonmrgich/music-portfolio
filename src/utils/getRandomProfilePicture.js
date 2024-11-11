import React from 'react';
import defaultPfp from '../pictures/profile-default.jpg';

// Get a random pfp
export function getRandomProfilePicture() {
    const images = require.context(
        '../pictures',
        false,
        /^\.\/profile-.*\.(png|jpe?g|svg|gif|bmp|webp|aif)$/
    );

    let image = defaultPfp;
    try {
        const imageKeys = images.keys();
        const randomIndex = Math.floor(Math.random() * imageKeys.length);
        image = images(imageKeys[randomIndex]);
    } catch {
        console.error('Falling back to default image');
    }
    return image;
}

export default getRandomProfilePicture;
