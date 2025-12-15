exports.failResponse = (data) => {
    return {
        status: 'fail',
        data: data,
    };
};
