import { describe, it, expect } from "vitest";
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getFaqSchema,
} from "./structured-data";

describe("getOrganizationSchema", () => {
  it("returns valid Organization schema", () => {
    const schema = getOrganizationSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBeTruthy();
    expect(schema.url).toBeTruthy();
    expect(schema.address["@type"]).toBe("PostalAddress");
    expect(schema.address.addressCountry).toBe("DE");
  });
});

describe("getLocalBusinessSchema", () => {
  it("returns valid Mosque schema with geo coordinates", () => {
    const schema = getLocalBusinessSchema();
    expect(schema["@type"]).toBe("Mosque");
    expect(schema.geo["@type"]).toBe("GeoCoordinates");
    expect(schema.geo.latitude).toBeTypeOf("number");
    expect(schema.geo.longitude).toBeTypeOf("number");
  });
});

describe("getFaqSchema", () => {
  it("returns valid FAQPage schema with questions", () => {
    const schema = getFaqSchema();
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity.length).toBeGreaterThan(0);
    schema.mainEntity.forEach((q: any) => {
      expect(q["@type"]).toBe("Question");
      expect(q.name).toBeTruthy();
      expect(q.acceptedAnswer["@type"]).toBe("Answer");
      expect(q.acceptedAnswer.text).toBeTruthy();
    });
  });
});
