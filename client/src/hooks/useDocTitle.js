const useDocTitle = (title) => {
    if (title) document.title = title;
    return document.title;
};
export default useDocTitle;
