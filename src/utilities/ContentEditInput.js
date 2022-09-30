//Select all value when click
export const selectAllInlinetext = (e) => {
  e.target.focus();
  e.target.select();
};

//OnKeyDown
export const saveAfterEnter = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    e.target.blur();
  }
};
