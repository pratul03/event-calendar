/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  isToday,
} from "date-fns";
import { Event } from "../types/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Edit2Icon, Trash2Icon, X, MenuSquare } from "lucide-react"; // Import X icon for close button
import { toast, Toaster } from "sonner";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SketchPicker } from "react-color";
import { ModeToggle } from "./mode-toggle";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    name: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    date: "",
    color: "#FF5733", // Default color
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        const eventsWithDates = parsedEvents.map((event: Event) => ({
          ...event,
          date: parseISO(event.date),
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Failed to parse events from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("events", JSON.stringify(events));
    } catch (error) {
      console.error("Failed to save events to localStorage:", error);
    }
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setNewEvent({
      name: "",
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      date: format(day, "yyyy-MM-dd"),
      color: "#FF5733", // Default color
    });
    setIsDialogOpen(true);
    setIsEditing(false);
  };

  const handleAddOrEditEvent = () => {
    if (!selectedDate) return;

    if (newEvent.startTime >= newEvent.endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    if (isEditing && editEventId) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editEventId ? { ...event, ...newEvent } : event
        )
      );
      toast.success("Event updated successfully!");
    } else {
      const event: Event = {
        ...newEvent,
        id: uuidv4(),
      };
      setEvents((prevEvents) => [...prevEvents, event]);
      toast.success("Event added successfully!");
    }

    setIsDialogOpen(false);
    setNewEvent({
      name: "",
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      date: "",
      color: "#FF5733", // Reset to default color
    });
    setEditEventId(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    toast.success("Event deleted successfully!");
  };

  const handleEditEvent = (event: Event) => {
    setIsEditing(true);
    setEditEventId(event.id);
    setNewEvent({
      name: event.name,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      date: event.date,
      color: event.color,
    });
    setIsDialogOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { destination } = result; // Only use `destination`
    const eventId = result.draggableId;
    const newDate = format(daysInMonth[destination.index], "yyyy-MM-dd");

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, date: newDate } : event
      )
    );
    toast.success("Event rescheduled successfully!");
  };

  const exportEventsAsJSON = () => {
    const eventsForMonth = events.filter((event) =>
      isSameDay(parseISO(event.date), currentDate)
    );
    const json = JSON.stringify(eventsForMonth, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events_${format(currentDate, "MMMM_yyyy")}.json`;
    link.click();
    toast.success("Events exported as JSON!");
  };

  const exportEventsAsCSV = () => {
    const eventsForMonth = events.filter((event) =>
      isSameDay(parseISO(event.date), currentDate)
    );
    const headers = "Name,Start Time,End Time,Description,Date,Color\n";
    const csv =
      headers +
      eventsForMonth
        .map(
          (event) =>
            `"${event.name}","${event.startTime}","${event.endTime}","${event.description}","${event.date}","${event.color}"`
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events_${format(currentDate, "MMMM_yyyy")}.csv`;
    link.click();
    toast.success("Events exported as CSV!");
  };

  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const startWeek = startOfWeek(startMonth);
  const endWeek = endOfWeek(endMonth);

  const daysInMonth = eachDayOfInterval({ start: startWeek, end: endWeek });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  // Function to trim event title
  const trimEventTitle = (title: string) => {
    return title.length > 10 ? `${title.slice(0, 10)}...` : title;
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col overflow-hidden">
      {/* Sonner Toaster */}
      <Toaster position="bottom-right" expand={true} richColors />

      {/* Sidebar Toggle Button */}
      <Button
        className="fixed top-4 left-4 z-50 mb-4 rounded-sm shadow-lg bg-transparent hover:bg-gray-100/20"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MenuSquare size={28} className="dark:text-white text-black" />
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-secondary shadow-lg transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          {/* Close Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100/20"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Mini Calendar */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-bold">
                  {day[0]}
                </div>
              ))}
              {daysInMonth.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`text-center p-1 rounded ${
                    format(day, "MM") !== format(currentDate, "MM")
                      ? "text-gray-400"
                      : ""
                  } ${
                    isToday(day)
                      ? "bg-teal-500 dark:bg-orange-700 text-white"
                      : "hover:bg-gray-100/20 cursor-pointer"
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  {format(day, "d")}
                </div>
              ))}
            </div>
          </div>

          {/* All Events List */}
          <div>
            <h3 className="text-lg font-bold mb-4">All Events</h3>
            {events.length === 0 ? (
              <p className="text-gray-500">No events added.</p>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-2 border rounded bg-gray-600/20 shadow-sm"
                    style={{ backgroundColor: event.color }}
                  >
                    <div className="font-bold">
                      {trimEventTitle(event.name)} {/* Trimmed title */}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(parseISO(event.date), "MMM d, yyyy")} |{" "}
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <div className="mt-6 space-y-2">
            <Button onClick={exportEventsAsJSON} className="w-full">
              Export as JSON
            </Button>
            <Button onClick={exportEventsAsCSV} className="w-full">
              Export as CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h1 className="text-2xl font-bold text-center">Event Calendar</h1>
        <span className="text-end">
          <ModeToggle />
        </span>

        <div className="flex justify-between items-center mb-4 mt-2">
          <Button onClick={handlePrevMonth}>Previous</Button>
          <h2 className="text-xl font-bold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button onClick={handleNextMonth}>Next</Button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 grid grid-cols-7 gap-1 text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-bold p-1 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
            {daysInMonth.map((day, index) => (
              <Droppable
                key={day.toISOString()}
                droppableId={day.toISOString()}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-1 text-center border rounded cursor-pointer flex flex-col items-center justify-center ${
                      format(day, "MM") !== format(currentDate, "MM")
                        ? "text-gray-400"
                        : ""
                    } ${
                      isToday(day)
                        ? "bg-teal-500 dark:bg-orange-700 text-white"
                        : isSameDay(day, selectedDate || new Date(0))
                        ? "bg-teal-400/40 dark:bg-orange-200/40"
                        : ""
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    {format(day, "d")}
                    {getEventsForDay(day).map((event, eventIndex) => (
                      <Draggable
                        key={event.id}
                        draggableId={event.id}
                        index={eventIndex}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-1 mt-1 rounded text-xs"
                            style={{
                              backgroundColor: event.color,
                              ...provided.draggableProps.style,
                            }}
                          >
                            {trimEventTitle(event.name)} {/* Trimmed title */}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Event Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Event" : "Add Event"} on{" "}
                {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, name: e.target.value })
                }
              />
              <Input
                type="time"
                value={newEvent.startTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startTime: e.target.value })
                }
              />
              <Input
                type="time"
                value={newEvent.endTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endTime: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
              <SketchPicker
                color={newEvent.color}
                onChangeComplete={(color) =>
                  setNewEvent({ ...newEvent, color: color.hex })
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddOrEditEvent}>
                {isEditing ? "Save Changes" : "Add Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">
              Events on {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            {getEventsForDay(selectedDate).map((event) => (
              <div key={event.id} className="p-2 border rounded mb-2">
                <div className="font-bold">{event.name}</div>
                <div>
                  {event.startTime} - {event.endTime}
                </div>
                <div>{event.description}</div>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" onClick={() => handleEditEvent(event)}>
                    <Edit2Icon />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
