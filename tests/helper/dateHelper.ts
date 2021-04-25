const today = new Date();

export const startOfNextMonth = new Date(
    Date.UTC(today.getFullYear(), today.getMonth() + 1, 1)
);
