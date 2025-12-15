exports.errorResponse = (message) => {
    return {
        status: 'error',
        message: message,
    };
};
