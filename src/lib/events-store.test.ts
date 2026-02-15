import { describe, it, expect, beforeEach } from "vitest";
import {
  getEvents,
  getUpcomingEvents,
  getPastEvents,
  addEvent,
  resetEventsStore,
} from "./events-store";

describe("events-store", () => {
  beforeEach(() => {
    resetEventsStore();
  });

  it("starts empty after reset", () => {
    expect(getEvents()).toHaveLength(0);
  });

  it("adds an event", () => {
    const event = addEvent({
      title: "Test Event",
      date: "2027-01-01",
      description: "A test event",
    });
    expect(event.id).toBeTruthy();
    expect(getEvents()).toHaveLength(1);
  });

  it("separates upcoming and past events", () => {
    addEvent({ title: "Future", date: "2027-12-01", description: "Future event" });
    addEvent({ title: "Past", date: "2020-01-01", description: "Past event" });

    expect(getUpcomingEvents()).toHaveLength(1);
    expect(getUpcomingEvents()[0].title).toBe("Future");
    expect(getPastEvents()).toHaveLength(1);
    expect(getPastEvents()[0].title).toBe("Past");
  });
});
