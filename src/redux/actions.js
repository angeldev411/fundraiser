export const setLoading = function setLoading(bool) {
    return {
        type: actionTypes.LOADING,
        isLoading: bool,
    };
};
