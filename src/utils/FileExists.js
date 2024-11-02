export const fileExists = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            console.log('File exists.');
            return true;
        } else {
            console.log('File does not exist.');
            return false;
        }
    } catch (error) {
        console.error('Error checking file:', error);
        return false;
    }
};
