export const loadEvents = (): Event[] => {
  try {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  } catch (error) {
    console.error("Failed to load events from localStorage", error);
    return [];
  }
};

export const saveEvents = (events: Event[]) => {
  try {
    localStorage.setItem("events", JSON.stringify(events));
  } catch (error) {
    console.error("Failed to save events to localStorage", error);
  }
};
